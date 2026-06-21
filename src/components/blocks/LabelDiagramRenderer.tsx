import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { LabelDiagramBlock } from '@/types/module-v2';
import type { BlockContext } from './BlockRegistry';

interface Props {
  block: LabelDiagramBlock;
  context: BlockContext;
}

export const LabelDiagramRenderer: React.FC<Props> = ({ block, context }) => {
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Record<string, string>>({}); // slotId → labelId
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});

  const placedLabelIds = new Set(Object.values(placements));

  const handleLabelClick = (labelId: string) => {
    if (submitted) return;
    setSelectedLabel(prev => (prev === labelId ? null : labelId));
  };

  const handleSlotClick = (slotId: string) => {
    if (submitted || !selectedLabel) return;
    setPlacements(prev => ({ ...prev, [slotId]: selectedLabel }));
    setSelectedLabel(null);
  };

  const handleCheck = () => {
    const res: Record<string, boolean> = {};
    for (const slot of block.slots) {
      res[slot.id] = placements[slot.id] === slot.correctLabelId;
    }
    setResults(res);
    setSubmitted(true);
    context.onResponse?.({
      blockId: block.blockId,
      blockType: 'label-diagram',
      correct: Object.values(res).every(Boolean),
      answer: placements,
    });
  };

  const allPlaced = block.slots.every(s => s.id in placements);
  const labelMap = Object.fromEntries(block.labels.map(l => [l.id, l.text]));

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto w-full">
      <p className="text-xs text-muted-foreground">
        {submitted ? 'Results shown below.' : selectedLabel ? `Placing "${labelMap[selectedLabel]}": click a slot on the diagram.` : 'Select a label, then click its position on the diagram.'}
      </p>

      <div className="relative w-full rounded-xl overflow-hidden border bg-muted">
        <img src={block.imageUrl} alt={block.imageAlt} className="w-full h-auto" draggable={false} />

        {block.slots.map(slot => {
          const placed = placements[slot.id];
          const isCorrect = submitted && results[slot.id];
          const isWrong = submitted && !results[slot.id];
          return (
            <button
              key={slot.id}
              onClick={() => handleSlotClick(slot.id)}
              disabled={submitted}
              className={`absolute px-2 py-1 rounded text-xs font-semibold border-2 min-w-16 text-center transition-all
                ${placed
                  ? isCorrect ? 'bg-green-100 border-green-500 text-green-800'
                    : isWrong ? 'bg-red-100 border-red-500 text-red-700'
                    : 'bg-white border-primary text-primary'
                  : selectedLabel
                    ? 'bg-primary/10 border-dashed border-primary text-primary hover:bg-primary/20'
                    : 'bg-white/80 border-dashed border-muted-foreground text-muted-foreground'
                }`}
              style={{ left: `${slot.x}%`, top: `${slot.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              {placed ? labelMap[placed] : '+ Label'}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {block.labels.filter(l => !placedLabelIds.has(l.id)).map(label => (
          <button
            key={label.id}
            onClick={() => handleLabelClick(label.id)}
            disabled={submitted}
            className={`px-3 py-1.5 rounded-lg border-2 text-sm font-medium transition-all
              ${selectedLabel === label.id
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card hover:border-primary/50'
              }`}
          >
            {label.text}
          </button>
        ))}
      </div>

      {!submitted && (
        <Button onClick={handleCheck} disabled={!allPlaced} className="self-start">
          Check Labels
        </Button>
      )}

      {submitted && (
        <div className={`flex items-center gap-2 text-sm font-medium ${Object.values(results).every(Boolean) ? 'text-green-700' : 'text-amber-700'}`}>
          {Object.values(results).every(Boolean)
            ? <><CheckCircle2 className="w-4 h-4" /> All labels correct!</>
            : <><XCircle className="w-4 h-4" /> {Object.values(results).filter(Boolean).length} of {block.slots.length} correct.</>
          }
        </div>
      )}
    </div>
  );
};
