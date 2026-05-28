import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Trash2, CheckCircle, AlertCircle, Database, Users, Trophy, TrendingUp, CheckCircle2, BookOpen, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { allModules } from '@/data/module-registry';
import { motion, AnimatePresence } from 'framer-motion';

interface StudentOption {
  user_id: string;
  username: string;
}

interface ModuleOption {
  id: string;
  title: string;
}

interface LessonOption {
  id: string;
  title: string;
}

interface RawEvent {
  id: string;
  step_id: string;
  event_type: string;
  metadata: Record<string, any>;
  created_at: string;
}

interface CompressedStep {
  step_id: string;
  attempts: number;
  first_attempt_correct: boolean | null;
  hints_used: number;
  started_at: string | null;
  completed_at: string | null;
  total_time_seconds: number | null;
  xp_earned: number;
}

interface CompressedModuleCompletion {
  user_id: string;
  module_id: string;
  completed_lesson_ids: string[];
  total_xp: number;
  fully_completed: boolean;
}

interface CompressedLessonSummary {
  user_id: string;
  module_id: string;
  lesson_id: string;
  step_id: string;
  completed_at: string | null;
  xp_earned: number;
}

interface LessonProgressFallback {
  lesson_id: string;
  total_xp: number;
  completed: boolean;
}

interface StudentCompressedData {
  student: StudentOption;
  moduleCompletions: Map<string, CompressedModuleCompletion>;
  lessonSteps: CompressedLessonSummary[];
  lessonProgress: Map<string, LessonProgressFallback>;
}

const eventBadge: Record<string, string> = {
  step_start: 'bg-blue-50 text-blue-700 border-blue-200',
  step_complete: 'bg-green-50 text-green-700 border-green-200',
  check_fail: 'bg-red-50 text-red-700 border-red-200',
  hint_used: 'bg-amber-50 text-amber-700 border-amber-200',
};

function formatMeta(e: RawEvent): string {
  if (!e.metadata || Object.keys(e.metadata).length === 0) return '';
  if (e.event_type === 'step_complete') {
    const m = e.metadata;
    const parts: string[] = [];
    if (m.attempt_count != null) parts.push(`attempts=${m.attempt_count}`);
    if (m.time_spent_seconds != null) parts.push(`time=${m.time_spent_seconds}s`);
    if (m.xp_earned != null) parts.push(`xp=${m.xp_earned}`);
    return parts.join(', ');
  }
  if (e.event_type === 'check_fail') {
    const m = e.metadata;
    const parts: string[] = [];
    if (m.attempt != null) parts.push(`#${m.attempt}`);
    if (m.feedback_type) parts.push(m.feedback_type);
    return parts.join(', ');
  }
  if (e.event_type === 'hint_used') {
    const idx = e.metadata.hint_index;
    return idx != null ? `hint #${idx + 1}` : '';
  }
  return JSON.stringify(e.metadata);
}

const totalLessonsAllModules = allModules.reduce((sum, m) => sum + m.lessons.length, 0);

function getStudentStats(sp: StudentCompressedData, moduleFilter: string) {
  if (moduleFilter === 'all') {
    let completedLessons = 0;
    let xp = 0;
    for (const mc of sp.moduleCompletions.values()) {
      completedLessons += mc.completed_lesson_ids?.length ?? 0;
      xp += mc.total_xp ?? 0;
    }
    const totalLessons = totalLessonsAllModules;
    return { completedLessons, xp, totalLessons, progressPct: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0 };
  }
  const mod = allModules.find((m) => m.id === moduleFilter);
  const mc = sp.moduleCompletions.get(moduleFilter);
  const completedLessons = mc?.completed_lesson_ids?.length ?? 0;
  const totalLessons = mod?.lessons.length ?? 0;
  const xp = mc?.total_xp ?? 0;
  return { completedLessons, xp, totalLessons, progressPct: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0 };
}

