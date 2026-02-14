import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Assignment {
  id: string;
  teacher_id: string;
  class_id: string | null;
  student_user_id: string | null;
  module_id: string;
  lesson_id: string | null;
  step_id: string | null;
  live_date: string;
  due_date: string | null;
  created_at: string;
}

interface UseClassAssignmentsReturn {
  assignments: Assignment[];
  loading: boolean;
  refetch: () => void;
  createAssignment: (data: Omit<Assignment, 'id' | 'created_at' | 'teacher_id'>) => Promise<boolean>;
  deleteAssignment: (id: string) => Promise<boolean>;
}

interface UseStudentAssignmentsReturn {
  assignments: Assignment[];
  loading: boolean;
  hasAssignments: boolean;
  isLessonAssigned: (lessonId: string) => boolean;
  getDueDate: (lessonId: string) => string | null;
}

export function useClassAssignments(classId: string | null): UseClassAssignmentsReturn {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!classId) { setAssignments([]); return; }
    setLoading(true);
    const { data } = await supabase
      .from('assignments')
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });
    setAssignments((data as Assignment[]) ?? []);
    setLoading(false);
  }, [classId]);

  useEffect(() => { fetch(); }, [fetch]);

  const createAssignment = async (input: Omit<Assignment, 'id' | 'created_at' | 'teacher_id'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { error } = await supabase.from('assignments').insert({
      teacher_id: user.id,
      class_id: input.class_id,
      student_user_id: input.student_user_id,
      module_id: input.module_id,
      lesson_id: input.lesson_id,
      step_id: input.step_id,
      live_date: input.live_date,
      due_date: input.due_date,
    });
    if (!error) { fetch(); return true; }
    return false;
  };

  const deleteAssignment = async (id: string) => {
    const { error } = await supabase.from('assignments').delete().eq('id', id);
    if (!error) { fetch(); return true; }
    return false;
  };

  return { assignments, loading, refetch: fetch, createAssignment, deleteAssignment };
}

export function useStudentAssignments(moduleId: string): UseStudentAssignmentsReturn {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      const { data } = await supabase
        .from('assignments')
        .select('*')
        .eq('module_id', moduleId);
      setAssignments((data as Assignment[]) ?? []);
      setLoading(false);
    };
    fetchAssignments();
  }, [moduleId]);

  const hasAssignments = assignments.length > 0;

  const isLessonAssigned = (lessonId: string) => {
    if (!hasAssignments) return true; // no assignments = all visible
    return assignments.some(
      (a) => a.lesson_id === null || a.lesson_id === lessonId
    );
  };

  const getDueDate = (lessonId: string) => {
    const match = assignments.find(
      (a) => a.lesson_id === lessonId || a.lesson_id === null
    );
    return match?.due_date ?? null;
  };

  return { assignments, loading, hasAssignments, isLessonAssigned, getDueDate };
}

/** All assignments for the current student across all modules */
export function useAllStudentAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const { data } = await supabase
        .from('assignments')
        .select('*');
      setAssignments((data as Assignment[]) ?? []);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const assignedModuleIds = [...new Set(assignments.map(a => a.module_id))];

  const upcomingDueCount = assignments.filter(
    a => a.due_date && new Date(a.due_date) > new Date()
  ).length;

  return { assignments, loading, assignedModuleIds, upcomingDueCount };
}
