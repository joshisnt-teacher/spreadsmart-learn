import { useState, useCallback, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { checkTask, checkChartTask, checkQuizAnswer, checkTableTaskAnswer, getHint } from '@/lib/marking-engine';
import { useLessonProgress } from '@/hooks/useProgress';
import { useStepAnalytics } from '@/hooks/useStepAnalytics';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import type { Lesson, CheckResult, LessonProgress, ChartType } from '@/types/lesson';

export function useLessonPlayer(lesson: Lesson, moduleId: string, onComplete?: (xpEarned: number) => void) {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lessonAlreadyCompleted, setLessonAlreadyCompleted] = useState(false);
  const { logEvent } = useStepAnalytics(moduleId, lesson.id, user?.id, lessonAlreadyCompleted);
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
  const [tableAnswer, setTableAnswer] = useState('');
  const { saveProgress, loadProgress } = useLessonProgress(lesson.id);

  // "I'm stuck" feature state
  const [stepElapsed, setStepElapsed] = useState(0);
  const [stuckTriggered, setStuckTriggered] = useState(false);

  const fireConfetti = useCallback(() => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.7 }, colors: ['#FFD700', '#FF6B6B', '#4CAF50', '#2196F3', '#9C27B0'] });
    setTimeout(() => {
      confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 } });
    }, 250);
  }, []);

  // Load saved progress
  useEffect(() => {
    loadProgress().then((saved) => {
      if (saved) {
        const attempts = (saved.attempts && typeof saved.attempts === 'object' && !Array.isArray(saved.attempts))
          ? saved.attempts as Record<string, number> : {};
        setProgress({ lessonId: lesson.id, completedStepIds: saved.completed_step_ids, currentStepId: saved.current_step_id || lesson.steps[0]?.id || '', totalXp: saved.total_xp, attempts });
        if (!saved.completed) {
          const firstIncompleteIdx = lesson.steps.findIndex(s => !saved.completed_step_ids.includes(s.id));
          if (firstIncompleteIdx >= 0) setCurrentStepIndex(firstIncompleteIdx);
          else {
            const idx = lesson.steps.findIndex(s => s.id === saved.current_step_id);
            if (idx >= 0) setCurrentStepIndex(idx);
          }
        } else {
          setIsRedoing(true);
          setLessonAlreadyCompleted(true);
        }
      }
    });
  }, [lesson.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save
  useEffect(() => {
    if (progress.completedStepIds.length > 0 || Object.keys(progress.attempts).length > 0) {
      saveProgress(progress.completedStepIds, progress.currentStepId, progress.totalXp, progress.attempts, lesson.steps.every(s => progress.completedStepIds.includes(s.id)));
    }
  }, [progress.completedStepIds, progress.totalXp, progress.attempts]); // eslint-disable-line react-hooks/exhaustive-deps

  // Log step_start
  useEffect(() => {
    const step = lesson.steps[currentStepIndex];
    if (step) logEvent(step.id, 'step_start', isRedoing ? { revisit: true } : {});
  }, [currentStepIndex, lesson.steps, logEvent]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close sidebar on mobile nav
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [currentStepIndex, isMobile]);

  // Step elapsed timer — reset on step change, tick every second
  useEffect(() => {
    setStepElapsed(0);
    setStuckTriggered(false);
    const interval = setInterval(() => setStepElapsed(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [currentStepIndex]);

  const currentStep = lesson.steps[currentStepIndex];
  const isChallengeStep = currentStep?.type === 'challenge';
  const isChartStep = currentStep?.type === 'chart';
  const isQuizStep = currentStep?.type === 'quiz';
  const isTableTaskStep = currentStep?.type === 'table-task';
  const isInstructionStep = currentStep?.type === 'instruction' || (!currentStep?.task && !isChallengeStep && !isChartStep && !isQuizStep && !isTableTaskStep);
  const isStepComplete = progress.completedStepIds.includes(currentStep?.id || '');
  const isLastStep = currentStepIndex === lesson.steps.length - 1;
  const isLessonComplete = lesson.steps.every(s => progress.completedStepIds.includes(s.id));
  const attemptCount = progress.attempts[currentStep?.id || ''] || 0;
  const progressPercent = (progress.completedStepIds.length / lesson.steps.length) * 100;

  // Show "I'm stuck" after 60s on a non-instruction task step that isn't complete
  const showStuckButton = !isInstructionStep && !isStepComplete && !stuckTriggered && stepElapsed >= 60;

  const handleDataChange = useCallback((celldata: any[]) => setCurrentCellData(celldata), []);

  const handleCheck = useCallback(() => {
    if (!currentStep) return;
    const newAttempts = { ...progress.attempts, [currentStep.id]: attemptCount + 1 };
    let result: CheckResult;

    if (isChartStep && currentStep.chartTask) {
      result = checkChartTask(currentStep.chartTask, chartSelection.type, chartSelection.xKey, chartSelection.yKey, currentStep.task!);
    } else if (isQuizStep && currentStep.quiz) {
      result = checkQuizAnswer(currentStep.quiz, quizAnswer, currentStep.task!);
    } else if (isTableTaskStep && currentStep.tableTask) {
      result = checkTableTaskAnswer(currentStep.tableTask, tableAnswer, currentStep.task!);
    } else {
      result = checkTask(currentCellData, currentStep.task!, attemptCount + 1);
    }

    setFeedback(result);

    if (result.type === 'correct') {
      const isFirstAttempt = attemptCount === 0;
      const alreadyDone = progress.completedStepIds.includes(currentStep.id);
      const xp = (isRedoing || alreadyDone) ? 0 : (currentStep.task?.xpValue ?? 0) + (isFirstAttempt ? (currentStep.task?.bonusXp || 0) : 0);
      logEvent(currentStep.id, 'step_complete', { attempt_count: attemptCount + 1, xp_earned: xp });
      if (isChallengeStep) fireConfetti();
      setProgress(prev => ({ ...prev, completedStepIds: [...new Set([...prev.completedStepIds, currentStep.id])], totalXp: prev.totalXp + xp, attempts: newAttempts }));
      setIsRedoing(false);
      // Auto-compress if this was the last step
      if (isLastStep && user?.id && moduleId) {
        supabase.rpc('compress_lesson_events', {
          _user_id: user.id,
          _module_id: moduleId,
          _lesson_id: lesson.id,
        }).then(({ error }) => {
          if (error) console.warn('Auto-compression failed:', error.message);
        });
      }
    } else {
      logEvent(currentStep.id, 'check_fail', { attempt: attemptCount + 1, feedback_type: result.type });
      setProgress(prev => ({ ...prev, attempts: newAttempts }));
      if (currentStep.task) {
        const hint = getHint(currentStep.task, attemptCount + 1);
        if (hint) { setCurrentHint(hint); setShowHint(true); }
      }
    }
  }, [currentStep, currentCellData, chartSelection, quizAnswer, tableAnswer, attemptCount, progress, isChartStep, isQuizStep, isTableTaskStep, isChallengeStep, isRedoing, fireConfetti, logEvent]);

  const handleInstructionContinue = useCallback(() => {
    if (!currentStep) return;
    const alreadyDone = progress.completedStepIds.includes(currentStep.id);
    const xp = (isRedoing || alreadyDone) ? 0 : (currentStep.task?.xpValue ?? 5);
    logEvent(currentStep.id, 'step_complete', { attempt_count: 1, xp_earned: xp });
    setProgress(prev => ({ ...prev, completedStepIds: [...new Set([...prev.completedStepIds, currentStep.id])], totalXp: prev.totalXp + xp }));
    setTimeout(() => {
      if (isLastStep) {
        onComplete?.(progress.totalXp + xp);
        // Auto-compress lesson events in the background
        if (user?.id && moduleId) {
          supabase.rpc('compress_lesson_events', {
            _user_id: user.id,
            _module_id: moduleId,
            _lesson_id: lesson.id,
          }).then(({ error }) => {
            if (error) console.warn('Auto-compression failed:', error.message);
          });
        }
        return;
      }
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      setFeedback(null); setShowHint(false); setCurrentHint(null); setResetKey(k => k + 1);
      setProgress(prev => ({ ...prev, currentStepId: lesson.steps[nextIdx]?.id || '' }));
    }, 0);
  }, [currentStep, currentStepIndex, isLastStep, lesson, moduleId, onComplete, progress.totalXp, progress.completedStepIds, isRedoing, logEvent, user?.id]);

  const handleNext = useCallback(() => {
    if (isLastStep) { onComplete?.(progress.totalXp); return; }
    const nextIdx = currentStepIndex + 1;
    setCurrentStepIndex(nextIdx);
    setFeedback(null); setShowHint(false); setCurrentHint(null); setResetKey(k => k + 1);
    setChartSelection({ type: null, xKey: null, yKey: null }); setQuizAnswer(''); setTableAnswer('');
    setProgress(prev => ({ ...prev, currentStepId: lesson.steps[nextIdx]?.id || '' }));
  }, [currentStepIndex, isLastStep, lesson.steps, onComplete, progress.totalXp]);

  const handleReset = useCallback(() => {
    setResetKey(k => k + 1); setFeedback(null); setShowHint(false); setQuizAnswer(''); setTableAnswer('');
  }, []);

  const handleHint = useCallback(() => {
    if (!currentStep?.task) return;
    const hint = getHint(currentStep.task, Math.max(attemptCount, 2));
    if (hint) { setCurrentHint(hint); setShowHint(true); logEvent(currentStep.id, 'hint_used', { hint_index: Math.min(attemptCount, currentStep.task.hints.length - 1) }); }
    else if (currentStep.task.hints.length > 0) { setCurrentHint(currentStep.task.hints[0]); setShowHint(true); logEvent(currentStep.id, 'hint_used', { hint_index: 0 }); }
  }, [currentStep, attemptCount, logEvent]);

  const handleStuck = useCallback(() => {
    if (!currentStep) return;
    logEvent(currentStep.id, 'stuck', { time_on_step_seconds: stepElapsed, attempt_count: attemptCount });
    setStuckTriggered(true);
    // Auto-show a hint
    if (currentStep.task) {
      const hint = getHint(currentStep.task, Math.max(attemptCount, 2));
      if (hint) { setCurrentHint(hint); setShowHint(true); }
      else if (currentStep.task.hints.length > 0) { setCurrentHint(currentStep.task.hints[0]); setShowHint(true); }
    }
  }, [currentStep, stepElapsed, attemptCount, logEvent]);

  const handleStepClick = useCallback((idx: number) => {
    const step = lesson.steps[idx];
    const isComplete = progress.completedStepIds.includes(step.id);
    const isLocked = idx > currentStepIndex && !progress.completedStepIds.includes(lesson.steps[idx - 1]?.id);
    if (isLocked) return;
    const goingBack = isComplete && idx !== currentStepIndex;
    setCurrentStepIndex(idx);
    setFeedback(null); setShowHint(false); setResetKey(k => k + 1); setIsRedoing(goingBack);
  }, [currentStepIndex, lesson.steps, progress.completedStepIds]);

  return {
    // State
    currentStepIndex, currentStep, progress, feedback, showHint, currentHint,
    resetKey, currentCellData, isRedoing, chartSelection, quizAnswer, tableAnswer,
    sidebarOpen, isMobile, progressPercent,
    // Stuck feature
    showStuckButton, stuckTriggered,
    // Derived
    isChallengeStep, isChartStep, isQuizStep, isTableTaskStep, isInstructionStep,
    isStepComplete, isLastStep, isLessonComplete, attemptCount,
    // Actions
    handleDataChange, handleCheck, handleInstructionContinue, handleNext,
    handleReset, handleHint, handleStuck, handleStepClick,
    setSidebarOpen, setChartSelection, setQuizAnswer, setTableAnswer,
  };
}
