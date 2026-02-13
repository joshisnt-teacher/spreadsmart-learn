import React, { useState } from 'react';
import { format, isPast, isFuture } from 'date-fns';
import { Plus, Trash2, CalendarIcon, Clock, BookOpen, Users, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { excelBasicsModule } from '@/data/excel-basics-module';
import { useClassAssignments, type Assignment } from '@/hooks/useAssignments';
import { toast } from '@/hooks/use-toast';

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
  const [showCreate, setShowCreate] = useState(false);
  const [scope, setScope] = useState<'module' | 'lesson'>('module');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [target, setTarget] = useState<'class' | 'student'>('class');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [liveDate, setLiveDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [creating, setCreating] = useState(false);

  const module = excelBasicsModule;

  const resetForm = () => {
    setScope('module');
    setSelectedLessonId('');
    setTarget('class');
    setSelectedStudentId('');
    setLiveDate(new Date());
    setDueDate(undefined);
  };

  const handleCreate = async () => {
    setCreating(true);
    const ok = await createAssignment({
      class_id: classId,
      student_user_id: target === 'student' ? selectedStudentId : null,
      module_id: module.id,
      lesson_id: scope === 'lesson' ? selectedLessonId : null,
      step_id: null,
      live_date: liveDate.toISOString(),
      due_date: dueDate ? dueDate.toISOString() : null,
    });
    if (ok) {
      toast({ title: 'Assignment created' });
      setShowCreate(false);
      resetForm();
    } else {
      toast({ title: 'Error creating assignment', variant: 'destructive' });
    }
    setCreating(false);
  };

  const handleDelete = async (id: string) => {
    const ok = await deleteAssignment(id);
    if (ok) toast({ title: 'Assignment deleted' });
    else toast({ title: 'Error', variant: 'destructive' });
  };

  const getAssignmentLabel = (a: Assignment) => {
    if (!a.lesson_id) return module.title + ' (Full Module)';
    const lesson = module.lessons.find((l) => l.id === a.lesson_id);
    return lesson ? lesson.title : a.lesson_id;
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

  const canCreate = scope === 'module' || (scope === 'lesson' && selectedLessonId);
  const canCreateFinal = canCreate && (target === 'class' || (target === 'student' && selectedStudentId));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{assignments.length} assignment(s)</p>
        <Button onClick={() => { resetForm(); setShowCreate(true); }}>
          <Plus className="w-4 h-4 mr-2" /> New Assignment
        </Button>
      </div>

      {loading ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">Loading…</CardContent></Card>
      ) : assignments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No assignments yet. Create one to assign work to your students.</p>
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
                    <td className="py-2 px-4 text-xs">{a.due_date ? format(new Date(a.due_date), 'dd MMM yyyy') : '—'}</td>
                    <td className="py-2 px-4 text-center">
                      <Badge variant={status.variant} className="text-xs">{status.label}</Badge>
                    </td>
                    <td className="py-2 px-4 text-right">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(a.id)}>
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

      {/* Create Assignment Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Assignment</DialogTitle>
            <DialogDescription>Assign work to your class or individual students.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Scope */}
            <div className="space-y-2">
              <Label>Scope</Label>
              <Select value={scope} onValueChange={(v) => { setScope(v as 'module' | 'lesson'); setSelectedLessonId(''); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="module">Entire Module</SelectItem>
                  <SelectItem value="lesson">Specific Lesson</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {scope === 'lesson' && (
              <div className="space-y-2">
                <Label>Lesson</Label>
                <Select value={selectedLessonId} onValueChange={setSelectedLessonId}>
                  <SelectTrigger><SelectValue placeholder="Select a lesson" /></SelectTrigger>
                  <SelectContent>
                    {module.lessons.map((l) => (
                      <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Target */}
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

            {/* Live Date */}
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

            {/* Due Date */}
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
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={creating || !canCreateFinal}>
              {creating ? 'Creating…' : 'Create Assignment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssignmentManager;
