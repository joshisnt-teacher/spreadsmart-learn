import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import type { WordMatchBlock } from '@/types/module-v2';
import type { BlockContext } from './BlockRegistry';

interface Props {
  block: WordMatchBlock;
  context: BlockContext;
}

export const WordMatchRenderer: React.FC<Props> = ({ block, context }) => {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({}); // termId → defId
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState<Record<string, boolean>>({});

  // Shuffle definitions on mount
  const shuffledDefs = useMemo(() => [...block.pairs].sort(() => Math.random() - 0.5), [block.pairs]);

  const handleTermClick = (termId: string) => {
    if (submitted) return;
    setSelectedTerm(prev => (prev === termId ? null : termId));
  };

  const handleDefClick = (defId: string) => {
    if (submitted || !selectedTerm) return;
    setMatches(prev => ({ ...prev, [selectedTerm]: defId }));
    setSelectedTerm(null);
  };

  const handleCheck = () => {
    if (submitted) return;
    const results: Record<string, boolean> = {};
    for (const pair of block.pairs) {
      // Each pair's id is the same for both term and definition.
      // A correct match is when matches[pair.id] === pair.id.
      results[pair.id] = matches[pair.id] === pair.id;
    }
    setCorrect(results);
    setSubmitted(true);
    context.onResponse?.({
      blockId: block.blockId,
      blockType: 'word-match',
      correct: Object.values(results).every(Boolean),
      answer: matches,
    });
  };

  const allMatched = Object.keys(matches).length === block.pairs.length;

  return (
    <div className="flex flex-col gap-4 p-6 max-w-2xl mx-auto w-full">
      {block.instruction && (
        <p className="text-sm text-muted-foreground">{block.instruction}</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        {/* Terms column */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Terms
          </p>
          {block.pairs.map(pair => {
            const isSelected = selectedTerm === pair.id;
            const isMatched = pair.id in matches;
            const borderColor = submitted
              ? correct[pair.id]
                ? 'border-green-500 bg-green-50'
                : 'border-red-500 bg-red-50'
              : isSelected
              ? 'border-primary bg-primary/5'
              : isMatched
              ? 'border-blue-400 bg-blue-50'
              : 'border-border';
            return (
              <button
                key={pair.id}
                onClick={() => handleTermClick(pair.id)}
                disabled={submitted}
                className={`px-3 py-2 rounded-lg border-2 text-sm font-medium text-left transition-colors ${borderColor}`}
              >
                {pair.term}
              </button>
            );
          })}
        </div>

        {/* Definitions column */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Definitions
          </p>
          {shuffledDefs.map(pair => {
            const isMatched = Object.values(matches).includes(pair.id);
            const matchingTermId = Object.entries(matches).find(([, v]) => v === pair.id)?.[0];
            const borderColor = submitted
              ? matchingTermId && correct[matchingTermId]
                ? 'border-green-500 bg-green-50'
                : matchingTermId
                ? 'border-red-500 bg-red-50'
                : 'border-border'
              : isMatched
              ? 'border-blue-400 bg-blue-50'
              : selectedTerm
              ? 'border-dashed border-primary/50 hover:border-primary hover:bg-primary/5'
              : 'border-border';
            return (
              <button
                key={pair.id}
                onClick={() => handleDefClick(pair.id)}
                disabled={submitted}
                className={`px-3 py-2 rounded-lg border-2 text-sm text-left transition-colors ${borderColor}`}
              >
                {pair.definition}
              </button>
            );
          })}
        </div>
      </div>

      {!submitted && (
        <Button onClick={handleCheck} disabled={!allMatched} className="self-start">
          Check
        </Button>
      )}

      {submitted && (
        <p
          className={`text-sm font-medium ${
            Object.values(correct).every(Boolean) ? 'text-green-700' : 'text-red-700'
          }`}
        >
          {Object.values(correct).filter(Boolean).length} of {block.pairs.length} correct.
        </p>
      )}
    </div>
  );
};
