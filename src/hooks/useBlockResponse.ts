import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface SubmitParams {
  moduleId: string;
  lessonId: string;
  stepId: string;
  blockId: string;
  blockType: string;
  correct: boolean;
  answer: unknown;
  attemptNumber: number;
}

export function useBlockResponse() {
  const { user } = useAuth();

  const submitResponse = useCallback(async (params: SubmitParams) => {
    if (!user?.id) return;

    await supabase.from('block_responses').insert({
      user_id: user.id,
      module_id: params.moduleId,
      lesson_id: params.lessonId,
      step_id: params.stepId,
      block_id: params.blockId,
      block_type: params.blockType,
      correct: params.correct,
      answer: params.answer as Record<string, unknown>,
      attempt_number: params.attemptNumber,
    });

    await supabase.from('step_events').insert({
      user_id: user.id,
      module_id: params.moduleId,
      lesson_id: params.lessonId,
      step_id: params.stepId,
      event_type: `${params.blockType}:submit`,
      metadata: {
        block_id: params.blockId,
        correct: params.correct,
        answer: params.answer,
        attempt_number: params.attemptNumber,
      },
    });
  }, [user?.id]);

  return { submitResponse };
}
