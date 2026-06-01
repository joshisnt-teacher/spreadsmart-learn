import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ModuleLanding from '@/components/ModuleLanding';
import LessonPlayer from '@/components/LessonPlayer';
import { getModuleById } from '@/data/module-registry';

import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import type { Module } from '@/types/lesson';
import { useProgress, useModuleAssessments } from '@/hooks/useProgress';
import { useStudentAssignments } from '@/hooks/useAssignments';
import { Button } from '@/components/ui/button';

const ModulePlayer: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentModule, setCurrentModule] = useState<Module | undefined>(undefined);
  const [moduleLoading, setModuleLoading] = useState(true);

  useEffect(() => {
    if (!moduleId) { setModuleLoading(false); return; }
    const builtIn = getModuleById(moduleId);
    if (builtIn) {
      setCurrentModule(builtIn);
      setModuleLoading(false);
    } else {
      setModuleLoading(false);
    }
  }, [moduleId]);

  const { completedLessonIds, totalXp, loading: progressLoading, markLessonComplete } = useProgress(currentModule?.id ?? '');
  const { assessments, loading: assessmentLoading } = useModuleAssessments(currentModule?.id ?? '');
  const { assignments, hasAssignments, isLessonAssigned, getDueDate, loading: assignLoading } = useStudentAssignments(currentModule?.id ?? '');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  // Compute nearest module-level due date
  const moduleDueDates = assignments
    .filter(a => a.due_date)
    .map(a => new Date(a.due_date!));
  const nearestDue = moduleDueDates.length > 0
    ? new Date(Math.min(...moduleDueDates.map(d => d.getTime())))
    : null;
  const daysUntilDue = nearestDue
    ? Math.ceil((nearestDue.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;
  const moduleDueLabel = daysUntilDue !== null
    ? daysUntilDue <= 0 ? 'Due today' : daysUntilDue === 1 ? 'Due tomorrow' : `Due in ${daysUntilDue} days`
    : null;

  // Jump to lesson from query param
  useEffect(() => {
    const lessonParam = searchParams.get('lesson');
    if (lessonParam && currentModule?.lessons.some(l => l.id === lessonParam)) {
      setActiveLessonId(lessonParam);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams, currentModule]);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [authLoading, user, navigate]);

  const activeLesson = activeLessonId
    ? currentModule?.lessons.find((l) => l.id === activeLessonId)
    : null;

  const handleStartLesson = useCallback((lessonId: string) => {
    setActiveLessonId(lessonId);
  }, []);

  const handleLessonComplete = useCallback(async (xpEarned: number) => {
    if (activeLessonId) {
      await markLessonComplete(activeLessonId, xpEarned);
      toast({
        title: '🎉 Lesson Complete!',
        description: `You earned ${xpEarned} XP. Great work!`,
      });
      setActiveLessonId(null);
    }
  }, [activeLessonId, markLessonComplete]);

  const handleBack = useCallback(() => {
    setActiveLessonId(null);
  }, []);

  if (authLoading || progressLoading || assignLoading || moduleLoading || assessmentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pb-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  if (!currentModule) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pb-12">
        <p className="text-muted-foreground">Module not found</p>
      </div>
    );
  }

  if (activeLesson) {
    return (
      <LessonPlayer
        lesson={activeLesson}
        moduleId={currentModule.id}
        onComplete={handleLessonComplete}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-4 left-4 z-10">
        <Button variant="ghost" size="sm" onClick={() => navigate('/student')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Button>
      </div>
      <ModuleLanding
        module={currentModule}
        completedLessonIds={completedLessonIds}
        totalXp={totalXp}
        onStartLesson={handleStartLesson}
        hasAssignments={hasAssignments}
        isLessonAssigned={isLessonAssigned}
        getDueDate={getDueDate}
        moduleDueLabel={moduleDueLabel}
        assessments={assessments}
      />
    </div>
  );
};

export default ModulePlayer;
