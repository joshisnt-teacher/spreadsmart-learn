import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Check, HelpCircle, RotateCcw, ChevronRight, ChevronLeft, Trophy, Star, Lightbulb, BookOpen, Award, BarChart3, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import SpreadsheetWorkspace from '@/components/SpreadsheetWorkspace';
import ChartWorkspace from '@/components/ChartWorkspace';
import ChartBuilder from '@/components/ChartBuilder';
import QuizStep from '@/components/QuizStep';
import { checkTask, checkChartTask, checkQuizAnswer, getHint } from '@/lib/marking-engine';
import { useLessonProgress } from '@/hooks/useProgress';
import type { Lesson, Step, CheckResult, LessonProgress, ChartType } from '@/types/lesson';

interface LessonPlayerProps {
  lesson: Lesson;
  onComplete?: (xpEarned: number) => void;
  onBack?: () => void;
}

const LessonPlayer: React.FC<LessonPlayerProps> = ({ lesson, onComplete, onBack }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState<LessonProgress>({
    lessonId: lesson.id,
    completedStepIds: [],
    currentStepId: lesson.steps[0]?.id || '',
    totalXp: 0,
    attempts: {},
  });
  const [feedback, setFeedback] = useState<CheckResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [currentCellData, setCurrentCellData] = useState<any[]>([]);
  const [isRedoing, setIsRedoing] = useState(false);
  const [chartSelection, setChartSelection] = useState<{ type: ChartType | null; xKey: string | null; yKey: string | null }>({ type: null, xKey: null, yKey: null });
  const [quizAnswer, setQuizAnswer] = useState('');
  const { saveProgress, loadProgress } = useLessonProgress(lesson.id);

  const fireConfetti = useCallback(() => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.7 },
      colors: ['#FFD700', '#FF6B6B', '#4CAF50', '#2196F3', '#9C27B0'],
    });
    // Second burst for extra celebration
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 250);
  }, []);

  // Load saved progress on mount
  useEffect(() => {
    loadProgress().then((saved) => {
      if (saved) {
        const attempts = (saved.attempts && typeof saved.attempts === 'object' && !Array.isArray(saved.attempts))
          ? saved.attempts as Record<string, number>
          : {};
        setProgress({
          lessonId: lesson.id,
          completedStepIds: saved.completed_step_ids,
          currentStepId: saved.current_step_id || lesson.steps[0]?.id || '',
          totalXp: saved.total_xp,
          attempts,
        });
        // Jump to saved step only for in-progress lessons; completed lessons start at step 1
        if (!saved.completed) {
          const idx = lesson.steps.findIndex(s => s.id === saved.current_step_id);
          if (idx >= 0) setCurrentStepIndex(idx);
        }
      }
    });
  }, [lesson.id]);

  // Auto-save progress on changes
  useEffect(() => {
    if (progress.completedStepIds.length > 0 || Object.keys(progress.attempts).length > 0) {
      saveProgress(
        progress.completedStepIds,
        progress.currentStepId,
        progress.totalXp,
        progress.attempts,
        progress.completedStepIds.length === lesson.steps.length,
      );
    }
  }, [progress.completedStepIds, progress.totalXp, progress.attempts]);

  const currentStep = lesson.steps[currentStepIndex];
  const isChallengeStep = currentStep?.type === 'challenge';
  const isChartStep = currentStep?.type === 'chart';
  const isQuizStep = currentStep?.type === 'quiz';
  const isInstructionStep = currentStep?.type === 'instruction' || (!currentStep?.task && !isChallengeStep && !isChartStep && !isQuizStep);
  const isStepComplete = progress.completedStepIds.includes(currentStep?.id || '');
  const isLastStep = currentStepIndex === lesson.steps.length - 1;
  const isLessonComplete = progress.completedStepIds.length === lesson.steps.length;
  const attemptCount = progress.attempts[currentStep?.id || ''] || 0;
  const progressPercent = (progress.completedStepIds.length / lesson.steps.length) * 100;

  const handleDataChange = useCallback((celldata: any[]) => {
    setCurrentCellData(celldata);
  }, []);

  const handleCheck = useCallback(() => {
    if (!currentStep) return;

    const newAttempts = {
      ...progress.attempts,
      [currentStep.id]: attemptCount + 1,
    };

    let result: CheckResult;

    // Chart builder task — check chart selections
    if (isChartStep && currentStep.chartTask) {
      result = checkChartTask(
        currentStep.chartTask,
        chartSelection.type,
        chartSelection.xKey,
        chartSelection.yKey,
        currentStep.task!,
      );
    } else if (isQuizStep && currentStep.quiz) {
      result = checkQuizAnswer(currentStep.quiz, quizAnswer, currentStep.task!);
    } else {
      result = checkTask(currentCellData, currentStep.task!, attemptCount + 1);
    }

    setFeedback(result);

    if (result.type === 'correct') {
      const isFirstAttempt = attemptCount === 0;
      const xp = isRedoing ? 0 : (currentStep.task?.xpValue ?? 0) + (isFirstAttempt ? (currentStep.task?.bonusXp || 0) : 0);

      // Fire confetti for challenge steps
      if (isChallengeStep) {
        fireConfetti();
      }

      setProgress((prev) => ({
        ...prev,
        completedStepIds: [...new Set([...prev.completedStepIds, currentStep.id])],
        totalXp: prev.totalXp + xp,
        attempts: newAttempts,
      }));
      setIsRedoing(false);
    } else {
      setProgress((prev) => ({
        ...prev,
        attempts: newAttempts,
      }));

      // Auto-show hint after 2+ failures
      if (currentStep.task) {
        const hint = getHint(currentStep.task, attemptCount + 1);
        if (hint) {
          setCurrentHint(hint);
          setShowHint(true);
        }
      }
    }
  }, [currentStep, currentCellData, chartSelection, attemptCount, progress, isChartStep, isChallengeStep, isRedoing, fireConfetti]);

  const handleInstructionContinue = useCallback(() => {
    if (!currentStep) return;
    const xp = currentStep.task?.xpValue ?? 5;
    setProgress((prev) => ({
      ...prev,
      completedStepIds: [...new Set([...prev.completedStepIds, currentStep.id])],
      totalXp: prev.totalXp + xp,
    }));
    // Auto-advance after marking complete
    setTimeout(() => {
      if (isLastStep) {
        onComplete?.(progress.totalXp + xp);
        return;
      }
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      setFeedback(null);
      setShowHint(false);
      setCurrentHint(null);
      setResetKey((k) => k + 1);
      setProgress((prev) => ({
        ...prev,
        currentStepId: lesson.steps[nextIdx]?.id || '',
      }));
    }, 0);
  }, [currentStep, currentStepIndex, isLastStep, lesson.steps, onComplete, progress.totalXp]);

  const handleNext = useCallback(() => {
    if (isLastStep) {
      onComplete?.(progress.totalXp);
      return;
    }
    const nextIdx = currentStepIndex + 1;
    setCurrentStepIndex(nextIdx);
    setFeedback(null);
    setShowHint(false);
    setCurrentHint(null);
    setResetKey((k) => k + 1);
    setChartSelection({ type: null, xKey: null, yKey: null });
    setQuizAnswer('');
    setProgress((prev) => ({
      ...prev,
      currentStepId: lesson.steps[nextIdx]?.id || '',
    }));
  }, [currentStepIndex, isLastStep, lesson.steps, onComplete, progress.totalXp]);

  const handleReset = useCallback(() => {
    setResetKey((k) => k + 1);
    setFeedback(null);
    setShowHint(false);
    setQuizAnswer('');
  }, []);

  const handleHint = useCallback(() => {
    if (!currentStep?.task) return;
    const hint = getHint(currentStep.task, Math.max(attemptCount, 2));
    if (hint) {
      setCurrentHint(hint);
      setShowHint(true);
    } else if (currentStep.task.hints.length > 0) {
      setCurrentHint(currentStep.task.hints[0]);
      setShowHint(true);
    }
  }, [currentStep, attemptCount]);

  if (!currentStep) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Left sidebar — Step list */}
      <aside className="w-64 border-r bg-card flex flex-col shrink-0">
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
                  onClick={() => {
                    if (!isLocked) {
                      const goingBack = isComplete && idx !== currentStepIndex;
                      setCurrentStepIndex(idx);
                      setFeedback(null);
                      setShowHint(false);
                      setResetKey((k) => k + 1);
                      setIsRedoing(goingBack);
                    }
                  }}
                  disabled={isLocked}
                  className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 text-sm transition-colors flex items-center gap-2 ${
                    isCurrent
                      ? 'bg-primary/10 text-primary font-medium'
                      : isComplete
                      ? 'text-muted-foreground hover:bg-muted/50'
                      : isLocked
                      ? 'text-muted-foreground/40 cursor-not-allowed'
                      : 'text-foreground hover:bg-muted/50'
                  }`}
                >
                  <span className={`flex items-center justify-center w-5 h-5 rounded-full text-xs shrink-0 ${
                    isComplete
                      ? 'bg-accent text-accent-foreground'
                      : isCurrent
                      ? step.type === 'challenge' ? 'bg-warning text-warning-foreground' : 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {isComplete ? <Check className="w-3 h-3" /> : step.type === 'challenge' ? <Trophy className="w-3 h-3" /> : step.type === 'chart' ? <BarChart3 className="w-3 h-3" /> : step.type === 'quiz' ? <MessageCircle className="w-3 h-3" /> : idx + 1}
                  </span>
                  <span className="truncate">{step.title}</span>
                </button>
              );
            })}
          </div>
        </ScrollArea>

        {/* XP counter */}
        <div className="p-4 border-t bg-muted/30">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium">{progress.totalXp} XP</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Instruction panel */}
        <div className={`p-6 border-b ${isChallengeStep ? 'bg-gradient-to-r from-warning/10 via-accent/10 to-primary/10' : 'bg-card'}`}>
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              {isChallengeStep ? <Award className="w-3.5 h-3.5 text-warning" /> : <BookOpen className="w-3.5 h-3.5" />}
              <span>Step {currentStepIndex + 1} of {lesson.steps.length}</span>
              {isChallengeStep && (
                <Badge className="bg-warning text-warning-foreground ml-1 text-[10px] px-1.5 py-0">
                  <Trophy className="w-3 h-3 mr-0.5" /> Challenge
                </Badge>
              )}
            </div>
            <h3 className="text-xl font-semibold mb-3">{currentStep.title}</h3>
            <div className="prose prose-sm max-w-none text-foreground/90">
              {(() => {
                const lines = currentStep.instruction.split('\n');
                const blocks: { type: 'text' | 'table'; lines: string[] }[] = [];
                for (const line of lines) {
                  if (line.trimStart().startsWith('|')) {
                    const last = blocks[blocks.length - 1];
                    if (last?.type === 'table') last.lines.push(line);
                    else blocks.push({ type: 'table', lines: [line] });
                  } else {
                    blocks.push({ type: 'text', lines: [line] });
                  }
                }

                const renderInline = (text: string) => {
                  // Split by **bold** and `code`
                  const tokens = text.split(/(\*\*.*?\*\*|`[^`]+`)/g);
                  return tokens.map((tok, i) => {
                    if (tok.startsWith('**') && tok.endsWith('**')) {
                      return <code key={i} className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono text-xs">{tok.slice(2, -2)}</code>;
                    }
                    if (tok.startsWith('`') && tok.endsWith('`')) {
                      return <code key={i} className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono text-xs">{tok.slice(1, -1)}</code>;
                    }
                    return <span key={i}>{tok}</span>;
                  });
                };

                return blocks.map((block, bi) => {
                  if (block.type === 'table') {
                    const rows = block.lines
                      .map(l => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim()))
                      .filter(cells => !cells.every(c => /^-+$/.test(c)));
                    const [header, ...body] = rows;
                    return (
                      <table key={bi} className="my-2 text-sm border-collapse w-auto">
                        <thead>
                          <tr>{header.map((h, hi) => <th key={hi} className="border border-border px-3 py-1.5 bg-muted font-semibold text-left">{renderInline(h)}</th>)}</tr>
                        </thead>
                        <tbody>
                          {body.map((row, ri) => (
                            <tr key={ri}>{row.map((cell, ci) => <td key={ci} className="border border-border px-3 py-1.5">{renderInline(cell)}</td>)}</tr>
                          ))}
                        </tbody>
                      </table>
                    );
                  }
                  const line = block.lines[0];
                  if (!line) return <p key={bi} className="mb-1.5" />;
                  return <p key={bi} className="mb-1.5 last:mb-0">{renderInline(line)}</p>;
                });
              })()}
            </div>

            {currentStep.whyItMatters && (
              <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                <Lightbulb className="w-3.5 h-3.5 mt-0.5 shrink-0 text-warning" />
                <span>{currentStep.whyItMatters}</span>
              </div>
            )}
          </div>
        </div>

        {/* Spreadsheet & Chart area */}
        {isChartStep ? (
          <div className="flex-1 flex min-h-0">
            {/* Spreadsheet side */}
            {currentStep.initialSheetState && (
              <div className="w-1/2 p-4 min-h-0">
                <div className="h-full border rounded-lg overflow-hidden bg-background shadow-sm">
                  <SpreadsheetWorkspace
                    initialState={currentStep.initialSheetState}
                    editableCells={currentStep.task?.editableCells ?? []}
                    onDataChange={handleDataChange}
                    resetKey={resetKey}
                  />
                </div>
              </div>
            )}
            {/* Chart side */}
            <div className={`${currentStep.initialSheetState ? 'w-1/2' : 'flex-1'} p-4 min-h-0`}>
              <div className="h-full border rounded-lg overflow-hidden bg-background shadow-sm">
                {currentStep.chartTask ? (
                  <ChartBuilder
                    config={currentStep.chartConfig!}
                    cellData={currentCellData.length > 0 ? currentCellData : currentStep.initialSheetState?.celldata ?? []}
                    onSelectionChange={(type, xKey, yKey) => setChartSelection({ type, xKey, yKey })}
                  />
                ) : currentStep.chartConfig ? (
                  <ChartWorkspace
                    config={currentStep.chartConfig}
                    cellData={currentCellData.length > 0 ? currentCellData : currentStep.initialSheetState?.celldata ?? []}
                  />
                ) : null}
              </div>
            </div>
          </div>
        ) : isQuizStep && currentStep.quiz ? (
          <QuizStep
            quiz={currentStep.quiz}
            feedback={feedback}
            onAnswerChange={setQuizAnswer}
            answer={quizAnswer}
          />
        ) : isInstructionStep && !isChallengeStep ? (
          currentStep.initialSheetState ? (
            <div className="flex-1 p-4 min-h-0">
              <div className="h-full border rounded-lg overflow-hidden bg-background shadow-sm opacity-80">
                <SpreadsheetWorkspace
                  initialState={currentStep.initialSheetState}
                  editableCells={[]}
                  onDataChange={() => {}}
                  resetKey={resetKey}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1" />
          )
        ) : (currentStep.initialSheetState && currentStep.task) || isChallengeStep ? (
          <div className="flex-1 p-4 min-h-0">
            <div className="h-full border rounded-lg overflow-hidden bg-background shadow-sm">
              <SpreadsheetWorkspace
                initialState={currentStep.initialSheetState!}
                editableCells={currentStep.task!.editableCells}
                onDataChange={handleDataChange}
                resetKey={resetKey}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {/* Feedback & Controls */}
        <div className="p-4 border-t bg-card">
          <div className="flex items-center gap-3 max-w-4xl">
            <AnimatePresence mode="wait">
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={`flex-1 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm ${
                    feedback.type === 'correct'
                      ? 'bg-accent/10 text-accent'
                      : feedback.type === 'almost'
                      ? 'bg-warning/10 text-warning'
                      : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {feedback.type === 'correct' ? (
                    <Trophy className="w-4 h-4 shrink-0" />
                  ) : (
                    <HelpCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{feedback.message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {showHint && currentHint && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm bg-primary/5 text-primary border border-primary/20"
              >
                <Lightbulb className="w-4 h-4 shrink-0" />
                <span>{currentHint}</span>
              </motion.div>
            )}

            <div className="flex items-center gap-2 ml-auto shrink-0">
              {isInstructionStep ? (
                !isStepComplete ? (
                  <Button size="sm" onClick={handleInstructionContinue} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    Got it <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleNext} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    {isLastStep ? (
                      <><Trophy className="w-4 h-4 mr-1" /> Complete</>
                    ) : (
                      <>Continue <ChevronRight className="w-4 h-4 ml-1" /></>
                    )}
                  </Button>
                )
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={handleHint}>
                    <HelpCircle className="w-4 h-4 mr-1" /> Hint
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <RotateCcw className="w-4 h-4 mr-1" /> Reset
                  </Button>
                  {(!isStepComplete || isRedoing) ? (
                    <Button size="sm" onClick={handleCheck}>
                      <Check className="w-4 h-4 mr-1" /> {isRedoing ? 'Re-check' : 'Check'}
                    </Button>
                  ) : (
                    <Button size="sm" onClick={handleNext} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      {isLastStep ? (
                        <><Trophy className="w-4 h-4 mr-1" /> Complete</>
                      ) : (
                        <>Continue <ChevronRight className="w-4 h-4 ml-1" /></>
                      )}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlayer;
