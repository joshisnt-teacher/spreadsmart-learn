import { useCallback, useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

interface ProgressState {
  completedLessonIds: string[];
  totalXp: number;
  loading: boolean;
}

export const useProgress = (moduleId: string) => {
  const { user } = useAuth();
  const [state, setState] = useState<ProgressState>({
    completedLessonIds: [],
    totalXp: 0,
    loading: true,
  });
  const stateRef = useRef(state);
  stateRef.current = state;

  // Load module progress
  useEffect(() => {
    if (!user) {
      setState({ completedLessonIds: [], totalXp: 0, loading: false });
      return;
    }

    let ignore = false;
    setState(prev => ({ ...prev, loading: true }));

    const load = async () => {
      const { data, error } = await supabase
        .from('module_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('module_id', moduleId)
        .maybeSingle();

      if (ignore) return;

      if (error) {
        toast({ title: 'Failed to load progress', description: 'Please refresh the page.', variant: 'destructive' });
        setState(prev => ({ ...prev, loading: false }));
        return;
      }

      setState({
        completedLessonIds: data?.completed_lesson_ids ?? [],
        totalXp: data?.total_xp ?? 0,
        loading: false,
      });
    };

    load();
    return () => { ignore = true; };
  }, [user, moduleId]);

  const markLessonComplete = useCallback(async (lessonId: string, xpEarned: number) => {
    if (!user) return;

    // Use ref to avoid stale closure
    const current = stateRef.current;
    const alreadyCompleted = current.completedLessonIds.includes(lessonId);
    const newCompleted = [...new Set([...current.completedLessonIds, lessonId])];
    const newXp = alreadyCompleted ? current.totalXp : current.totalXp + xpEarned;

    setState(prev => ({
      ...prev,
      completedLessonIds: newCompleted,
      totalXp: newXp,
    }));

    const { error } = await supabase
      .from('module_progress')
      .upsert({
        user_id: user.id,
        module_id: moduleId,
        completed_lesson_ids: newCompleted,
        total_xp: newXp,
      }, { onConflict: 'user_id,module_id' });

    if (error) {
      toast({ title: 'Failed to save progress', description: 'Your progress may not be saved. Please try again.', variant: 'destructive' });
    }
  }, [user, moduleId]);

  return { ...state, markLessonComplete };
};

/** Aggregated progress across all modules for the current user */
export const useAggregatedProgress = () => {
  const { user } = useAuth();
  const [totalXp, setTotalXp] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTotalXp(0);
      setTotalCompleted(0);
      setLoading(false);
      return;
    }

    const load = async () => {
      const { data, error } = await supabase
        .from('module_progress')
        .select('completed_lesson_ids, total_xp')
        .eq('user_id', user.id);

      if (error) {
        toast({ title: 'Failed to load stats', variant: 'destructive' });
        setLoading(false);
        return;
      }

      const xp = (data ?? []).reduce((sum, r) => sum + (r.total_xp ?? 0), 0);
      const completed = (data ?? []).reduce((sum, r) => sum + (r.completed_lesson_ids?.length ?? 0), 0);
      setTotalXp(xp);
      setTotalCompleted(completed);
      setLoading(false);
    };

    load();
  }, [user]);

  return { totalXp, totalCompleted, loading };
};

export const useLessonProgress = (lessonId: string) => {
  const { user } = useAuth();

  const saveProgress = useCallback(async (
    completedStepIds: string[],
    currentStepId: string,
    totalXp: number,
    attempts: Record<string, number>,
    completed: boolean,
  ) => {
    if (!user) return;

    const { error } = await supabase
      .from('lesson_progress')
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        completed_step_ids: completedStepIds,
        current_step_id: currentStepId,
        total_xp: totalXp,
        attempts: attempts as any,
        completed,
      }, { onConflict: 'user_id,lesson_id' });

    if (error) {
      toast({ title: 'Failed to save lesson progress', description: 'Your progress may not be saved.', variant: 'destructive' });
    }
  }, [user, lessonId]);

  const loadProgress = useCallback(async () => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .maybeSingle();

    if (error) {
      toast({ title: 'Failed to load lesson progress', variant: 'destructive' });
      return null;
    }

    return data;
  }, [user, lessonId]);

  return { saveProgress, loadProgress };
};
