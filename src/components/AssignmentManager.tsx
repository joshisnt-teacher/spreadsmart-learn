import React, { useState } from 'react';
import { format, isPast, isFuture } from 'date-fns';
import { Trash2, CalendarIcon, Clock, BookOpen, Users, User, ChevronDown, ChevronRight, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { allModules, getModuleById } from '@/data/module-registry';
import { useClassAssignments, type Assignment } from '@/hooks/useAssignments';
import { toast } from '@/hooks/use-toast';
import type { Module } from '@/types/lesson';

interface StudentData {
  id: string;
  username: string;
  student_user_id: string;
}

interface Props {
  classId: string;
  students: StudentData[];
}

const AssignmentManager: React.FC<Props> = ({ classId, students }) => {
  const { assignments, loading, createAssignment, deleteAssignment } = useClassAssignments(classId);

  // Module card state
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [selectedLessons, setSelectedLessons] = useState<Map<string, Set<string>>>(new Map());
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  // Dialog state
  const [showAssign, setShowAssign] = useState(false);
  const [target, setTarget] = useState<'class' | 'student'>('class');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [liveDate, setLiveDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [creating, setCreating] = useState(false);

  // Delete confirmation
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const assignableModules = allModules;

  const toggleExpanded = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  const toggleLesson = (moduleId: string, lessonId: string) => {
    setSelectedLessons((prev) => {
      const next = new Map(prev);
      const set = new Set(next.get(moduleId) ?? []);
      if (set.has(lessonId)) set.delete(lessonId);
      else set.add(lessonId);
      next.set(moduleId, set);
      return next;
    });
  };

  const getModuleSelectedLessons = (moduleId: string) => selectedLessons.get(moduleId) ?? new Set<string>();

  const openAssignDialog = (moduleId: string) => {
    setActiveModuleId(moduleId);
    setTarget('class');
    setSelectedStudentId('');
    setLiveDate(new Date());
    setDueDate(undefined);
    setShowAssign(true);
  };

  const handleCreate = async () => {
    if (!activeModuleId) return;
    setCreating(true);
    const moduleLessons = getModuleSelectedLessons(activeModuleId);
    const base = {
      class_id: classId,
      student_user_id: target === 'student' ? selectedStudentId : null,
      module_id: activeModuleId,
      step_id: null,
      live_date: liveDate.toISOString(),
      due_date: dueDate ? dueDate.toISOString() : null,
    };

    let success = true;
    if (moduleLessons.size === 0) {
      success = await createAssignment({ ...base, lesson_id: null });
    } else {
      for (const lessonId of moduleLessons) {
        const ok = await createAssignment({ ...base, lesson_id: lessonId });
        if (!ok) success = false;
      }
    }

    if (success) {
      toast({ title: 'Assignment created' });
      setShowAssign(false);
      setSelectedLessons((prev) => { const next = new Map(prev); next.delete(activeModuleId); return next; });
    } else {
      toast({ title: 'Error creating assignment', variant: 'destructive' });
    }
    setCreating(false);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    const ok = await deleteAssignment(deleteTargetId);
    if (ok) toast({ title: 'Assignment deleted' });
    else toast({ title: 'Error', variant: 'destructive' });
    setDeleteTargetId(null);
  };

  const getAssignmentLabel = (a: Assignment) => {
    // Check built-in modules first, then custom
    const builtIn = getModuleById(a.module_id);
    if (builtIn) {
      if (!a.lesson_id) return builtIn.title + ' (Full Module)';
      const lesson = builtIn.lessons.find((l) => l.id === a.lesson_id);
      return lesson ? `${builtIn.title} › ${lesson.title}` : a.lesson_id;
    }
    return a.module_id + ' (Full Module)';
  };

  const getTargetLabel = (a: Assignment) => {
    if (!a.student_user_id) return 'Whole Class';
    const student = students.find((s) => s.student_user_id === a.student_user_id);
    return student?.username ?? 'Student';
  };

  const getStatus = (a: Assignment): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } => {
    const live = new Date(a.live_date);
    if (isFuture(live)) return { label: 'Scheduled', variant: 'outline' };
    if (a.due_date && isPast(new Date(a.due_date))) return { label: 'Past Due', variant: 'destructive' };
    return { label: 'Live', variant: 'default' };
  };

  const activeModule = activeModuleId ? assignableModules.find(m => m.id === activeModuleId) : null;
  const activeSelected = activeModuleId ? getModuleSelectedLessons(activeModuleId) : new Set<string>();
  const scopeSummary = activeModule
    ? (activeSelected.size === 0
      ? 'All lessons'
      : `${activeSelected.size} of ${activeModule.lessons.length} lessons selected`)
    : '';

  const canCreate = target === 'class' || (target === 'student' && selectedStudentId);

  return (
     <div className="space-y-6">
      {/* Module Cards */}
      {assignableModules.map((mod) => {
        const modSelected = getModuleSelectedLessons(mod.id);
        const isExpanded = expandedModules.has(mod.id);
        const modScopeSummary = modSelected.size === 0
          ? 'All lessons'
          : `${modSelected.size} of ${mod.lessons.length} lessons selected`;
        const isCustom = !allModules.some(m => m.id === mod.id);

        return (
          <Card key={mod.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {mod.title}

                  </CardTitle>
                  <CardDescription className="mt-1">{mod.description}</CardDescription>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>{mod.lessons.length} lessons</span>
                    <span>~{mod.estimatedMinutes} min</span>
                  </div>
                </div>
                <Button onClick={() => openAssignDialog(mod.id)}>
                  <Send className="w-4 h-4 mr-2" /> Assign to Class
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(mod.id)}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1.5 px-2 text-muted-foreground">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    {isExpanded ? 'Hide lessons' : 'Show lessons'}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 space-y-1">
                  {mod.lessons.map((lesson) => (
                    <label
                      key={lesson.id}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 cursor-pointer"
                    >
                      <Checkbox
                        checked={modSelected.has(lesson.id)}
                        onCheckedChange={() => toggleLesson(mod.id, lesson.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{lesson.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{lesson.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0">{lesson.steps.length} steps</Badge>
                    </label>
                  ))}
                  {modSelected.size > 0 && (
                    <div className="flex items-center gap-2 pt-2 px-3">
                      <p className="text-xs text-muted-foreground flex-1">{modScopeSummary}</p>
                      <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => setSelectedLessons((prev) => { const next = new Map(prev); next.delete(mod.id); return next; })}>
                        Clear selection
                      </Button>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        );
      })}

      {/* Existing Assignments */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">{assignments.length} assignment(s)</h3>
        {loading ? (
          <Card><CardContent className="py-8 text-center text-muted-foreground">Loading…</CardContent></Card>
        ) : assignments.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <BookOpen className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">No assignments yet. Assign a module above to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left py-2 px-4 font-medium">Scope</th>
                  <th className="text-left py-2 px-4 font-medium">Target</th>
                  <th className="text-left py-2 px-4 font-medium">Live Date</th>
                  <th className="text-left py-2 px-4 font-medium">Due Date</th>
                  <th className="text-center py-2 px-4 font-medium">Status</th>
                  <th className="text-right py-2 px-4 font-medium w-12"></th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((a) => {
                  const status = getStatus(a);
                  return (
                    <tr key={a.id} className="border-b border-border last:border-0">
                      <td className="py-2 px-4">{getAssignmentLabel(a)}</td>
                      <td className="py-2 px-4">
                        <span className="flex items-center gap-1.5">
                          {a.student_user_id ? <User className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                          {getTargetLabel(a)}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-xs">{format(new Date(a.live_date), 'dd MMM yyyy')}</td>
                      <td className="py-2 px-4 text-xs">{a.due_date ? format(new Date(a.due_date), 'dd MMM yyyy') : 'No due date'}</td>
                      <td className="py-2 px-4 text-center">
                        <Badge variant={status.variant} className="text-xs">{status.label}</Badge>
                      </td>
                      <td className="py-2 px-4 text-right">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteTargetId(a.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete assignment confirmation */}
      <AlertDialog open={!!deleteTargetId} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete assignment?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the assignment. Students will no longer see this module in their dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Assign Dialog */}
      <Dialog open={showAssign} onOpenChange={setShowAssign}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign to Class</DialogTitle>
            <DialogDescription>{activeModule?.title ?? 'Module'}: {scopeSummary}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Target</Label>
              <Select value={target} onValueChange={(v) => { setTarget(v as 'class' | 'student'); setSelectedStudentId(''); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="class">Whole Class</SelectItem>
                  <SelectItem value="student">Specific Student</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {target === 'student' && (
              <div className="space-y-2">
                <Label>Student</Label>
                <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                  <SelectTrigger><SelectValue placeholder="Select a student" /></SelectTrigger>
                  <SelectContent>
                    {students.map((s) => (
                      <SelectItem key={s.student_user_id} value={s.student_user_id}>{s.username}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Live Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !liveDate && "text-muted-foreground")}>
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {liveDate ? format(liveDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={liveDate} onSelect={(d) => d && setLiveDate(d)} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Due Date (optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}>
                    <Clock className="w-4 h-4 mr-2" />
                    {dueDate ? format(dueDate, 'PPP') : 'No deadline'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
              {dueDate && (
                <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => setDueDate(undefined)}>
                  Remove deadline
                </Button>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssign(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={creating || !canCreate}>
              {creating ? 'Creating…' : 'Create Assignment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssignmentManager;
