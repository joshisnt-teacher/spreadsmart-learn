import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

import ClassListView from '@/components/teacher/ClassListView';
import ClassDetailView from '@/components/teacher/ClassDetailView';
import TeacherDialogs from '@/components/teacher/TeacherDialogs';

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

interface BulkResult {
  username: string;
  success: boolean;
  error?: string;
}

const TeacherDashboard: React.FC = () => {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && (!user || role === 'student')) {
      navigate(user ? '/' : '/auth');
    }
  }, [authLoading, user, role, navigate]);

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
    const { data } = await supabase.from('classes').select('*').order('created_at', { ascending: false });
    if (data) setClasses(data);
  }, []);

  const fetchStudents = useCallback(async (classId: string) => {
    const { data } = await supabase.from('class_students').select('*').eq('class_id', classId).order('created_at', { ascending: false });
    if (data) setStudents(data);
  }, []);

  useEffect(() => { fetchClasses(); }, [fetchClasses]);
  useEffect(() => { if (selectedClass) fetchStudents(selectedClass.id); }, [selectedClass, fetchStudents]);

  const handleCreateClass = async () => {
    if (!newClassName.trim() || !user) return;
    setLoading(true);
    const { error } = await supabase.from('classes').insert({ name: newClassName.trim(), teacher_id: user.id });
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); }
    else { toast({ title: 'Class created' }); setNewClassName(''); setShowNewClass(false); fetchClasses(); }
    setLoading(false);
  };

  const handleAddStudent = async () => {
    if (!selectedClass || !newUsername.trim() || !newPin.trim()) return;
    setLoading(true);
    const res = await supabase.functions.invoke('create-student', {
      body: { username: newUsername.trim(), pin: newPin, class_id: selectedClass.id },
    });
    if (res.error || res.data?.error) {
      toast({ title: 'Error', description: res.data?.error || res.error?.message, variant: 'destructive' });
    } else {
      toast({ title: 'Student created', description: `Username: ${res.data.username}` });
      setNewUsername(''); setNewPin(''); setShowAddStudent(false); fetchStudents(selectedClass.id);
    }
    setLoading(false);
  };

  const parseBulkText = (text: string): { username: string; pin: string }[] => {
    return text.split('\n').map(l => l.trim()).filter(l => l.length > 0).map(line => {
      const parts = line.split(/[,\t]+/).map(p => p.trim());
      return parts.length >= 2
        ? { username: parts[0], pin: parts[1] }
        : { username: parts[0], pin: String(Math.floor(1000 + Math.random() * 9000)) };
    });
  };

  const handleBulkCreate = async () => {
    if (!selectedClass || !bulkText.trim()) return;
    setBulkLoading(true); setBulkResults(null);
    const studentsList = parseBulkText(bulkText);
    const res = await supabase.functions.invoke('bulk-create-students', {
      body: { students: studentsList, class_id: selectedClass.id },
    });
    if (res.error) { toast({ title: 'Error', description: res.error.message, variant: 'destructive' }); }
    else {
      setBulkResults(res.data.results);
      toast({ title: 'Bulk import complete', description: `${res.data.summary.success} created, ${res.data.summary.failed} failed` });
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
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/settings')}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {!selectedClass ? (
          <ClassListView
            classes={classes}
            copiedCode={copiedCode}
            onSelectClass={setSelectedClass}
            onNewClass={() => setShowNewClass(true)}
            onCopyCode={copyJoinCode}
          />
        ) : (
          <ClassDetailView
            selectedClass={selectedClass}
            students={students}
            copiedCode={copiedCode}
            onCopyCode={copyJoinCode}
            onAddStudent={() => setShowAddStudent(true)}
            onBulkImport={() => { setShowBulkUpload(true); setBulkResults(null); setBulkText(''); }}
            onStudentDeleted={() => fetchStudents(selectedClass.id)}
          />
        )}
      </main>

      <TeacherDialogs
        showNewClass={showNewClass} setShowNewClass={setShowNewClass}
        newClassName={newClassName} setNewClassName={setNewClassName}
        onCreateClass={handleCreateClass}
        showAddStudent={showAddStudent} setShowAddStudent={setShowAddStudent}
        newUsername={newUsername} setNewUsername={setNewUsername}
        newPin={newPin} setNewPin={setNewPin}
        onAddStudent={handleAddStudent}
        showBulkUpload={showBulkUpload} setShowBulkUpload={setShowBulkUpload}
        bulkText={bulkText} setBulkText={setBulkText}
        bulkResults={bulkResults} bulkLoading={bulkLoading}
        onBulkCreate={handleBulkCreate}
        parseBulkCount={parseBulkText(bulkText).length}
        loading={loading}
      />
    </div>
  );
};

export default TeacherDashboard;
