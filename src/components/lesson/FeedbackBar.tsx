import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, HelpCircle, RotateCcw, ChevronRight, Trophy, Lightbulb, HandHelping } from 'lucide-react';
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
  showStuckButton?: boolean;
  stuckTriggered?: boolean;
  /** If true, this is an assessment step — hints are disabled and messaging changes */
  isAssessment?: boolean;
  onCheck: () => void;
  onInstructionContinue: () => void;
  onNext: () => void;
  onReset: () => void;
  onHint: () => void;
  onStuck?: () => void;
}

const FeedbackBar: React.FC<FeedbackBarProps> = ({
  feedback, showHint, currentHint,
  isInstructionStep, isStepComplete, isLastStep, isRedoing, isMobile,
  showStuckButton, stuckTriggered, isAssessment,
  onCheck, onInstructionContinue, onNext, onReset, onHint, onStuck,
}) => {
  return (
    <div className="p-3 md:p-4 border-t bg-card">
      <div className="flex items-center gap-2 md:gap-3 w-full flex-wrap">
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

        {showHint && currentHint && !isAssessment && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-0 flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-sm bg-primary/5 text-primary border border-primary/20"
          >
            <Lightbulb className="w-4 h-4 shrink-0" />
            <span className="truncate">{currentHint}</span>
          </motion.div>
        )}

        {isAssessment && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-0 flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-sm bg-warning/10 text-warning border border-warning/20"
          >
            <Trophy className="w-4 h-4 shrink-0" />
            <span className="truncate">This is an assessment, so hints are off.</span>
          </motion.div>
        )}

        {/* Stuck triggered message */}
        {stuckTriggered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-0 flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-sm bg-warning/10 text-warning border border-warning/20"
          >
            <HandHelping className="w-4 h-4 shrink-0" />
            <span className="truncate">No worries. Check the hint above and take your time.</span>
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
              {!isAssessment && (
                <Button variant="outline" size="sm" onClick={onHint}>
                  <HelpCircle className="w-4 h-4 mr-1" /> {!isMobile && 'Hint'}
                </Button>
              )}

              {showStuckButton && !isAssessment && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <Button variant="outline" size="sm" onClick={onStuck} className="border-warning/50 text-warning hover:bg-warning/10">
                    <HandHelping className="w-4 h-4 mr-1" /> {!isMobile && "I'm stuck"}
                  </Button>
                </motion.div>
              )}

              <Button variant="outline" size="sm" onClick={onReset}>
                <RotateCcw className="w-4 h-4 mr-1" /> {!isMobile && 'Reset'}
              </Button>
              {(!isStepComplete || isRedoing) ? (
                <Button size="sm" onClick={onCheck}>
                  <Check className="w-4 h-4 mr-1" /> {isRedoing ? 'Re-check' : isAssessment ? 'Submit Assessment' : 'Check'}
                </Button>
              ) : (
                <Button size="sm" onClick={onNext} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  {isLastStep ? <><Trophy className="w-4 h-4 mr-1" /> {isAssessment ? 'Finish Lesson' : 'Complete'}</> : <>Continue <ChevronRight className="w-4 h-4 ml-1" /></>}
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
