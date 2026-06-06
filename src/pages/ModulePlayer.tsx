import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ModuleLanding from '@/components/ModuleLanding';
import LessonPlayer from '@/components/LessonPlayer';
import { V2LessonPlayer } from '@/components/V2LessonPlayer';
import { getModuleById } from '@/data/module-registry';
import { useCustomModule } from '@/hooks/useCustomModule';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import type { Module as LegacyModule } from '@/types/lesson';
import type { Module as V2Module, Lesson as V2Lesson } from '@/types/module-v2';
import { useProgress, useModuleAssessments } from '@/hooks/useProgress';
import { useStudentAssignments } from '@/hooks/useAssignments';
import { Button } from '@/components/ui/button';

const ModulePlayer: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Try DB-first, then fall back to hardcoded
  const { module: dbModule, loading: dbLoading } = useCustomModule(moduleId);
  const [legacyModule, setLegacyModule] = useState<LegacyModule | undefined>(undefined);
  const [moduleLoading, setModuleLoading] = useState(true);

  useEffect(() => {
    if (dbLoading) return;
    if (dbModule) { setModuleLoading(false); return; }
    // DB miss — try hardcoded registry
    const builtin = moduleId ? getModuleById(moduleId) : undefined;
    setLegacyModule(builtin);
    setModuleLoading(false);
  }, [dbLoading, dbModule, moduleId]);

  const isV2 = !!dbModule;
  const displayModule = isV2
    ? { id: dbModule!.id, title: dbModule!.title, description: dbModule!.description, estimatedMinutes: dbModule!.estimatedMinutes, bannerUrl: dbModule!.bannerUrl, lessons: dbModule!.lessons }
    : legacyModule;

  const { completedLessonIds, totalXp, loading: progressLoading, markLessonComplete } = useProgress(displayModule?.id ?? '');
  const { assessments, loading: assessmentLoading } = useModuleAssessments(displayModule?.id ?? '');
  const { assignments, hasAssignments, isLessonAssigned, getDueDate, loading: assignLoading } = useStudentAssignments(displayModule?.id ?? '');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  const moduleDueDates = assignments.filter(a => a.due_date).map(a => new Date(a.due_date!));
  const nearestDue = moduleDueDates.length > 0 ? new Date(Math.min(...moduleDueDates.map(d => d.getTime()))) : null;
  const daysUntilDue = nearestDue ? Math.ceil((nearestDue.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
  const moduleDueLabel = daysUntilDue !== null
    ? daysUntilDue <= 0 ? 'Due today' : daysUntilDue === 1 ? 'Due tomorrow' : `Due in ${daysUntilDue} days`
    : null;

  useEffect(() => {
    const lessonParam = searchParams.get('lesson');
    if (lessonParam && displayModule?.lessons.some(l => l.id === lessonParam)) {
      setActiveLessonId(lessonParam);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams, displayModule]);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [authLoading, user, navigate]);

  const handleStartLesson = useCallback((lessonId: string) => setActiveLessonId(lessonId), []);

  const handleLessonComplete = useCallback(async (xpEarned: number) => {
    if (activeLessonId) {
      await markLessonComplete(activeLessonId, xpEarned);
      toast({ title: '🎉 Lesson Complete!', description: `You earned ${xpEarned} XP. Great work!` });
      setActiveLessonId(null);
    }
  }, [activeLessonId, markLessonComplete]);

  const handleBack = useCallback(() => setActiveLessonId(null), []);

  if (authLoading || progressLoading || assignLoading || moduleLoading || assessmentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pb-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  if (!displayModule) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pb-12">
        <p className="text-muted-foreground">Module not found</p>
      </div>
    );
  }

  // V2 active lesson — use V2LessonPlayer
  if (activeLessonId && isV2) {
    const v2Lesson = (dbModule as V2Module).lessons.find(l => l.id === activeLessonId) as V2Lesson | undefined;
    if (v2Lesson) {
      return (
        <V2LessonPlayer
          lesson={v2Lesson}
          moduleId={displayModule.id}
          onComplete={handleLessonComplete}
          onBack={handleBack}
        />
      );
    }
  }

  // Legacy active lesson — use existing LessonPlayer
  if (activeLessonId && !isV2) {
    const legacyLesson = (legacyModule as LegacyModule).lessons.find(l => l.id === activeLessonId);
    if (legacyLesson) {
      return (
        <LessonPlayer
          lesson={legacyLesson}
          moduleId={displayModule.id}
          onComplete={handleLessonComplete}
          onBack={handleBack}
        />
      );
    }
  }

  return (
    <div className="relative">
      <div className="absolute top-4 left-4 z-10">
        <Button variant="ghost" size="sm" onClick={() => navigate('/student')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Button>
      </div>
      <ModuleLanding
        module={displayModule as unknown as LegacyModule}
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
