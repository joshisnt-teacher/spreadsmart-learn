import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { allModules } from '@/data/module-registry';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { BookOpen, Trophy, ChevronDown, ChevronRight, Trash2, UserPlus, Users, TrendingUp, Award, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

interface StudentData {
  id: string;
  username: string;
  student_user_id: string;
  created_at: string;
}

interface ModuleProgressRow {
  module_id: string;
  completed_lesson_ids: string[];
  total_xp: number;
}

interface LessonProgressRow {
  lesson_id: string;
  completed_step_ids: string[];
  total_xp: number;
  completed: boolean;
  attempts: Record<string, number>;
}

interface StudentProgressData {
  student: StudentData;
  moduleProgress: Map<string, ModuleProgressRow>;
  lessonProgress: LessonProgressRow[];
}

interface Props {
  classId: string;
  students: StudentData[];
  onStudentDeleted: () => void;
}

const totalLessonsAllModules = allModules.reduce((sum, m) => sum + m.lessons.length, 0);

function getStudentStats(sp: StudentProgressData, moduleFilter: string) {
  if (moduleFilter === 'all') {
    let completedLessons = 0;
    let xp = 0;
    for (const mp of sp.moduleProgress.values()) {
      completedLessons += mp.completed_lesson_ids.length;
      xp += mp.total_xp;
    }
    const totalLessons = totalLessonsAllModules;
    return { completedLessons, xp, totalLessons, progressPct: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0 };
  }
  const mod = allModules.find((m) => m.id === moduleFilter);
  const mp = sp.moduleProgress.get(moduleFilter);
  const completedLessons = mp?.completed_lesson_ids.length ?? 0;
  const totalLessons = mod?.lessons.length ?? 0;
  const xp = mp?.total_xp ?? 0;
  return { completedLessons, xp, totalLessons, progressPct: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0 };
}

const StudentProgressView: React.FC<Props> = ({ classId, students, onStudentDeleted }) => {
  const [progressData, setProgressData] = useState<StudentProgressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [moduleFilter, setModuleFilter] = useState('all');

  const fetchProgress = useCallback(async () => {
    if (students.length === 0) {
      setProgressData([]);
      setLoading(false);
      return;
    }

    const studentUserIds = students.map((s) => s.student_user_id);

    const [moduleRes, lessonRes] = await Promise.all([
      supabase.from('module_progress').select('*').in('user_id', studentUserIds),
      supabase.from('lesson_progress').select('*').in('user_id', studentUserIds),
    ]);

    const moduleMap = new Map<string, ModuleProgressRow[]>();
    for (const mp of moduleRes.data ?? []) {
      const existing = moduleMap.get(mp.user_id) ?? [];
      existing.push({ module_id: mp.module_id, completed_lesson_ids: mp.completed_lesson_ids, total_xp: mp.total_xp });
      moduleMap.set(mp.user_id, existing);
    }

    const lessonMap = new Map<string, LessonProgressRow[]>();
    for (const lp of lessonRes.data ?? []) {
      const existing = lessonMap.get(lp.user_id) ?? [];
      existing.push({
        lesson_id: lp.lesson_id,
        completed_step_ids: lp.completed_step_ids,
        total_xp: lp.total_xp,
        completed: lp.completed,
        attempts: (lp.attempts as Record<string, number>) ?? {},
      });
      lessonMap.set(lp.user_id, existing);
    }

    const data: StudentProgressData[] = students.map((s) => {
      const mps = moduleMap.get(s.student_user_id) ?? [];
      const mpMap = new Map<string, ModuleProgressRow>();
      for (const mp of mps) mpMap.set(mp.module_id, mp);
      return {
        student: s,
        moduleProgress: mpMap,
        lessonProgress: lessonMap.get(s.student_user_id) ?? [],
      };
    });

    setProgressData(data);
    setLoading(false);
  }, [students]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const handleDelete = async (student: StudentData, e: React.MouseEvent) => {
    e.stopPropagation();
    const { data, error } = await supabase.functions.invoke('delete-student', {
      body: { student_user_id: student.student_user_id, class_id: classId },
    });
    if (error || (data && data.error)) {
      toast({ title: 'Error', description: data?.error || error?.message || 'Failed to delete student', variant: 'destructive' });
    } else {
      toast({ title: 'Student removed from class' });
      onStudentDeleted();
    }
  };

  // Class summary stats
  const summaryStats = useMemo(() => {
    if (progressData.length === 0) return null;
    let totalXp = 0;
    let totalProgressPct = 0;
    let fullyComplete = 0;

    for (const sp of progressData) {
      const stats = getStudentStats(sp, moduleFilter);
      totalXp += stats.xp;
      totalProgressPct += stats.progressPct;
      if (stats.progressPct === 100) fullyComplete++;
    }

    return {
      studentCount: progressData.length,
      avgProgress: Math.round(totalProgressPct / progressData.length),
      totalXp,
      completionRate: Math.round((fullyComplete / progressData.length) * 100),
    };
  }, [progressData, moduleFilter]);

  if (students.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <UserPlus className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No students yet. Add students to this class.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">Loading…</CardContent>
      </Card>
    );
  }

  const modulesToShow = moduleFilter === 'all' ? allModules : allModules.filter((m) => m.id === moduleFilter);

  return (
    <div className="space-y-4">
      {/* Summary stat cards */}
      {summaryStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card>
            <CardContent className="py-4 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2"><Users className="w-4 h-4 text-primary" /></div>
              <div>
                <p className="text-2xl font-bold">{summaryStats.studentCount}</p>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 flex items-center gap-3">
              <div className="rounded-lg bg-accent/10 p-2"><TrendingUp className="w-4 h-4 text-accent" /></div>
              <div>
                <p className="text-2xl font-bold">{summaryStats.avgProgress}%</p>
                <p className="text-xs text-muted-foreground">Avg. Progress</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2"><Trophy className="w-4 h-4 text-warning" /></div>
              <div>
                <p className="text-2xl font-bold">{summaryStats.totalXp.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total XP</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2"><CheckCircle2 className="w-4 h-4 text-primary" /></div>
              <div>
                <p className="text-2xl font-bold">{summaryStats.completionRate}%</p>
                <p className="text-xs text-muted-foreground">Completion</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Module filter */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">Filter:</span>
        <Select value={moduleFilter} onValueChange={setModuleFilter}>
          <SelectTrigger className="w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            {allModules.map((mod) => (
              <SelectItem key={mod.id} value={mod.id}>{mod.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Student table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-8"></TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="text-center">Lessons</TableHead>
              <TableHead className="text-center">XP</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {progressData.map((sp) => {
              const stats = getStudentStats(sp, moduleFilter);
              const isExpanded = expandedStudent === sp.student.id;

              return (
                <React.Fragment key={sp.student.id}>
                  <TableRow
                    className="cursor-pointer"
                    onClick={() => setExpandedStudent(isExpanded ? null : sp.student.id)}
                  >
                    <TableCell className="py-2 px-4">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell className="py-2 px-4 font-mono">{sp.student.username}</TableCell>
                    <TableCell className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        <Progress value={stats.progressPct} className="h-2 flex-1 max-w-[120px]" />
                        <span className="text-xs text-muted-foreground">{Math.round(stats.progressPct)}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 px-4 text-center text-xs">
                      {stats.completedLessons}/{stats.totalLessons}
                    </TableCell>
                    <TableCell className="py-2 px-4 text-center">
                      <span className="text-xs font-semibold flex items-center justify-center gap-1">
                        <Trophy className="w-3 h-3 text-warning" />
                        {stats.xp}
                      </span>
                    </TableCell>
                    <TableCell className="py-2 px-4 text-center">
                      {stats.progressPct === 100 ? (
                        <Badge variant="default" className="text-xs">Complete</Badge>
                      ) : stats.progressPct > 0 ? (
                        <Badge variant="secondary" className="text-xs">In Progress</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">Not Started</Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-2 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={(e) => handleDelete(sp.student, e)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <AnimatePresence>
                    {isExpanded && (
                      <tr>
                        <td colSpan={7} className="p-0">
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-8 py-3 bg-muted/20 space-y-4">
                              {modulesToShow.map((mod) => {
                                const mp = sp.moduleProgress.get(mod.id);
                                return (
                                  <div key={mod.id} className="space-y-2">
                                    {modulesToShow.length > 1 && (
                                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                        {mod.title}
                                      </h4>
                                    )}
                                    {mod.lessons.map((lesson) => {
                                      const lp = sp.lessonProgress.find((l) => l.lesson_id === lesson.id);
                                      const stepsCompleted = lp?.completed_step_ids.length ?? 0;
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
                                            {lp?.total_xp ?? 0} XP
                                          </span>
                                          {lp?.completed && (
                                            <Badge variant="default" className="text-[10px] h-4">✓</Badge>
                                          )}
                                        </div>
                                      );
                                    })}
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
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StudentProgressView;
