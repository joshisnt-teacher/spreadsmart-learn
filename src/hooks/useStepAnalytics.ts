import { useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

type EventType = 'step_start' | 'step_complete' | 'check_fail' | 'hint_used' | 'stuck';

export function useStepAnalytics(moduleId: string, lessonId: string, userId: string | undefined, disabled?: boolean) {
  const stepStartTime = useRef<Record<string, number>>({});

  const logEvent = useCallback(
    async (stepId: string, eventType: EventType, metadata: Record<string, unknown> = {}) => {
      if (!userId || disabled) return;

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

      const { error } = await supabase.from('step_events').insert([{
        user_id: userId,
        module_id: moduleId,
        lesson_id: lessonId,
        step_id: stepId,
        event_type: eventType,
        metadata: metadata as any,
      }]);

      if (error) {
        console.warn('Failed to log step event:', error.message);
      }
    },
    [moduleId, lessonId, userId, disabled],
  );

  return { logEvent };
}
