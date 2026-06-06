import React, { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TrueFalseBlock } from '@/types/module-v2';
import type { BlockContext } from './BlockRegistry';

interface Props {
  block: TrueFalseBlock;
  context: BlockContext;
}

export const TrueFalseRenderer: React.FC<Props> = ({ block, context }) => {
  const [answered, setAnswered] = useState<boolean | null>(null);

  const handleAnswer = (chosen: boolean) => {
    if (answered !== null) return;
    setAnswered(chosen);
    const isCorrect = chosen === block.correct;
    context.onResponse?.({
      blockId: block.blockId,
      blockType: 'true-false',
      correct: isCorrect,
      answer: chosen,
    });
  };

  const isCorrect = answered !== null && answered === block.correct;

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 max-w-xl mx-auto w-full">
      <div className="text-center bg-muted/50 rounded-xl p-6 w-full">
        <p className="text-base font-medium leading-relaxed">"{block.statement}"</p>
      </div>

      <div className="flex gap-4 w-full max-w-xs">
        <Button
          variant={answered === true ? (block.correct === true ? 'default' : 'destructive') : 'outline'}
          className="flex-1 h-12 text-base font-semibold"
          onClick={() => handleAnswer(true)}
          disabled={answered !== null}
        >
          True
        </Button>
        <Button
          variant={answered === false ? (block.correct === false ? 'default' : 'destructive') : 'outline'}
          className="flex-1 h-12 text-base font-semibold"
          onClick={() => handleAnswer(false)}
          disabled={answered !== null}
        >
          False
        </Button>
      </div>

      {answered !== null && (
        <div
          className={`flex items-start gap-3 p-4 rounded-lg w-full ${
            isCorrect
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {isCorrect
            ? <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
            : <XCircle className="w-5 h-5 mt-0.5 shrink-0" />}
          <div>
            <p className="font-semibold text-sm">{isCorrect ? 'Correct!' : 'Not quite.'}</p>
            <p className="text-sm mt-1">{block.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
};
