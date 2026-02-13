import React, { useState, useCallback } from 'react';
import ModuleLanding from '@/components/ModuleLanding';
import LessonPlayer from '@/components/LessonPlayer';
import { excelBasicsModule } from '@/data/excel-basics-module';
import { toast } from '@/hooks/use-toast';

const Index: React.FC = () => {
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [totalXp, setTotalXp] = useState(0);

  const activeLesson = activeLessonId
    ? excelBasicsModule.lessons.find((l) => l.id === activeLessonId)
    : null;

  const handleStartLesson = useCallback((lessonId: string) => {
    setActiveLessonId(lessonId);
  }, []);

  const handleLessonComplete = useCallback((xpEarned: number) => {
    if (activeLessonId) {
      setCompletedLessonIds((prev) => [...new Set([...prev, activeLessonId])]);
      setTotalXp((prev) => prev + xpEarned);
      toast({
        title: '🎉 Lesson Complete!',
        description: `You earned ${xpEarned} XP. Great work!`,
      });
      setActiveLessonId(null);
    }
  }, [activeLessonId]);

  const handleBack = useCallback(() => {
    setActiveLessonId(null);
  }, []);

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
    <ModuleLanding
      module={excelBasicsModule}
      completedLessonIds={completedLessonIds}
      totalXp={totalXp}
      onStartLesson={handleStartLesson}
    />
  );
};

export default Index;
