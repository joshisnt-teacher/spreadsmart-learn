import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, HelpCircle, RotateCcw, ChevronRight, Trophy, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CheckResult } from '@/types/lesson';

interface FeedbackBarProps {
  feedback: CheckResult | null;
  showHint: boolean;
  currentHint: string | null;
  isInstructionStep: boolean;
  isStepComplete: boolean;
  isLastStep: boolean;
  isRedoing: boolean;
  isMobile: boolean;
  onCheck: () => void;
  onInstructionContinue: () => void;
  onNext: () => void;
  onReset: () => void;
  onHint: () => void;
}

const FeedbackBar: React.FC<FeedbackBarProps> = ({
  feedback, showHint, currentHint,
  isInstructionStep, isStepComplete, isLastStep, isRedoing, isMobile,
  onCheck, onInstructionContinue, onNext, onReset, onHint,
}) => {
  return (
    <div className="p-3 md:p-4 border-t bg-card">
      <div className="flex items-center gap-2 md:gap-3 max-w-4xl flex-wrap">
        <AnimatePresence mode="wait">
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`flex-1 min-w-0 flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-sm ${
                feedback.type === 'correct' ? 'bg-accent/10 text-accent'
                  : feedback.type === 'almost' ? 'bg-warning/10 text-warning'
                  : 'bg-destructive/10 text-destructive'
              }`}
            >
              {feedback.type === 'correct' ? <Trophy className="w-4 h-4 shrink-0" /> : <HelpCircle className="w-4 h-4 shrink-0" />}
              <span className="truncate">{feedback.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {showHint && currentHint && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-0 flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-sm bg-primary/5 text-primary border border-primary/20"
          >
            <Lightbulb className="w-4 h-4 shrink-0" />
            <span className="truncate">{currentHint}</span>
          </motion.div>
        )}

        <div className="flex items-center gap-2 ml-auto shrink-0">
          {isInstructionStep ? (
            !isStepComplete ? (
              <Button size="sm" onClick={onInstructionContinue} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Got it <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button size="sm" onClick={onNext} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {isLastStep ? <><Trophy className="w-4 h-4 mr-1" /> Complete</> : <>Continue <ChevronRight className="w-4 h-4 ml-1" /></>}
              </Button>
            )
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={onHint}>
                <HelpCircle className="w-4 h-4 mr-1" /> {!isMobile && 'Hint'}
              </Button>
              <Button variant="outline" size="sm" onClick={onReset}>
                <RotateCcw className="w-4 h-4 mr-1" /> {!isMobile && 'Reset'}
              </Button>
              {(!isStepComplete || isRedoing) ? (
                <Button size="sm" onClick={onCheck}>
                  <Check className="w-4 h-4 mr-1" /> {isRedoing ? 'Re-check' : 'Check'}
                </Button>
              ) : (
                <Button size="sm" onClick={onNext} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  {isLastStep ? <><Trophy className="w-4 h-4 mr-1" /> Complete</> : <>Continue <ChevronRight className="w-4 h-4 ml-1" /></>}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackBar;
