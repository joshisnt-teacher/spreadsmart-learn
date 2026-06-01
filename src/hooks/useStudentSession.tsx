import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface StudentSession {
  central_student_id: string;
  first_name: string;
  last_name: string;
  username: string;
  year_level: string | null;
}

export function useStudentSession() {
  const { user, loading } = useAuth();

  const metadata = user?.user_metadata;
  const isStudent = metadata?.role === 'student';

  const studentSession: StudentSession | null = isStudent && metadata?.central_student_id
    ? {
        central_student_id: metadata.central_student_id as string,
        first_name: (metadata.first_name as string) || '',
        last_name: (metadata.last_name as string) || '',
        username: (metadata.username as string) || '',
        year_level: (metadata.year_level as string | null) ?? null,
      }
    : null;

  const signOut = useCallback(() => {
    supabase.auth.signOut().finally(() => {
      window.location.href = 'https://student.edufied.com.au';
    });
  }, []);

  return {
    studentSession,
    isStudent,
    loading,
    signOut,
  };
}
