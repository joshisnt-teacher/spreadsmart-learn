
-- Create step_events table for analytics
CREATE TABLE public.step_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  module_id text NOT NULL,
  lesson_id text NOT NULL,
  step_id text NOT NULL,
  event_type text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for fast aggregation queries
CREATE INDEX idx_step_events_aggregation ON public.step_events (module_id, lesson_id, step_id, event_type);
CREATE INDEX idx_step_events_user ON public.step_events (user_id);

-- Enable RLS
ALTER TABLE public.step_events ENABLE ROW LEVEL SECURITY;

-- Students can insert their own events
CREATE POLICY "Students can insert own events"
ON public.step_events FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Students can view their own events
CREATE POLICY "Students can view own events"
ON public.step_events FOR SELECT
USING (auth.uid() = user_id);

-- Teachers can view all events for analytics
CREATE POLICY "Teachers can view all events"
ON public.step_events FOR SELECT
USING (has_role(auth.uid(), 'teacher'::app_role));
