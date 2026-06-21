import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import type { CrosswordBlock } from '@/types/module-v2';
import type { BlockContext } from './BlockRegistry';

interface Props {
  block: CrosswordBlock;
  context: BlockContext;
}

function buildGrid(clues: CrosswordBlock['clues']): (string | null)[][] {
  if (!clues.length) return [];
  let maxRow = 0, maxCol = 0;
  for (const c of clues) {
    if (c.direction === 'across') {
      maxRow = Math.max(maxRow, c.row);
      maxCol = Math.max(maxCol, c.col + c.word.length - 1);
    } else {
      maxRow = Math.max(maxRow, c.row + c.word.length - 1);
      maxCol = Math.max(maxCol, c.col);
    }
  }
  const grid: (string | null)[][] = Array.from({ length: maxRow + 1 }, () =>
    Array(maxCol + 1).fill(null)
  );
  for (const c of clues) {
    for (let i = 0; i < c.word.length; i++) {
      const r = c.direction === 'across' ? c.row : c.row + i;
      const col = c.direction === 'across' ? c.col + i : c.col;
      grid[r][col] = c.word[i];
    }
  }
  return grid;
}

export const CrosswordRenderer: React.FC<Props> = ({ block, context }) => {
  const solution = buildGrid(block.clues);
  const rows = solution.length;
  const cols = rows > 0 ? solution[0].length : 0;
  const [inputs, setInputs] = useState<string[][]>(() =>
    Array.from({ length: rows }, () => Array(cols).fill(''))
  );
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState<boolean[][] | null>(null);

  const handleChange = useCallback((r: number, c: number, val: string) => {
    if (submitted) return;
    setInputs(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = val.toUpperCase().slice(-1);
      return next;
    });
  }, [submitted]);

  const handleCheck = () => {
    const res = solution.map((row, r) =>
      row.map((cell, c) => cell === null || inputs[r][c].toUpperCase() === cell)
    );
    setCorrect(res);
    setSubmitted(true);
    const allCorrect = res.every(row => row.every(Boolean));
    context.onResponse?.({
      blockId: block.blockId,
      blockType: 'crossword',
      correct: allCorrect,
      answer: inputs,
    });
  };

  const allFilled = solution.every((row, r) =>
    row.every((cell, c) => cell === null || inputs[r][c] !== '')
  );

  const across = block.clues.filter(c => c.direction === 'across');
  const down = block.clues.filter(c => c.direction === 'down');

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 max-w-3xl mx-auto w-full">
      <div className="flex-shrink-0">
        <div
          className="inline-grid gap-0.5 bg-foreground/20 p-0.5 rounded"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {solution.map((row, r) =>
            row.map((cell, c) =>
              cell === null ? (
                <div key={`${r}-${c}`} className="w-8 h-8 bg-foreground rounded-sm" />
              ) : (
                <input
                  key={`${r}-${c}`}
                  maxLength={1}
                  value={inputs[r][c]}
                  onChange={e => handleChange(r, c, e.target.value)}
                  disabled={submitted}
                  className={`w-8 h-8 text-center text-sm font-bold uppercase border-0 outline-none focus:bg-primary/10 transition-colors
                    ${submitted && correct
                      ? correct[r][c] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'
                      : 'bg-white'
                    }`}
                />
              )
            )
          )}
        </div>

        {!submitted && (
          <Button onClick={handleCheck} disabled={!allFilled} className="mt-3 w-full">
            Check Crossword
          </Button>
        )}
        {submitted && (
          <p className={`mt-2 text-sm font-medium ${correct?.every(r => r.every(Boolean)) ? 'text-green-700' : 'text-amber-700'}`}>
            {correct?.every(r => r.every(Boolean)) ? 'Solved!' : 'Some letters are wrong. Check the red cells.'}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 text-sm">
        {across.length > 0 && (
          <div>
            <p className="font-semibold mb-1 text-xs uppercase tracking-wide text-muted-foreground">Across</p>
            {across.map((c, i) => (
              <p key={i} className="text-muted-foreground leading-snug py-0.5">
                <span className="font-medium text-foreground">{i + 1}.</span> {c.clue}
              </p>
            ))}
          </div>
        )}
        {down.length > 0 && (
          <div>
            <p className="font-semibold mb-1 text-xs uppercase tracking-wide text-muted-foreground">Down</p>
            {down.map((c, i) => (
              <p key={i} className="text-muted-foreground leading-snug py-0.5">
                <span className="font-medium text-foreground">{i + 1}.</span> {c.clue}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
