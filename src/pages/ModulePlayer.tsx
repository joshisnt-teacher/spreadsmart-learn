import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ModuleLanding from '@/components/ModuleLanding';
import LessonPlayer from '@/components/LessonPlayer';
import { excelBasicsModule } from '@/data/excel-basics-module';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import { useStudentAssignments } from '@/hooks/useAssignments';
import { Button } from '@/components/ui/button';

const ModulePlayer: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { completedLessonIds, totalXp, loading: progressLoading, markLessonComplete } = useProgress(excelBasicsModule.id);
  const { hasAssignments, isLessonAssigned, getDueDate, loading: assignLoading } = useStudentAssignments(excelBasicsModule.id);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  // Jump to lesson from query param
  useEffect(() => {
    const lessonParam = searchParams.get('lesson');
    if (lessonParam && excelBasicsModule.lessons.some(l => l.id === lessonParam)) {
      setActiveLessonId(lessonParam);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [authLoading, user, navigate]);

  const activeLesson = activeLessonId
    ? excelBasicsModule.lessons.find((l) => l.id === activeLessonId)
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

  if (authLoading || progressLoading || assignLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  if (activeLesson) {
    return (
      <LessonPlayer
        lesson={activeLesson}
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
        module={excelBasicsModule}
        completedLessonIds={completedLessonIds}
        totalXp={totalXp}
        onStartLesson={handleStartLesson}
        hasAssignments={hasAssignments}
        isLessonAssigned={isLessonAssigned}
        getDueDate={getDueDate}
      />
    </div>
  );
};

export default ModulePlayer;
