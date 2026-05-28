-- Update compress_lesson_events to read xp_earned from step_complete metadata
CREATE OR REPLACE FUNCTION public.compress_lesson_events(_user_id UUID, _module_id TEXT, _lesson_id TEXT)
RETURNS TABLE (steps_compressed INTEGER, events_read INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _step_id TEXT;
  _attempts INTEGER;
  _first_correct BOOLEAN;
  _hints INTEGER;
  _started_at TIMESTAMPTZ;
  _completed_at TIMESTAMPTZ;
  _total_time INTEGER;
  _xp_earned INTEGER;
  _events_count INTEGER;
  _steps_count INTEGER := 0;
  _complete_metadata JSONB;
BEGIN
  SELECT COUNT(*) INTO _events_count
  FROM public.step_events
  WHERE user_id = _user_id AND module_id = _module_id AND lesson_id = _lesson_id;

  IF _events_count = 0 THEN
    RETURN QUERY SELECT 0, 0;
    RETURN;
  END IF;

  FOR _step_id IN
    SELECT DISTINCT step_id
    FROM public.step_events
    WHERE user_id = _user_id AND module_id = _module_id AND lesson_id = _lesson_id
    ORDER BY step_id
  LOOP
    SELECT COUNT(*) INTO _attempts
    FROM public.step_events
    WHERE user_id = _user_id AND module_id = _module_id AND lesson_id = _lesson_id AND step_id = _step_id AND event_type = 'check_fail';

    SELECT created_at, metadata INTO _completed_at, _complete_metadata
    FROM public.step_events
    WHERE user_id = _user_id AND module_id = _module_id AND lesson_id = _lesson_id AND step_id = _step_id AND event_type = 'step_complete'
    ORDER BY created_at DESC
    LIMIT 1;

    IF _complete_metadata IS NOT NULL THEN
      _attempts := COALESCE((_complete_metadata->>'attempt_count')::integer, _attempts + 1);
      _first_correct := COALESCE((_complete_metadata->>'attempt_count')::integer, 999) = 1;
      _total_time := COALESCE((_complete_metadata->>'time_spent_seconds')::integer, NULL);
      _xp_earned := COALESCE((_complete_metadata->>'xp_earned')::integer, 0);
    ELSE
      _first_correct := NULL;
      _total_time := NULL;
      _xp_earned := 0;
    END IF;

    SELECT COUNT(*) INTO _hints
    FROM public.step_events
    WHERE user_id = _user_id AND module_id = _module_id AND lesson_id = _lesson_id AND step_id = _step_id AND event_type = 'hint_used';

    SELECT created_at INTO _started_at
    FROM public.step_events
    WHERE user_id = _user_id AND module_id = _module_id AND lesson_id = _lesson_id AND step_id = _step_id AND event_type = 'step_start'
    ORDER BY created_at ASC
    LIMIT 1;

    IF _total_time IS NULL AND _started_at IS NOT NULL AND _completed_at IS NOT NULL THEN
      _total_time := GREATEST(EXTRACT(EPOCH FROM (_completed_at - _started_at))::integer, 0);
    END IF;

    INSERT INTO public.step_summaries (
      user_id, module_id, lesson_id, step_id,
      attempts, first_attempt_correct, hints_used,
      started_at, completed_at, total_time_seconds, xp_earned
    ) VALUES (
      _user_id, _module_id, _lesson_id, _step_id,
      _attempts, _first_correct, _hints,
      _started_at, _completed_at, _total_time, _xp_earned
    )
    ON CONFLICT (user_id, module_id, lesson_id, step_id)
    DO UPDATE SET
      attempts = EXCLUDED.attempts,
      first_attempt_correct = EXCLUDED.first_attempt_correct,
      hints_used = EXCLUDED.hints_used,
      started_at = EXCLUDED.started_at,
      completed_at = EXCLUDED.completed_at,
      total_time_seconds = EXCLUDED.total_time_seconds,
      xp_earned = EXCLUDED.xp_earned,
      updated_at = now();

    _steps_count := _steps_count + 1;
  END LOOP;

  RETURN QUERY SELECT _steps_count, _events_count;
END;
$$;

-- Backfill function: compress all historical step events and build module_completions
CREATE OR REPLACE FUNCTION public.backfill_all_compressions()
RETURNS TABLE (lessons_processed INTEGER, total_steps_compressed INTEGER, total_events_read INTEGER)
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

  RETURN QUERY SELECT _lessons, _steps, _events;
END;
$$;
