import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { transformDbModule, stepToConfig } from '@/lib/module-transform';
import type { Module, Step } from '@/types/lesson';

interface CustomModuleRow {
  id: string;
  teacher_id: string;
  title: string;
  description: string;
  estimated_minutes: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useTeacherModules() {
  const [modules, setModules] = useState<CustomModuleRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('custom_modules')
      .select('*')
      .order('updated_at', { ascending: false });
    setModules((data as CustomModuleRow[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const createModule = async (): Promise<string | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase
      .from('custom_modules')
      .insert({ teacher_id: user.id } as any)
      .select('id')
      .single();
    if (error || !data) return null;
    fetch();
    return (data as any).id;
  };

  const deleteModule = async (id: string) => {
    await supabase.from('custom_modules').delete().eq('id', id);
    fetch();
  };

  return { modules, loading, refetch: fetch, createModule, deleteModule };
}

export function useModuleBuilder(moduleId: string | undefined) {
  const [module, setModule] = useState<CustomModuleRow | null>(null);
  const [fullModule, setFullModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFull = useCallback(async () => {
    if (!moduleId) { setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from('custom_modules')
      .select('*, custom_lessons(*, custom_steps(*))')
      .eq('id', moduleId)
      .single();
    if (data) {
      setModule(data as any);
      setFullModule(transformDbModule(data as any));
    }
    setLoading(false);
  }, [moduleId]);

  useEffect(() => { fetchFull(); }, [fetchFull]);

  const updateModule = async (updates: Partial<Pick<CustomModuleRow, 'title' | 'description' | 'estimated_minutes' | 'status'>>) => {
    if (!moduleId) return;
    await supabase.from('custom_modules').update(updates as any).eq('id', moduleId);
    fetchFull();
  };

  const addLesson = async () => {
    if (!moduleId) return;
    const order = fullModule ? fullModule.lessons.length : 0;
    await supabase.from('custom_lessons').insert({ module_id: moduleId, order } as any);
    fetchFull();
  };

  const updateLesson = async (lessonId: string, updates: { title?: string; description?: string; order?: number }) => {
    await supabase.from('custom_lessons').update(updates as any).eq('id', lessonId);
    fetchFull();
  };

  const deleteLesson = async (lessonId: string) => {
    await supabase.from('custom_lessons').delete().eq('id', lessonId);
    fetchFull();
  };

  const addStep = async (lessonId: string, type: string = 'instruction') => {
    const lesson = fullModule?.lessons.find(l => l.id === lessonId);
    const order = lesson ? lesson.steps.length : 0;
    await supabase.from('custom_steps').insert({ lesson_id: lessonId, type, order } as any);
    fetchFull();
  };

  const updateStep = async (stepId: string, updates: { title?: string; instruction?: string; type?: string; why_it_matters?: string | null; config?: Record<string, unknown> }) => {
    await supabase.from('custom_steps').update(updates as any).eq('id', stepId);
    fetchFull();
  };

  const deleteStep = async (stepId: string) => {
    await supabase.from('custom_steps').delete().eq('id', stepId);
    fetchFull();
  };

  return {
    module,
    fullModule,
    loading,
    refetch: fetchFull,
    updateModule,
    addLesson,
    updateLesson,
    deleteLesson,
    addStep,
    updateStep,
    deleteStep,
  };
}

/** Fetch a single custom module by ID (for ModulePlayer) */
export async function fetchCustomModule(moduleId: string): Promise<Module | null> {
  const { data } = await supabase
    .from('custom_modules')
    .select('*, custom_lessons(*, custom_steps(*))')
    .eq('id', moduleId)
    .single();
  if (!data) return null;
  return transformDbModule(data as any);
}
