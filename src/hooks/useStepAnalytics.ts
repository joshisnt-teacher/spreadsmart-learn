import { useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

type EventType = 'step_start' | 'step_complete' | 'check_fail' | 'hint_used';

export function useStepAnalytics(moduleId: string, lessonId: string, userId: string | undefined) {
  const stepStartTime = useRef<Record<string, number>>({});

  const logEvent = useCallback(
    async (stepId: string, eventType: EventType, metadata: Record<string, unknown> = {}) => {
      if (!userId) return;

      // Track start time
      if (eventType === 'step_start') {
        stepStartTime.current[stepId] = Date.now();
      }

      // Compute time_spent on complete
      if (eventType === 'step_complete' && stepStartTime.current[stepId]) {
        const elapsed = Math.round((Date.now() - stepStartTime.current[stepId]) / 1000);
        metadata.time_spent_seconds = elapsed;
        delete stepStartTime.current[stepId];
      }

      await supabase.from('step_events').insert([{
        user_id: userId,
        module_id: moduleId,
        lesson_id: lessonId,
        step_id: stepId,
        event_type: eventType,
        metadata: metadata as any,
      }]);
    },
    [moduleId, lessonId, userId],
  );

  return { logEvent };
}
