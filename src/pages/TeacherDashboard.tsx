import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Copy, Check, ArrowLeft, UserPlus, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import StudentProgressView from '@/components/StudentProgressView';

interface BulkResult {
  username: string;
  success: boolean;
  error?: string;
}

interface ClassData {
  id: string;
  name: string;
  join_code: string;
  created_at: string;
}

interface StudentData {
  id: string;
  username: string;
  student_user_id: string;
  created_at: string;
}

const TeacherDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [showNewClass, setShowNewClass] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPin, setNewPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [bulkResults, setBulkResults] = useState<BulkResult[] | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);

  const fetchClasses = useCallback(async () => {
    const { data } = await supabase
      .from('classes')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setClasses(data);
  }, []);

  const fetchStudents = useCallback(async (classId: string) => {
    const { data } = await supabase
      .from('class_students')
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });
    if (data) setStudents(data);
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    if (selectedClass) fetchStudents(selectedClass.id);
  }, [selectedClass, fetchStudents]);

  const handleCreateClass = async () => {
    if (!newClassName.trim() || !user) return;
    setLoading(true);
    const { error } = await supabase
      .from('classes')
      .insert({ name: newClassName.trim(), teacher_id: user.id });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Class created' });
      setNewClassName('');
      setShowNewClass(false);
      fetchClasses();
    }
    setLoading(false);
  };

  const handleAddStudent = async () => {
    if (!selectedClass || !newUsername.trim() || !newPin.trim()) return;
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const res = await supabase.functions.invoke('create-student', {
      body: { username: newUsername.trim(), pin: newPin, class_id: selectedClass.id },
    });
    if (res.error || res.data?.error) {
      toast({ title: 'Error', description: res.data?.error || res.error?.message, variant: 'destructive' });
    } else {
      toast({ title: 'Student created', description: `Username: ${res.data.username}` });
      setNewUsername('');
      setNewPin('');
      setShowAddStudent(false);
      fetchStudents(selectedClass.id);
    }
    setLoading(false);
  };

  const parseBulkText = (text: string): { username: string; pin: string }[] => {
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        // Support CSV (comma or tab separated): username,pin
        const parts = line.split(/[,\t]+/).map((p) => p.trim());
        if (parts.length >= 2) {
          return { username: parts[0], pin: parts[1] };
        }
        // Single value: auto-generate a 4-digit PIN
        return { username: parts[0], pin: String(Math.floor(1000 + Math.random() * 9000)) };
      });
  };

  const handleBulkCreate = async () => {
    if (!selectedClass || !bulkText.trim()) return;
    setBulkLoading(true);
    setBulkResults(null);
    const students = parseBulkText(bulkText);
    const res = await supabase.functions.invoke('bulk-create-students', {
      body: { students, class_id: selectedClass.id },
    });
    if (res.error) {
      toast({ title: 'Error', description: res.error.message, variant: 'destructive' });
    } else {
      setBulkResults(res.data.results);
      const { success, failed } = res.data.summary;
      toast({ title: 'Bulk import complete', description: `${success} created, ${failed} failed` });
      fetchStudents(selectedClass.id);
    }
    setBulkLoading(false);
  };

  const copyJoinCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedClass && (
              <Button variant="ghost" size="icon" onClick={() => setSelectedClass(null)}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <h1 className="font-bold text-lg">
              {selectedClass ? selectedClass.name : 'Teacher Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>Lessons</Button>
            <Button variant="ghost" size="sm" onClick={async () => { await signOut(); navigate('/auth'); }}>Sign Out</Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {!selectedClass ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Your Classes</h2>
                <p className="text-sm text-muted-foreground">Create classes and add students</p>
              </div>
              <Button onClick={() => setShowNewClass(true)}>
                <Plus className="w-4 h-4 mr-2" /> New Class
              </Button>
            </div>

            {classes.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No classes yet. Create your first class to get started.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {classes.map((cls) => (
                  <Card
                    key={cls.id}
                    className="cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => setSelectedClass(cls)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{cls.name}</CardTitle>
                      <CardDescription>
                        Created {new Date(cls.created_at).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Join code:</span>
                        <code className="font-mono bg-muted px-2 py-0.5 rounded text-xs">{cls.join_code}</code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => { e.stopPropagation(); copyJoinCode(cls.join_code); }}
                        >
                          {copiedCode === cls.join_code ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <span>Join code:</span>
                  <code className="font-mono bg-muted px-2 py-0.5 rounded text-xs">{selectedClass.join_code}</code>
                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => copyJoinCode(selectedClass.join_code)}>
                    {copiedCode === selectedClass.join_code ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
                <h2 className="text-xl font-semibold">Students</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => { setShowBulkUpload(true); setBulkResults(null); setBulkText(''); }}>
                  <Upload className="w-4 h-4 mr-2" /> Bulk Import
                </Button>
                <Button onClick={() => setShowAddStudent(true)}>
                  <UserPlus className="w-4 h-4 mr-2" /> Add Student
                </Button>
              </div>
            </div>

            <StudentProgressView
              classId={selectedClass.id}
              students={students}
              onStudentDeleted={() => fetchStudents(selectedClass.id)}
            />
          </motion.div>
        )}
      </main>

      {/* New Class Dialog */}
      <Dialog open={showNewClass} onOpenChange={setShowNewClass}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Class</DialogTitle>
            <DialogDescription>Give your class a name. A join code will be generated automatically.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="class-name">Class Name</Label>
            <Input
              id="class-name"
              placeholder="e.g. Year 9 ICT"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              maxLength={50}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewClass(false)}>Cancel</Button>
            <Button onClick={handleCreateClass} disabled={loading || !newClassName.trim()}>
              {loading ? 'Creating...' : 'Create Class'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Student Dialog */}
      <Dialog open={showAddStudent} onOpenChange={setShowAddStudent}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Student</DialogTitle>
            <DialogDescription>Create a student account with a username and PIN. Share these with the student so they can sign in.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="e.g. john.smith"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ''))}
                maxLength={30}
              />
              <p className="text-xs text-muted-foreground">Letters, numbers, dots, hyphens, underscores only</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pin">PIN</Label>
              <Input
                id="pin"
                placeholder="e.g. 1234"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground">4–6 digit PIN for the student to sign in with</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddStudent(false)}>Cancel</Button>
            <Button onClick={handleAddStudent} disabled={loading || newUsername.length < 3 || newPin.length < 4}>
              {loading ? 'Creating...' : 'Create Student'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Import Dialog */}
      <Dialog open={showBulkUpload} onOpenChange={setShowBulkUpload}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Bulk Import Students</DialogTitle>
            <DialogDescription>
              Enter one student per line. Format: <code className="bg-muted px-1 rounded text-xs">username, pin</code>. If you omit the PIN, one will be generated automatically.
            </DialogDescription>
          </DialogHeader>
          {!bulkResults ? (
            <>
              <div className="space-y-3">
                <Label htmlFor="bulk-input">Student List</Label>
                <Textarea
                  id="bulk-input"
                  placeholder={`john.smith, 1234\njane.doe, 5678\nalex.w`}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  rows={8}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  {parseBulkText(bulkText).length} student(s) detected · Max 50 per batch
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowBulkUpload(false)}>Cancel</Button>
                <Button onClick={handleBulkCreate} disabled={bulkLoading || parseBulkText(bulkText).length === 0}>
                  {bulkLoading ? 'Creating...' : `Import ${parseBulkText(bulkText).length} Students`}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {bulkResults.map((r, i) => (
                  <div key={i} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md ${r.success ? 'bg-primary/5' : 'bg-destructive/5'}`}>
                    {r.success ? (
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                    )}
                    <span className="font-mono">{r.username}</span>
                    {!r.success && <span className="text-destructive text-xs ml-auto">{r.error}</span>}
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowBulkUpload(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherDashboard;
