import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ImageHotspotBlock } from '@/types/module-v2';
import type { BlockContext } from './BlockRegistry';

interface Props {
  block: ImageHotspotBlock;
  context: BlockContext;
}

export const ImageHotspotRenderer: React.FC<Props> = ({ block, context }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [done, setDone] = useState(false);

  const questionHotspots = block.hotspots.filter(h => h.accepted?.length);
  React.useEffect(() => {
    if (questionHotspots.length === 0 && !done) {
      setDone(true);
      context.onResponse?.({ blockId: block.blockId, blockType: 'image-hotspot', correct: true, answer: {} });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeHotspot = block.hotspots.find(h => h.id === activeId);

  const handleHotspotClick = (id: string) => {
    setActiveId(prev => (prev === id ? null : id));
  };

  const handleSubmitAnswer = (hotspotId: string) => {
    const hotspot = block.hotspots.find(h => h.id === hotspotId);
    if (!hotspot?.accepted) return;
    const answer = (answers[hotspotId] ?? '').trim().toLowerCase();
    const correct = hotspot.accepted.some(a => a.toLowerCase() === answer);
    const next = { ...submitted, [hotspotId]: correct };
    setSubmitted(next);

    if (Object.keys(next).length === questionHotspots.length && !done) {
      setDone(true);
      context.onResponse?.({
        blockId: block.blockId,
        blockType: 'image-hotspot',
        correct: Object.values(next).every(Boolean),
        answer: answers,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto w-full">
      <div className="relative w-full rounded-xl overflow-hidden border bg-muted">
        <img src={block.imageUrl} alt={block.imageAlt} className="w-full h-auto" draggable={false} />

        {block.hotspots.map(hotspot => (
          <button
            key={hotspot.id}
            onClick={() => handleHotspotClick(hotspot.id)}
            className={`absolute w-7 h-7 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold transition-transform hover:scale-110
              ${submitted[hotspot.id] !== undefined
                ? submitted[hotspot.id] ? 'bg-green-500' : 'bg-red-500'
                : 'bg-primary animate-pulse'
              }`}
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            aria-label={hotspot.label}
          >
            ?
          </button>
        ))}
      </div>

      {activeHotspot && (
        <div className="border rounded-xl p-4 bg-card flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-sm">{activeHotspot.label}</p>
            <button onClick={() => setActiveId(null)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          {activeHotspot.revealText && !activeHotspot.question && (
            <p className="text-sm text-muted-foreground">{activeHotspot.revealText}</p>
          )}

          {activeHotspot.question && (
            <>
              <p className="text-sm">{activeHotspot.question}</p>
              <div className="flex gap-2">
                <Input
                  value={answers[activeHotspot.id] ?? ''}
                  onChange={e => setAnswers(prev => ({ ...prev, [activeHotspot.id]: e.target.value }))}
                  disabled={activeHotspot.id in submitted}
                  placeholder="Type your answer..."
                  className="flex-1"
                  onKeyDown={e => { if (e.key === 'Enter') handleSubmitAnswer(activeHotspot.id); }}
                />
                <Button
                  size="sm"
                  onClick={() => handleSubmitAnswer(activeHotspot.id)}
                  disabled={activeHotspot.id in submitted || !answers[activeHotspot.id]?.trim()}
                >
                  Check
                </Button>
              </div>
              {activeHotspot.id in submitted && (
                <p className={`text-xs font-medium ${submitted[activeHotspot.id] ? 'text-green-600' : 'text-red-600'}`}>
                  {submitted[activeHotspot.id] ? 'Correct!' : `Not quite. Answer: ${activeHotspot.accepted?.[0]}`}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
