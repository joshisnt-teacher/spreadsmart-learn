import React from 'react';
import { Check, Trophy, BarChart3, MessageCircle, TableIcon, ChevronLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Lesson, LessonProgress } from '@/types/lesson';

interface LessonSidebarProps {
  lesson: Lesson;
  currentStepIndex: number;
  progress: LessonProgress;
  progressPercent: number;
  onStepClick: (idx: number) => void;
  onBack?: () => void;
}

const LessonSidebar: React.FC<LessonSidebarProps> = ({
  lesson, currentStepIndex, progress, progressPercent, onStepClick, onBack,
}) => {
  return (
    <>
      <div className="p-4 border-b">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 -ml-2 text-muted-foreground">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        )}
        <h2 className="font-semibold text-lg leading-tight">{lesson.title}</h2>
        <p className="text-xs text-muted-foreground mt-1">{lesson.description}</p>
        <div className="mt-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {lesson.steps.map((step, idx) => {
            const isComplete = progress.completedStepIds.includes(step.id);
            const isCurrent = idx === currentStepIndex;
            const isLocked = idx > currentStepIndex && !progress.completedStepIds.includes(lesson.steps[idx - 1]?.id);

            return (
              <button
                key={step.id}
                onClick={() => onStepClick(idx)}
                disabled={isLocked}
                className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 text-sm transition-colors flex items-center gap-2 ${
                  isCurrent ? 'bg-primary/10 text-primary font-medium'
                    : isComplete ? 'text-muted-foreground hover:bg-muted/50'
                    : isLocked ? 'text-muted-foreground/40 cursor-not-allowed'
                    : 'text-foreground hover:bg-muted/50'
                }`}
              >
                <span className={`flex items-center justify-center w-5 h-5 rounded-full text-xs shrink-0 ${
                  isComplete ? 'bg-accent text-accent-foreground'
                    : isCurrent
                    ? step.type === 'challenge' ? 'bg-warning text-warning-foreground' : 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {isComplete ? <Check className="w-3 h-3" /> : step.type === 'challenge' ? <Trophy className="w-3 h-3" /> : step.type === 'chart' ? <BarChart3 className="w-3 h-3" /> : step.type === 'quiz' ? <MessageCircle className="w-3 h-3" /> : step.type === 'table-task' ? <TableIcon className="w-3 h-3" /> : idx + 1}
                </span>
                <span className="truncate">{step.title}</span>
              </button>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-muted/30">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-warning" />
          <span className="text-sm font-medium">{progress.totalXp} XP</span>
        </div>
      </div>
    </>
  );
};

export default LessonSidebar;
