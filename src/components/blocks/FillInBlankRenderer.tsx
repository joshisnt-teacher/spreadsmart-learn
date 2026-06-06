import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { FillInBlankBlock } from '@/types/module-v2';
import type { BlockContext } from './BlockRegistry';

interface Props {
  block: FillInBlankBlock;
  context: BlockContext;
}

export const FillInBlankRenderer: React.FC<Props> = ({ block, context }) => {
  const [values, setValues] = useState<string[]>(block.blanks.map(() => ''));
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);

  const handleCheck = () => {
    if (submitted) return;
    const checked = block.blanks.map((blank, i) =>
      blank.accepted.some(a => a.toLowerCase() === values[i].trim().toLowerCase())
    );
    setResults(checked);
    setSubmitted(true);
    context.onResponse?.({
      blockId: block.blockId,
      blockType: 'fill-blank',
      correct: checked.every(Boolean),
      answer: values,
    });
  };

  const parts = block.text.split('{{blank}}');

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
      <p className="text-base leading-loose">
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            <span>{part}</span>
            {i < block.blanks.length && (
              <input
                role="textbox"
                value={values[i]}
                onChange={e => {
                  if (submitted) return;
                  const next = [...values];
                  next[i] = e.target.value;
                  setValues(next);
                }}
                disabled={submitted}
                className={`inline-block w-28 mx-1 px-2 py-0.5 border-b-2 bg-transparent text-center text-sm focus:outline-none transition-colors
                  ${submitted
                    ? results[i]
                      ? 'border-green-500 text-green-700'
                      : 'border-red-500 text-red-700'
                    : 'border-primary focus:border-primary/70'
                  }`}
              />
            )}
          </React.Fragment>
        ))}
      </p>

      {!submitted && (
        <Button onClick={handleCheck} className="self-start">
          Check
        </Button>
      )}

      {submitted && (
        <div className={`text-sm font-medium px-4 py-2 rounded-lg ${results.every(Boolean) ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {results.every(Boolean) ? 'All correct!' : `${results.filter(Boolean).length} of ${results.length} correct.`}
        </div>
      )}
    </div>
  );
};
