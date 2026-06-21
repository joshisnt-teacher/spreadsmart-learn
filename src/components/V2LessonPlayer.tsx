import React, { useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StepLayoutEngine } from '@/components/blocks/StepLayoutEngine';
import type { BlockContext, BlockResponseParams } from '@/components/blocks/BlockRegistry';
import { useBlockResponse } from '@/hooks/useBlockResponse';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Lesson } from '@/types/module-v2';

// Block types that require a response before the step is marked complete
const INTERACTIVE_TYPES = new Set([
  'fill-blank', 'word-match', 'drag-sort', 'image-hotspot', 'true-false',
  'label-diagram', 'sequence', 'crossword', 'quiz', 'spreadsheet',
  'chart-builder', 'interactive-table', 'flashcard',
]);

interface Props {
  lesson: Lesson;
  moduleId: string;
  onComplete: (xpEarned: number) => void;
  onBack: () => void;
}

export const V2LessonPlayer: React.FC<Props> = ({ lesson, moduleId, onComplete, onBack }) => {
  const isMobile = useIsMobile();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [responses, setResponses] = useState<Map<string, BlockResponseParams>>(new Map());
  const { submitResponse } = useBlockResponse();

  const currentStep = lesson.steps[currentStepIndex];
  const isLastStep = currentStepIndex === lesson.steps.length - 1;
  const progressPercent = (currentStepIndex / lesson.steps.length) * 100;

  const interactiveBlocks = currentStep.blocks.filter(b => INTERACTIVE_TYPES.has(b.type));
  const isInstructionStep = interactiveBlocks.length === 0;
  const isStepComplete = isInstructionStep || interactiveBlocks.every(b => {
    const withId = b as { blockId?: string };
    return withId.blockId ? responses.has(withId.blockId) : true;
  });

  const handleResponse = useCallback(async (params: BlockResponseParams) => {
    setResponses(prev => new Map(prev).set(params.blockId, params));
    await submitResponse({
      moduleId,
      lessonId: lesson.id,
      stepId: currentStep.id,
      blockId: params.blockId,
      blockType: params.blockType,
      correct: params.correct,
      answer: params.answer,
      attemptNumber: 1,
    });
  }, [moduleId, lesson.id, currentStep.id, submitResponse]);

  const handleContinue = useCallback(async () => {
    const stepXp = currentStep.scoring?.xpValue ?? 5;
    const newTotalXp = totalXp + stepXp;
    setTotalXp(newTotalXp);

    if (isLastStep) {
      onComplete(newTotalXp);
      return;
    }

    setCurrentStepIndex(prev => prev + 1);
    setResponses(new Map());
  }, [currentStep, isLastStep, totalXp, onComplete]);

  const handlePrevious = useCallback(() => {
    if (currentStepIndex === 0) return;
    setCurrentStepIndex(prev => prev - 1);
    setResponses(new Map());
  }, [currentStepIndex]);

  const context: BlockContext = {
    stepId: currentStep.id,
    lessonId: lesson.id,
    moduleId,
    onResponse: handleResponse,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-card px-4 py-3 flex items-center gap-3 shrink-0">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{lesson.title}</p>
          <p className="text-xs text-muted-foreground">
            Step {currentStepIndex + 1} of {lesson.steps.length}: {currentStep.title}
          </p>
        </div>
      </header>

      <Progress value={progressPercent} className="h-1 rounded-none" />

      <div className="flex-1 flex flex-col min-h-0 overflow-auto">
        <StepLayoutEngine step={currentStep} context={context} isMobile={isMobile} />
      </div>

      <footer className="border-t bg-card px-4 py-3 flex items-center justify-between shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevious}
          disabled={currentStepIndex === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Previous
        </Button>
        <Button
          size="sm"
          onClick={handleContinue}
          disabled={!isStepComplete}
        >
          {isLastStep ? 'Finish' : 'Continue'} <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </footer>
    </div>
  );
};
