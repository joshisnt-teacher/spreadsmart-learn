import React from 'react';
import QuizStep from '@/components/QuizStep';
import type { QuizBlock } from '@/types/module-v2';
import { BlockContext } from './BlockRegistry';

interface Props {
  block: QuizBlock;
  context: BlockContext;
}

/**
 * Wraps the existing QuizStep as a block renderer.
 */
export const QuizBlockRenderer: React.FC<Props> = ({ block, context }) => {
  // In the new model, the quiz question text lives in a preceding TextBlock.
  // The QuizBlock only holds the interactive question payload.
  const questionText = block.question.explanation || 'Answer the question below.';

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <QuizStep
        quiz={block.question}
        question={questionText}
        feedback={null}
        onAnswerChange={(answer) => {
          // TODO: wire into BlockContext.onCheck via marking engine
          console.log('Quiz answer:', answer);
        }}
        answer=""
      />
    </div>
  );
};
