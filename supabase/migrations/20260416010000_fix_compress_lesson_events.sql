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
    WHERE user_id = _user_id AND module_id = _module_id AND lesson_id = _lesson_id AND step_id = _step_id AND event_type = 'attempt';

    SELECT (metadata->>'correct')::boolean INTO _first_correct
    FROM public.step_events
    WHERE user_id = _user_id AND module_id = _module_id AND lesson_id = _lesson_id AND step_id = _step_id AND event_type = 'attempt'
    ORDER BY created_at ASC
    LIMIT 1;

    SELECT COUNT(*) INTO _hints
    FROM public.step_events
    WHERE user_id = _user_id AND module_id = _module_id AND lesson_id = _lesson_id AND step_id = _step_id AND event_type = 'hint';

    SELECT created_at INTO _started_at
    FROM public.step_events
    WHERE user_id = _user_id AND module_id = _module_id AND lesson_id = _lesson_id AND step_id = _step_id AND event_type = 'start'
    ORDER BY created_at ASC
    LIMIT 1;

    SELECT created_at INTO _completed_at
    FROM public.step_events
    WHERE user_id = _user_id AND module_id = _module_id AND lesson_id = _lesson_id AND step_id = _step_id AND event_type = 'complete'
    ORDER BY created_at DESC
    LIMIT 1;

    IF _started_at IS NOT NULL AND _completed_at IS NOT NULL THEN
      _total_time := GREATEST(EXTRACT(EPOCH FROM (_completed_at - _started_at))::integer, 0);
    ELSE
      _total_time := NULL;
    END IF;

    SELECT COALESCE((metadata->>'xp')::integer, 0) INTO _xp_earned
    FROM public.step_events
    WHERE user_id = _user_id AND module_id = _module_id AND lesson_id = _lesson_id AND step_id = _step_id AND event_type = 'complete'
    ORDER BY created_at DESC
    LIMIT 1;

    -- Default to 0 if no complete event exists
    IF _xp_earned IS NULL THEN
      _xp_earned := 0;
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
