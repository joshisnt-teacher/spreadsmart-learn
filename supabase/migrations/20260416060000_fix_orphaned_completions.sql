-- Ensure module_completions exist for any user with step_summaries or lesson_progress
-- even if they don't have a module_progress row

CREATE OR REPLACE FUNCTION public.backfill_missing_module_completions()
RETURNS TABLE (rows_inserted INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _rec RECORD;
  _inserted INTEGER := 0;
BEGIN
  -- Find all (user_id, module_id) pairs that have step_summaries but no module_completions
  FOR _rec IN
    SELECT DISTINCT ss.user_id, ss.module_id
    FROM public.step_summaries ss
    WHERE NOT EXISTS (
      SELECT 1 FROM public.module_completions mc
      WHERE mc.user_id = ss.user_id AND mc.module_id = ss.module_id
    )
  LOOP
    INSERT INTO public.module_completions (
      user_id, module_id, completed_lesson_ids, total_xp,
      fully_completed, first_completed_at, last_completed_at, updated_at
    )
    SELECT
      _rec.user_id,
      _rec.module_id,
      COALESCE(
        (SELECT array_agg(DISTINCT lesson_id)
         FROM public.lesson_progress lp
         WHERE lp.user_id = _rec.user_id AND lp.completed = true
           AND lp.lesson_id IN (
             SELECT se.lesson_id FROM public.step_events se
             WHERE se.user_id = _rec.user_id AND se.module_id = _rec.module_id
             UNION
             SELECT ss.lesson_id FROM public.step_summaries ss
             WHERE ss.user_id = _rec.user_id AND ss.module_id = _rec.module_id
           )
        ),
        ARRAY[]::text[]
      ),
      COALESCE(
        (SELECT SUM(lp.total_xp)
         FROM public.lesson_progress lp
         WHERE lp.user_id = _rec.user_id AND lp.completed = true
           AND lp.lesson_id IN (
             SELECT se.lesson_id FROM public.step_events se
             WHERE se.user_id = _rec.user_id AND se.module_id = _rec.module_id
             UNION
             SELECT ss.lesson_id FROM public.step_summaries ss
             WHERE ss.user_id = _rec.user_id AND ss.module_id = _rec.module_id
           )
        ),
        0
      ),
      FALSE,
      NULL,
      NULL,
      now()
    ON CONFLICT (user_id, module_id)
    DO NOTHING;

    IF FOUND THEN
      _inserted := _inserted + 1;
    END IF;
  END LOOP;

  RETURN QUERY SELECT _inserted;
END;
$$;

-- Update backfill_all_compressions to also fix orphaned completions
DROP FUNCTION IF EXISTS public.backfill_all_compressions();

CREATE FUNCTION public.backfill_all_compressions()
RETURNS TABLE (lessons_processed INTEGER, total_steps_compressed INTEGER, total_events_read INTEGER, synthetic_rows_inserted INTEGER, completions_inserted INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _rec RECORD;
  _result RECORD;
  _lessons INTEGER := 0;
  _steps INTEGER := 0;
  _events INTEGER := 0;
  _synthetic INTEGER;
  _completions INTEGER;
BEGIN
  FOR _rec IN
    SELECT user_id, module_id, lesson_id
    FROM public.step_events
    GROUP BY user_id, module_id, lesson_id
    ORDER BY user_id, module_id, lesson_id
  LOOP
    SELECT * INTO _result FROM public.compress_lesson_events(_rec.user_id, _rec.module_id, _rec.lesson_id);
    _lessons := _lessons + 1;
    _steps := _steps + _result.steps_compressed;
    _events := _events + _result.events_read;
  END LOOP;

  SELECT * INTO _result FROM public.backfill_step_summaries_from_lesson_progress();
  _synthetic := _result.rows_inserted;

  -- Upsert module_completions from module_progress
  INSERT INTO public.module_completions (
    user_id, module_id, completed_lesson_ids, total_xp,
    fully_completed, first_completed_at, last_completed_at, updated_at
  )
  SELECT
    mp.user_id,
    mp.module_id,
    mp.completed_lesson_ids,
    mp.total_xp,
    FALSE,
    NULL,
    NULL,
    now()
  FROM public.module_progress mp
  ON CONFLICT (user_id, module_id)
  DO UPDATE SET
    completed_lesson_ids = EXCLUDED.completed_lesson_ids,
    total_xp = EXCLUDED.total_xp,
    updated_at = now();

  -- Fix any missing module_completions for users with summaries but no module_progress
  SELECT * INTO _result FROM public.backfill_missing_module_completions();
  _completions := _result.rows_inserted;

  RETURN QUERY SELECT _lessons, _steps, _events, _synthetic, _completions;
END;
$$;
