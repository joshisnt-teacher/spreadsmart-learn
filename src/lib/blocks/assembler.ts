import { supabase } from '@/integrations/supabase/client';
import type { Step } from '@/types/module-v2';

export interface ModuleMeta {
  title: string;
  description: string;
  estimatedMinutes: number;
  bannerUrl?: string;
}

export interface LessonDef {
  title: string;
  description: string;
  steps: Step[];
}

/**
 * Publishes a complete module to Supabase.
 * Inserts custom_modules → custom_lessons → custom_steps in order.
 * Requires an authenticated teacher session.
 */
export async function publishModule(
  meta: ModuleMeta,
  lessonDefs: LessonDef[],
): Promise<{ moduleId: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated — publishModule requires a signed-in teacher');

  const { data: mod, error: modError } = await supabase
    .from('custom_modules')
    .insert({
      title: meta.title,
      description: meta.description,
      estimated_minutes: meta.estimatedMinutes,
      banner_url: meta.bannerUrl ?? null,
      teacher_id: user.id,
      status: 'published',
    })
    .select('id')
    .single();

  if (modError || !mod) throw new Error(modError?.message ?? 'Failed to create module');

  for (let li = 0; li < lessonDefs.length; li++) {
    const lessonDef = lessonDefs[li];

    const { data: lesson, error: lessonError } = await supabase
      .from('custom_lessons')
      .insert({
        module_id: mod.id,
        title: lessonDef.title,
        description: lessonDef.description,
        order: li + 1,
      })
      .select('id')
      .single();

    if (lessonError || !lesson) throw new Error(lessonError?.message ?? `Failed to create lesson ${li + 1}`);

    const stepRows = lessonDef.steps.map((step, si) => ({
      lesson_id: lesson.id,
      title: step.title,
      layout: step.layout ?? 'instruction-full',
      order: si + 1,
      type: 'v2',
      instruction: '',
      config: { blocks: step.blocks, scoring: step.scoring ?? null },
    }));

    const { error: stepError } = await supabase.from('custom_steps').insert(stepRows);
    if (stepError) throw new Error(stepError.message);
  }

  return { moduleId: mod.id };
}
