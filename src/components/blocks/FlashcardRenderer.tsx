import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { FlashcardBlock } from '@/types/module-v2';
import type { BlockContext } from './BlockRegistry';

interface Props {
  block: FlashcardBlock;
  context: BlockContext;
}

export const FlashcardRenderer: React.FC<Props> = ({ block, context }) => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [done, setDone] = useState(false);

  const card = block.cards[index];

  const markSeen = (id: string) => {
    const next = new Set(seen).add(id);
    setSeen(next);
    if (next.size === block.cards.length && !done) {
      setDone(true);
      context.onResponse?.({
        blockId: block.blockId,
        blockType: 'flashcard',
        correct: true,
        answer: { viewed: next.size, total: block.cards.length },
      });
    }
  };

  const goTo = (i: number) => {
    markSeen(card.id);
    setIndex(i);
    setFlipped(false);
  };

  const handleFlip = () => {
    setFlipped(f => !f);
    if (!flipped) markSeen(card.id);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 w-full max-w-lg mx-auto">
      {block.instruction && (
        <p className="text-sm text-muted-foreground text-center">{block.instruction}</p>
      )}

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{index + 1} / {block.cards.length}</span>
        <Badge variant="secondary">{seen.size} viewed</Badge>
      </div>

      <div
        className="relative w-full cursor-pointer select-none"
        style={{ perspective: 1000 }}
        onClick={handleFlip}
      >
        <motion.div
          className="relative w-full"
          style={{ transformStyle: 'preserve-3d', minHeight: 180 }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.35 }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-6 text-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <p className="text-lg font-semibold">{card.front}</p>
          </div>
          <div
            className="absolute inset-0 flex items-center justify-center rounded-2xl border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-accent/10 p-6 text-center"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <p className="text-base">{card.back}</p>
          </div>
        </motion.div>
      </div>

      <p className="text-xs text-muted-foreground">Click card to flip</p>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => goTo(Math.max(0, index - 1))}
          disabled={index === 0}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => { setIndex(0); setFlipped(false); }}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => goTo(Math.min(block.cards.length - 1, index + 1))}
          disabled={index === block.cards.length - 1}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {done && (
        <p className="text-sm text-green-700 font-medium">All cards reviewed!</p>
      )}
    </div>
  );
};
