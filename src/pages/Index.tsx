import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModuleLanding from '@/components/ModuleLanding';
import LessonPlayer from '@/components/LessonPlayer';
import { excelBasicsModule } from '@/data/excel-basics-module';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import { useStudentAssignments } from '@/hooks/useAssignments';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const Index: React.FC = () => {
  const { user, loading: authLoading, role, signOut } = useAuth();
  const navigate = useNavigate();
  const { completedLessonIds, totalXp, loading: progressLoading, markLessonComplete } = useProgress(excelBasicsModule.id);
  const { hasAssignments, isLessonAssigned, getDueDate, loading: assignLoading } = useStudentAssignments(excelBasicsModule.id);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
    if (!authLoading && user && role === 'teacher') {
      navigate('/dashboard');
    }
    if (!authLoading && user && role === 'student') {
      navigate('/student');
    }
  }, [authLoading, user, role, navigate]);

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
      <div className="absolute top-4 right-4 z-10">
        <Button variant="ghost" size="sm" onClick={async () => { await signOut(); navigate('/auth'); }}>
          <LogOut className="w-4 h-4 mr-1" /> Sign Out
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

export default Index;
