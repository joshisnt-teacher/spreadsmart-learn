import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Star, Zap, ChevronRight, CalendarClock, LogOut, Trophy, Target } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import { useStudentAssignments } from '@/hooks/useAssignments';
import { allModules } from '@/data/module-registry';

/** Small component per module card to encapsulate hooks */
const ModuleCard: React.FC<{ module: typeof allModules[0]; navigate: ReturnType<typeof useNavigate> }> = ({ module, navigate }) => {
  const { completedLessonIds, totalXp, loading: progressLoading } = useProgress(module.id);
  const { assignments, hasAssignments, isLessonAssigned, getDueDate, loading: assignLoading } = useStudentAssignments(module.id);

  const totalLessons = module.lessons.length;
  const completedCount = completedLessonIds.length;
  const progressPercent = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  const assignedLessons = module.lessons.filter(l => isLessonAssigned(l.id));

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

  if (progressLoading || assignLoading) return null;

  return (
    <Card className="overflow-hidden">
      {module.bannerUrl && (
        <div className="h-32 overflow-hidden">
          <img src={module.bannerUrl} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{module.title}</CardTitle>
              {moduleDueLabel && (
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1 bg-muted px-2 py-0.5 rounded-full">
                  <CalendarClock className="w-3 h-3" />
                  {moduleDueLabel}
                </span>
              )}
            </div>
            <CardDescription className="mt-1">{module.description}</CardDescription>
          </div>
          <Button size="sm" onClick={() => navigate(`/module/${module.id}`)}>
            <Zap className="w-4 h-4 mr-1" />
            {completedCount > 0 ? 'Continue' : 'Start'}
          </Button>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> ~{module.estimatedMinutes} min</span>
          <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {totalLessons} lessons</span>
          <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5" /> {totalXp} XP</span>
        </div>
        {completedCount > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{completedCount}/{totalLessons}</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {assignedLessons.map((lesson, idx) => {
            const isComplete = completedLessonIds.includes(lesson.id);
            const dueDate = getDueDate(lesson.id);

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => navigate(`/module/${module.id}`)}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold shrink-0 ${
                  isComplete ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {isComplete ? '✓' : idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{lesson.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{lesson.steps.length} steps</span>
                    {dueDate && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <CalendarClock className="w-3 h-3" />
                        Due {format(new Date(dueDate), 'dd MMM')}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const StudentDashboard: React.FC = () => {
  const { user, loading: authLoading, role, signOut } = useAuth();
  const navigate = useNavigate();

  // Aggregate stats across all modules — use first module for quick stats
  const { completedLessonIds, totalXp, loading: progressLoading } = useProgress(allModules[0]?.id ?? '');
  const { assignments, loading: assignLoading } = useStudentAssignments(allModules[0]?.id ?? '');

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
    if (!authLoading && user && role === 'teacher') navigate('/dashboard');
  }, [authLoading, user, role, navigate]);

  if (authLoading || progressLoading || assignLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  const totalLessons = allModules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedCount = completedLessonIds.length;

  const upcomingDue = assignments
    .filter(a => a.due_date && new Date(a.due_date) > new Date())
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime());

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 border-b">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
              <p className="text-muted-foreground mt-1">Track your progress and assignments</p>
            </motion.div>
            <Button variant="ghost" size="sm" onClick={async () => { await signOut(); navigate('/auth'); }}>
              <LogOut className="w-4 h-4 mr-1" /> Sign Out
            </Button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <Star className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalXp}</p>
                    <p className="text-xs text-muted-foreground">Total XP</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10">
                    <Trophy className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{completedCount}/{totalLessons}</p>
                    <p className="text-xs text-muted-foreground">Lessons Done</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-warning/10">
                    <Target className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{upcomingDue.length}</p>
                    <p className="text-xs text-muted-foreground">Upcoming Due</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">
        {/* Module cards */}
        <section>
          <h2 className="text-xl font-semibold mb-4">My Modules</h2>
          <div className="space-y-6">
            {allModules.map((mod) => (
              <ModuleCard key={mod.id} module={mod} navigate={navigate} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StudentDashboard;
