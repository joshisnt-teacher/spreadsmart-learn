import React, { useState, useMemo } from 'react';
import { GripVertical, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SequenceBlock } from '@/types/module-v2';
import type { BlockContext } from './BlockRegistry';

interface Props {
  block: SequenceBlock;
  context: BlockContext;
}

export const SequenceRenderer: React.FC<Props> = ({ block, context }) => {
  const shuffled = useMemo(() => [...block.items].sort(() => Math.random() - 0.5), [block.items]);
  const [order, setOrder] = useState(shuffled.map(i => i.id));
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});

  const itemMap = Object.fromEntries(block.items.map(i => [i.id, i]));

  const handleClick = (id: string) => {
    if (submitted) return;
    if (!selected) { setSelected(id); return; }
    if (selected === id) { setSelected(null); return; }
    setOrder(prev => {
      const next = [...prev];
      const a = next.indexOf(selected), b = next.indexOf(id);
      [next[a], next[b]] = [next[b], next[a]];
      return next;
    });
    setSelected(null);
  };

  const handleCheck = () => {
    const res: Record<string, boolean> = {};
    order.forEach((id, idx) => { res[id] = itemMap[id].correctIndex === idx; });
    setResults(res);
    setSubmitted(true);
    context.onResponse?.({
      blockId: block.blockId,
      blockType: 'sequence',
      correct: Object.values(res).every(Boolean),
      answer: order,
    });
  };

  return (
    <div className="flex flex-col gap-4 p-6 max-w-xl mx-auto w-full">
      <p className="text-sm font-medium">{block.instruction}</p>
      {!submitted && (
        <p className="text-xs text-muted-foreground">
          Click an item to select it, then click another to swap.
        </p>
      )}
      <div className="flex flex-col gap-2">
        {order.map((id, idx) => {
          const item = itemMap[id];
          const isSelected = selected === id;
          const bg = submitted
            ? results[id] ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
            : isSelected
            ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
            : 'border-border bg-card hover:border-primary/40';
          return (
            <button
              key={id}
              onClick={() => handleClick(id)}
              disabled={submitted}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border-2 text-sm font-medium text-left transition-all ${bg}`}
            >
              <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-bold shrink-0">
                {idx + 1}
              </span>
              <span className="flex-1">{item.label}</span>
              {submitted && (
                results[id]
                  ? <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  : <XCircle className="w-4 h-4 text-red-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
      {!submitted && (
        <Button onClick={handleCheck} className="self-start">Check</Button>
      )}
    </div>
  );
};