const CompressionTest: React.FC = () => {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Raw test state
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [modules, setModules] = useState<ModuleOption[]>([]);
  const [lessons, setLessons] = useState<LessonOption[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');
  const [rawEvents, setRawEvents] = useState<RawEvent[]>([]);
  const [compressedSteps, setCompressedSteps] = useState<CompressedStep[]>([]);
  const [rawLoading, setRawLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);

  // Class view state
  const [classStudents, setClassStudents] = useState<StudentOption[]>([]);
  const [selectedClassStudent, setSelectedClassStudent] = useState('');
  const [compressedData, setCompressedData] = useState<StudentCompressedData[]>([]);
  const [classLoading, setClassLoading] = useState(false);
  const [moduleFilter, setModuleFilter] = useState('all');
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && role && role !== 'teacher') {
      navigate('/dashboard');
    }
  }, [authLoading, role, navigate]);

  const fetchStudents = useCallback(async () => {
    const { data } = await supabase
      .from('class_students')
      .select('student_user_id, username')
      .order('username');
    const list = (data ?? []).map((s: any) => ({ user_id: s.student_user_id, username: s.username }));
    setStudents(list);
    setClassStudents(list);
  }, []);

  const fetchModules = useCallback(async () => {
    const { data } = await supabase.from('step_events').select('module_id').order('module_id');
    const unique = [...new Set((data ?? []).map((d: any) => d.module_id))];
    setModules(unique.map((id) => ({ id: id as string, title: id as string })));
  }, []);

  const fetchLessons = useCallback(async (moduleId: string) => {
    const { data } = await supabase.from('step_events').select('lesson_id').eq('module_id', moduleId).order('lesson_id');
    const unique = [...new Set((data ?? []).map((d: any) => d.lesson_id))];
    setLessons(unique.map((id) => ({ id: id as string, title: id as string })));
  }, []);

  useEffect(() => { fetchStudents(); fetchModules(); }, [fetchStudents, fetchModules]);
  useEffect(() => { if (selectedModule) { fetchLessons(selectedModule); setSelectedLesson(''); } }, [selectedModule, fetchLessons]);

  const loadRawEvents = async () => {
    if (!selectedStudent || !selectedModule || !selectedLesson) return;
    setRawLoading(true);
    const { data } = await supabase.from('step_events').select('*')
      .eq('user_id', selectedStudent).eq('module_id', selectedModule).eq('lesson_id', selectedLesson)
      .order('created_at', { ascending: true });
    setRawEvents(data ?? []);
    setRawLoading(false);
  };

  const loadCompressed = async () => {
    if (!selectedStudent || !selectedModule || !selectedLesson) return;
    const { data } = await supabase.from('step_summaries').select('*')
      .eq('user_id', selectedStudent).eq('module_id', selectedModule).eq('lesson_id', selectedLesson).order('step_id');
    setCompressedSteps(data ?? []);
  };

  const handleCompress = async () => {
    if (!selectedStudent || !selectedModule || !selectedLesson) {
      toast({ title: 'Select all fields', variant: 'destructive' }); return;
    }
    setCompressing(true);
    const { data, error } = await supabase.rpc('compress_lesson_events', {
      _user_id: selectedStudent, _module_id: selectedModule, _lesson_id: selectedLesson,
    });
    if (error) {
      toast({ title: 'Compression failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Compressed', description: `${data[0].steps_compressed} steps from ${data[0].events_read} events` });
      await loadCompressed();
    }
    setCompressing(false);
  };

  const handleDeleteCompression = async () => {
    if (!selectedStudent || !selectedModule || !selectedLesson) return;
    const { error } = await supabase.from('step_summaries').delete()
      .eq('user_id', selectedStudent).eq('module_id', selectedModule).eq('lesson_id', selectedLesson);
    if (error) {
      toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Compression deleted' });
      setCompressedSteps([]);
    }
  };

  useEffect(() => {
    if (selectedStudent && selectedModule && selectedLesson) {
      loadRawEvents(); loadCompressed();
    }
  }, [selectedStudent, selectedModule, selectedLesson]);

  // Class view data loading
  const loadClassCompressedData = useCallback(async () => {
    if (classStudents.length === 0) return;
    setClassLoading(true);
    const userIds = classStudents.map((s) => s.user_id);

    const [mcRes, ssRes, lpRes] = await Promise.all([
      supabase.from('module_completions').select('*').in('user_id', userIds),
      supabase.from('step_summaries').select('*').in('user_id', userIds),
      supabase.from('lesson_progress').select('user_id, lesson_id, total_xp, completed').in('user_id', userIds),
    ]);

    const mcMap = new Map<string, CompressedModuleCompletion[]>();
    for (const mc of mcRes.data ?? []) {
      const list = mcMap.get(mc.user_id) ?? [];
      list.push(mc as CompressedModuleCompletion);
      mcMap.set(mc.user_id, list);
    }

    const lpMap = new Map<string, LessonProgressFallback[]>();
    for (const lp of lpRes.data ?? []) {
      const list = lpMap.get(lp.user_id) ?? [];
      list.push(lp as LessonProgressFallback);
      lpMap.set(lp.user_id, list);
    }

    const data: StudentCompressedData[] = classStudents.map((s) => {
      const mcs = mcMap.get(s.user_id) ?? [];
      const moduleCompletions = new Map<string, CompressedModuleCompletion>();
      for (const mc of mcs) moduleCompletions.set(mc.module_id, mc);
      const lessonSteps = (ssRes.data ?? []).filter((x: any) => x.user_id === s.user_id) as CompressedLessonSummary[];
      const lps = lpMap.get(s.user_id) ?? [];
      const lessonProgress = new Map<string, LessonProgressFallback>();
      for (const lp of lps) lessonProgress.set(lp.lesson_id, lp);
      return { student: s, moduleCompletions, lessonSteps, lessonProgress };
    });

    setCompressedData(data);
    setClassLoading(false);
  }, [classStudents]);

  useEffect(() => { loadClassCompressedData(); }, [loadClassCompressedData]);

  const eventsByStep = rawEvents.reduce((acc, evt) => {
    acc[evt.step_id] = acc[evt.step_id] ?? [];
    acc[evt.step_id].push(evt);
    return acc;
  }, {} as Record<string, RawEvent[]>);

  const eventCounts = rawEvents.reduce((acc, e) => {
    acc[e.event_type] = (acc[e.event_type] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const summaryStats = useMemo(() => {
    if (compressedData.length === 0) return null;
    let totalXp = 0;
    let totalProgressPct = 0;
    let fullyComplete = 0;
    for (const sp of compressedData) {
      const stats = getStudentStats(sp, moduleFilter);
      totalXp += stats.xp;
      totalProgressPct += stats.progressPct;
      if (stats.progressPct === 100) fullyComplete++;
    }
    return {
      studentCount: compressedData.length,
      avgProgress: Math.round(totalProgressPct / compressedData.length),
      totalXp,
      completionRate: Math.round((fullyComplete / compressedData.length) * 100),
    };
  }, [compressedData, moduleFilter]);

  const modulesToShow = moduleFilter === 'all' ? allModules : allModules.filter((m) => m.id === moduleFilter);

  return (
    <div className="min-h-screen bg-background p-6 pb-12">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Compression Test</h1>
        </div>

        <Tabs defaultValue="class" className="w-full">
          <TabsList>
            <TabsTrigger value="class">Class View (Compressed)</TabsTrigger>
            <TabsTrigger value="raw">Raw Test</TabsTrigger>
          </TabsList>

          <TabsContent value="class" className="space-y-4">
            {/* Class selector for raw-test-like feel */}
            <Card>
              <CardHeader>
                <CardTitle>View Compressed Data</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Filter by Student</label>
                  <Select value={selectedClassStudent || 'all-students'} onValueChange={setSelectedClassStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder="All students" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-students">All students</SelectItem>
                      {classStudents.map((s) => (
                        <SelectItem key={s.user_id} value={s.user_id}>{s.username}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Filter by Module</label>
                  <Select value={moduleFilter} onValueChange={setModuleFilter}>
                    <SelectTrigger>
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
              </CardContent>
            </Card>

            {classLoading ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">Loading compressed data…</CardContent></Card>
            ) : compressedData.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">No compressed data found.</CardContent></Card>
            ) : (
              <div className="space-y-4">
                {/* Summary stats */}
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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {compressedData
                        .filter((sp) => !selectedClassStudent || selectedClassStudent === 'all-students' || sp.student.user_id === selectedClassStudent)
                        .map((sp) => {
                          const stats = getStudentStats(sp, moduleFilter);
                          const isExpanded = expandedStudent === sp.student.user_id;

                          return (
                            <React.Fragment key={sp.student.user_id}>
                              <TableRow
                                className="cursor-pointer"
                                onClick={() => setExpandedStudent(isExpanded ? null : sp.student.user_id)}
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
                              </TableRow>
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
                                        <div className="px-8 py-3 bg-muted/20 space-y-4">
                                          {modulesToShow.map((mod) => {
                                            const mc = sp.moduleCompletions.get(mod.id);
                                            return (
                                              <div key={mod.id} className="space-y-2">
                                                {modulesToShow.length > 1 && (
                                                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                    {mod.title}
                                                  </h4>
                                                )}
                                                {mod.lessons.map((lesson) => {
                                                  const lessonSteps = sp.lessonSteps.filter(
                                                    (ls) => ls.module_id === mod.id && ls.lesson_id === lesson.id
                                                  );
                                                  const stepsCompleted = lessonSteps.filter((ls) => ls.completed_at).length;
                                                  const totalLessonSteps = lesson.steps.length;
                                                  const lessonPct = totalLessonSteps > 0 ? (stepsCompleted / totalLessonSteps) * 100 : 0;
                                                  const rawLessonXp = lessonSteps.reduce((sum, ls) => sum + (ls.xp_earned ?? 0), 0);
                                                  const lpFallback = sp.lessonProgress.get(lesson.id);
                                                  const lessonXp = rawLessonXp > 0 ? rawLessonXp : (lpFallback?.total_xp ?? 0);
                                                  const lessonCompleted = mc?.completed_lesson_ids?.includes(lesson.id) || lpFallback?.completed;

                                                  return (
                                                    <div key={lesson.id} className="flex items-center gap-3 text-xs">
                                                      <BookOpen className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                                      <span className="w-40 truncate">{lesson.title}</span>
                                                      <Progress value={lessonPct} className="h-1.5 flex-1 max-w-[100px]" />
                                                      <span className="text-muted-foreground w-16">
                                                        {stepsCompleted}/{totalLessonSteps} steps
                                                      </span>
                                                      <span className="text-muted-foreground w-12 text-right">
                                                        {lessonXp} XP
                                                      </span>
                                                      {lessonCompleted && (
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
            )}
          </TabsContent>

          <TabsContent value="raw" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Select Target</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Student</label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger><SelectValue placeholder="Choose student" /></SelectTrigger>
                    <SelectContent>
                      {students.map((s) => (
                        <SelectItem key={s.user_id} value={s.user_id}>{s.username}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Module</label>
                  <Select value={selectedModule} onValueChange={setSelectedModule}>
                    <SelectTrigger><SelectValue placeholder="Choose module" /></SelectTrigger>
                    <SelectContent>
                      {modules.map((m) => (
                        <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Lesson</label>
                  <Select value={selectedLesson} onValueChange={setSelectedLesson}>
                    <SelectTrigger><SelectValue placeholder="Choose lesson" /></SelectTrigger>
                    <SelectContent>
                      {lessons.map((l) => (
                        <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {selectedStudent && selectedModule && selectedLesson && (
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={handleCompress} disabled={compressing}>
                  <Play className="w-4 h-4 mr-2" />
                  {compressing ? 'Compressing…' : 'Run Compression'}
                </Button>
                {compressedSteps.length > 0 && (
                  <Button variant="destructive" onClick={handleDeleteCompression}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Compression
                  </Button>
                )}
                {rawEvents.length > 0 && compressedSteps.length > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    Compression ratio: {rawEvents.length} events → {compressedSteps.length} steps
                    {' '}({Math.round((1 - compressedSteps.length / rawEvents.length) * 100)}% reduction)
                  </Badge>
                )}
              </div>
            )}

            {rawLoading ? (
              <p className="text-muted-foreground">Loading raw events…</p>
            ) : rawEvents.length > 0 || compressedSteps.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Raw Events */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Raw Events ({rawEvents.length})</CardTitle>
                    {rawEvents.length > 0 && (
                      <div className="flex flex-wrap gap-2 text-xs">
                        {Object.entries(eventCounts).map(([type, count]) => (
                          <span key={type} className="inline-flex items-center gap-1">
                            <Badge variant="outline" className={eventBadge[type] || ''}>{type}</Badge>
                            <span className="text-muted-foreground">{count}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                    {Object.entries(eventsByStep).map(([stepId, evts]) => (
                      <div key={stepId} className="border rounded-lg p-3">
                        <p className="font-medium text-sm mb-2">Step: {stepId}</p>
                        <div className="space-y-1">
                          {evts.map((e) => (
                            <div key={e.id} className="text-xs flex items-center gap-2">
                              <Badge variant="outline" className={`text-[10px] ${eventBadge[e.event_type] || ''}`}>
                                {e.event_type}
                              </Badge>
                              <span className="text-muted-foreground tabular-nums">
                                {new Date(e.created_at).toLocaleTimeString()}
                              </span>
                              {formatMeta(e) && (
                                <span className="text-muted-foreground truncate">{formatMeta(e)}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Compressed Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      Compressed Summary ({compressedSteps.length} steps)
                      {compressedSteps.length > 0 && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {compressedSteps.length === 0 && rawEvents.length > 0 && (
                        <AlertCircle className="w-4 h-4 text-muted-foreground" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                    {compressedSteps.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No compression yet. Click Run Compression.</p>
                    ) : (
                      compressedSteps.map((s) => (
                        <div key={s.step_id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-sm">Step: {s.step_id}</p>
                            {s.completed_at ? (
                              <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">
                                Completed
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-700 border-slate-200">
                                Incomplete
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div><span className="text-muted-foreground">Attempts:</span> {s.attempts}</div>
                            <div><span className="text-muted-foreground">Hints:</span> {s.hints_used}</div>
                            <div>
                              <span className="text-muted-foreground">First correct:</span>{' '}
                              {s.first_attempt_correct === true ? 'Yes' : s.first_attempt_correct === false ? 'No' : 'N/A'}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Time:</span>{' '}
                              {s.total_time_seconds !== null ? `${s.total_time_seconds}s` : 'N/A'}
                            </div>
                            <div className="col-span-2">
                              <span className="text-muted-foreground">Started:</span>{' '}
                              {s.started_at ? new Date(s.started_at).toLocaleString() : 'N/A'}
                              {s.completed_at && (
                                <>
                                  {' · '}
                                  <span className="text-muted-foreground">Completed:</span>{' '}
                                  {new Date(s.completed_at).toLocaleString()}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : selectedStudent && selectedModule && selectedLesson ? (
              <p className="text-muted-foreground">No raw events found for this selection.</p>
            ) : null}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CompressionTest;
