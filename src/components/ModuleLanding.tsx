import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, ChevronRight, Star, Zap, Lock, CalendarClock } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Module } from '@/types/lesson';

interface ModuleLandingProps {
  module: Module;
  completedLessonIds?: string[];
  totalXp?: number;
  onStartLesson: (lessonId: string) => void;
  hasAssignments?: boolean;
  isLessonAssigned?: (lessonId: string) => boolean;
  getDueDate?: (lessonId: string) => string | null;
  moduleDueLabel?: string | null;
}

const ModuleLanding: React.FC<ModuleLandingProps> = ({
  module,
  completedLessonIds = [],
  totalXp = 0,
  onStartLesson,
  hasAssignments = false,
  isLessonAssigned = () => true,
  getDueDate = () => null,
  moduleDueLabel = null,
}) => {
  const totalLessons = module.lessons.length;
  const completedCount = completedLessonIds.length;
  const progressPercent = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  // Find the first incomplete lesson
  const nextLesson = module.lessons.find((l) => !completedLessonIds.includes(l.id)) || module.lessons[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 border-b">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <BookOpen className="w-4 h-4" />
              <span>Module</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-4xl font-bold tracking-tight">{module.title}</h1>
              {moduleDueLabel && (
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 bg-muted/60 px-3 py-1 rounded-full">
                  <CalendarClock className="w-3.5 h-3.5" />
                  {moduleDueLabel}
                </span>
              )}
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">{module.description}</p>

            <div className="flex flex-wrap items-center gap-6 mt-6">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>~{module.estimatedMinutes} minutes</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <span>{totalLessons} lessons</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 text-warning" />
                <span>{totalXp} XP earned</span>
              </div>
            </div>

            {completedCount > 0 && (
              <div className="mt-6 max-w-sm">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Progress</span>
                  <span>{completedCount}/{totalLessons} lessons</span>
                </div>
                <Progress value={progressPercent} className="h-2.5" />
              </div>
            )}

            <Button
              size="lg"
              className="mt-8"
              onClick={() => onStartLesson(nextLesson.id)}
            >
              <Zap className="w-4 h-4 mr-2" />
              {completedCount > 0 ? 'Continue Learning' : 'Start Module'}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Lesson list */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-xl font-semibold mb-6">Lessons</h2>
        <div className="space-y-3">
          {module.lessons.map((lesson, idx) => {
            const isComplete = completedLessonIds.includes(lesson.id);
            const isCurrent = lesson.id === nextLesson.id;
            const isLocked = idx > 0 && !completedLessonIds.includes(module.lessons[idx - 1].id) && !isCurrent;
            const assigned = isLessonAssigned(lesson.id);
            const dueDate = getDueDate(lesson.id);
            const isHidden = hasAssignments && !assigned;

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
              >
                <Card
                  className={`transition-all ${
                    isHidden
                      ? 'opacity-30 cursor-not-allowed'
                      : isCurrent
                      ? 'border-primary/40 shadow-md cursor-pointer'
                      : isComplete
                      ? 'border-accent/30 bg-accent/5 cursor-pointer'
                      : isLocked
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:shadow-sm cursor-pointer'
                  }`}
                  onClick={() => !isLocked && !isHidden && onStartLesson(lesson.id)}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold shrink-0 ${
                      isComplete
                        ? 'bg-accent text-accent-foreground'
                        : isCurrent
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {isComplete ? '✓' : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm">{lesson.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{lesson.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-muted-foreground">{lesson.steps.length} steps</p>
                        {dueDate && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <CalendarClock className="w-3 h-3" />
                            Due {format(new Date(dueDate), 'dd MMM')}
                          </span>
                        )}
                        {isHidden && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Not assigned
                          </span>
                        )}
                      </div>
                    </div>
                    {!isLocked && (
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModuleLanding;
