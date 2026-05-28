-- Helper to find module_id for a lesson_id
CREATE OR REPLACE FUNCTION public._find_module_for_lesson(_lesson_id TEXT)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT module_id FROM public.step_events WHERE lesson_id = _lesson_id LIMIT 1;
$$;

-- Backfill step_summaries from lesson_progress for lessons that have no step_events
CREATE OR REPLACE FUNCTION public.backfill_step_summaries_from_lesson_progress()
RETURNS TABLE (rows_inserted INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _lp RECORD;
  _step_id TEXT;
  _module_id TEXT;
  _attempts INTEGER;
  _first_correct BOOLEAN;
  _inserted INTEGER := 0;
BEGIN
  FOR _lp IN
    SELECT
      lp.user_id,
      lp.lesson_id,
      lp.completed_step_ids,
      lp.attempts,
      lp.updated_at
    FROM public.lesson_progress lp
    WHERE lp.completed_step_ids IS NOT NULL AND array_length(lp.completed_step_ids, 1) > 0
  LOOP
    _module_id := public._find_module_for_lesson(_lp.lesson_id);

    IF _module_id IS NULL THEN
      SELECT mp.module_id INTO _module_id
      FROM public.module_progress mp
      WHERE _lp.lesson_id = ANY(mp.completed_lesson_ids)
      LIMIT 1;
    END IF;

    IF _module_id IS NULL THEN
      CONTINUE;
    END IF;

    FOR _step_id IN SELECT unnest(_lp.completed_step_ids)
    LOOP
      PERFORM 1 FROM public.step_summaries
      WHERE user_id = _lp.user_id AND module_id = _module_id AND lesson_id = _lp.lesson_id AND step_id = _step_id
      LIMIT 1;

      IF FOUND THEN
        CONTINUE;
      END IF;

      _attempts := COALESCE((_lp.attempts->>_step_id)::integer, 1);
      _first_correct := _attempts = 1;

      INSERT INTO public.step_summaries (
        user_id, module_id, lesson_id, step_id,
        attempts, first_attempt_correct, hints_used,
        started_at, completed_at, total_time_seconds, xp_earned
      ) VALUES (
        _lp.user_id, _module_id, _lp.lesson_id, _step_id,
        _attempts, _first_correct, 0,
        NULL, _lp.updated_at, NULL, 0
      )
      ON CONFLICT (user_id, module_id, lesson_id, step_id)
      DO NOTHING;

      IF FOUND THEN
        _inserted := _inserted + 1;
      END IF;
    END LOOP;
  END LOOP;

  RETURN QUERY SELECT _inserted;
END;
$$;

-- Drop and recreate backfill_all_compressions with new return signature
DROP FUNCTION IF EXISTS public.backfill_all_compressions();

CREATE FUNCTION public.backfill_all_compressions()
RETURNS TABLE (lessons_processed INTEGER, total_steps_compressed INTEGER, total_events_read INTEGER, synthetic_rows_inserted INTEGER)
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

  RETURN QUERY SELECT _lessons, _steps, _events, _synthetic;
END;
$$;
