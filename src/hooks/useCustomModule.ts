import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Module, Lesson, Step, StepBlock, StepLayout, StepScoringConfig } from '@/types/module-v2';

export function useCustomModule(moduleId: string | undefined) {
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!moduleId) { setLoading(false); return; }

    let cancelled = false;
    setLoading(true);
    setError(null);

    async function load() {
      const { data: mod } = await supabase
        .from('custom_modules')
        .select('*')
        .eq('id', moduleId)
        .maybeSingle();

      if (!mod) {
        if (!cancelled) setLoading(false);
        return;
      }

      const { data: lessonRows, error: lessonErr } = await supabase
        .from('custom_lessons')
        .select('*')
        .eq('module_id', moduleId)
        .order('order');

      if (lessonErr || !lessonRows) {
        if (!cancelled) { setError(lessonErr?.message ?? 'Failed to load lessons'); setLoading(false); }
        return;
      }

      const lessonIds = lessonRows.map(l => l.id);
      const { data: stepRows, error: stepErr } = lessonIds.length
        ? await supabase.from('custom_steps').select('*').in('lesson_id', lessonIds).order('order')
        : { data: [], error: null };

      if (stepErr) {
        if (!cancelled) { setError(stepErr.message); setLoading(false); }
        return;
      }

      const stepsByLesson = new Map<string, Step[]>();
      for (const row of stepRows ?? []) {
        if (row.type !== 'v2') continue;
        const config = (row.config as { blocks?: StepBlock[]; scoring?: StepScoringConfig }) ?? {};
        const step: Step = {
          id: row.id,
          order: row.order,
          title: row.title,
          layout: (row.layout as StepLayout) || 'instruction-full',
          blocks: config.blocks ?? [],
          scoring: config.scoring,
        };
        if (!stepsByLesson.has(row.lesson_id)) stepsByLesson.set(row.lesson_id, []);
        stepsByLesson.get(row.lesson_id)!.push(step);
      }

      const lessons: Lesson[] = lessonRows.map(l => ({
        id: l.id,
        order: l.order,
        title: l.title,
        description: l.description,
        steps: stepsByLesson.get(l.id) ?? [],
      }));

      const result: Module = {
        id: mod.id,
        title: mod.title,
        description: mod.description,
        estimatedMinutes: mod.estimated_minutes,
        bannerUrl: mod.banner_url ?? undefined,
        lessons,
        competencies: [],
      };

      if (!cancelled) { setModule(result); setLoading(false); }
    }

    load();
    return () => { cancelled = true; };
  }, [moduleId]);

  return { module, loading, error };
}
