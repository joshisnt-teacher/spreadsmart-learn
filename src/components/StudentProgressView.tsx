import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { excelBasicsModule } from '@/data/excel-basics-module';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Trophy, Target, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StudentProgressData {
  studentId: string;
  username: string;
  moduleProgress: {
    completedLessonIds: string[];
    totalXp: number;
  } | null;
  lessonProgress: {
    lessonId: string;
    completedStepIds: string[];
    totalXp: number;
    completed: boolean;
    attempts: Record<string, number>;
  }[];
}

interface Props {
  classId: string;
  students: { id: string; username: string; student_user_id: string }[];
}

const StudentProgressView: React.FC<Props> = ({ classId, students }) => {
  const [progressData, setProgressData] = useState<StudentProgressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  const module = excelBasicsModule;
  const totalLessons = module.lessons.length;
  const totalSteps = module.lessons.reduce((sum, l) => sum + l.steps.length, 0);

  const fetchProgress = useCallback(async () => {
    if (students.length === 0) {
      setProgressData([]);
      setLoading(false);
      return;
    }

    const studentUserIds = students.map((s) => s.student_user_id);

    const [moduleRes, lessonRes] = await Promise.all([
      supabase
        .from('module_progress')
        .select('*')
        .eq('module_id', module.id)
        .in('user_id', studentUserIds),
      supabase
        .from('lesson_progress')
        .select('*')
        .in('user_id', studentUserIds),
    ]);

    const moduleMap = new Map(
      (moduleRes.data ?? []).map((mp) => [mp.user_id, mp])
    );
    const lessonMap = new Map<string, typeof lessonRes.data>();
    for (const lp of lessonRes.data ?? []) {
      const existing = lessonMap.get(lp.user_id) ?? [];
      existing.push(lp);
      lessonMap.set(lp.user_id, existing);
    }

    const data: StudentProgressData[] = students.map((s) => {
      const mp = moduleMap.get(s.student_user_id);
      const lps = lessonMap.get(s.student_user_id) ?? [];
      return {
        studentId: s.id,
        username: s.username,
        moduleProgress: mp
          ? { completedLessonIds: mp.completed_lesson_ids, totalXp: mp.total_xp }
          : null,
        lessonProgress: lps.map((lp) => ({
          lessonId: lp.lesson_id,
          completedStepIds: lp.completed_step_ids,
          totalXp: lp.total_xp,
          completed: lp.completed,
          attempts: (lp.attempts as Record<string, number>) ?? {},
        })),
      };
    });

    setProgressData(data);
    setLoading(false);
  }, [students, module.id]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Loading progress data…
        </CardContent>
      </Card>
    );
  }

  if (progressData.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Target className="w-5 h-5" /> Student Progress
      </h3>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left py-2 px-4 font-medium w-8"></th>
              <th className="text-left py-2 px-4 font-medium">Student</th>
              <th className="text-left py-2 px-4 font-medium">Progress</th>
              <th className="text-center py-2 px-4 font-medium">Lessons</th>
              <th className="text-center py-2 px-4 font-medium">XP</th>
              <th className="text-center py-2 px-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {progressData.map((sp) => {
              const completedLessons = sp.moduleProgress?.completedLessonIds.length ?? 0;
              const xp = sp.moduleProgress?.totalXp ?? 0;
              const progressPct = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
              const isExpanded = expandedStudent === sp.studentId;

              return (
                <React.Fragment key={sp.studentId}>
                  <tr
                    className="border-b border-border last:border-0 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setExpandedStudent(isExpanded ? null : sp.studentId)}
                  >
                    <td className="py-2 px-4">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </td>
                    <td className="py-2 px-4 font-mono">{sp.username}</td>
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        <Progress value={progressPct} className="h-2 flex-1 max-w-[120px]" />
                        <span className="text-xs text-muted-foreground">{Math.round(progressPct)}%</span>
                      </div>
                    </td>
                    <td className="py-2 px-4 text-center">
                      <span className="text-xs">
                        {completedLessons}/{totalLessons}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-center">
                      <span className="text-xs font-semibold flex items-center justify-center gap-1">
                        <Trophy className="w-3 h-3 text-amber-500" />
                        {xp}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-center">
                      {progressPct === 100 ? (
                        <Badge variant="default" className="text-xs">Complete</Badge>
                      ) : progressPct > 0 ? (
                        <Badge variant="secondary" className="text-xs">In Progress</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">Not Started</Badge>
                      )}
                    </td>
                  </tr>
                  <AnimatePresence>
                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="p-0">
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-8 py-3 bg-muted/20 space-y-2">
                              {module.lessons.map((lesson) => {
                                const lp = sp.lessonProgress.find((l) => l.lessonId === lesson.id);
                                const stepsCompleted = lp?.completedStepIds.length ?? 0;
                                const totalLessonSteps = lesson.steps.length;
                                const lessonPct = totalLessonSteps > 0 ? (stepsCompleted / totalLessonSteps) * 100 : 0;

                                return (
                                  <div key={lesson.id} className="flex items-center gap-3 text-xs">
                                    <BookOpen className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                    <span className="w-40 truncate">{lesson.title}</span>
                                    <Progress value={lessonPct} className="h-1.5 flex-1 max-w-[100px]" />
                                    <span className="text-muted-foreground w-16">
                                      {stepsCompleted}/{totalLessonSteps} steps
                                    </span>
                                    <span className="text-muted-foreground w-12 text-right">
                                      {lp?.totalXp ?? 0} XP
                                    </span>
                                    {lp?.completed && (
                                      <Badge variant="default" className="text-[10px] h-4">✓</Badge>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentProgressView;
