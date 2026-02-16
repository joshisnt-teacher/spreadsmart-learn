import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StepEvent {
  step_id: string;
  lesson_id: string;
  event_type: string;
  metadata: Record<string, unknown>;
}

export interface StepStats {
  stepId: string;
  lessonId: string;
  stepTitle: string;
  lessonTitle: string;
  starts: number;
  completes: number;
  fails: number;
  hintUses: number;
  avgTimeSeconds: number;
  avgAttempts: number;
  hintUsagePercent: number;
}

export interface ModuleAnalyticsData {
  stepStats: StepStats[];
  totalStarts: number;
  totalCompletes: number;
  avgTimePerStep: number;
  avgAttemptsPerStep: number;
  loading: boolean;
}

export function useModuleAnalytics(
  moduleId: string | null,
  classId: string | null,
  lessonFilter: string | null,
  stepTitleMap: Record<string, { stepTitle: string; lessonTitle: string; lessonId: string }>,
): ModuleAnalyticsData {
  const [stepStats, setStepStats] = useState<StepStats[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!moduleId) return;
    setLoading(true);

    // Get student user IDs for this class
    let studentIds: string[] | null = null;
    if (classId) {
      const { data: cs } = await supabase
        .from('class_students')
        .select('student_user_id')
        .eq('class_id', classId);
      studentIds = cs?.map((r) => r.student_user_id) ?? [];
      if (studentIds.length === 0) {
        setStepStats([]);
        setLoading(false);
        return;
      }
    }

    let query = supabase
      .from('step_events')
      .select('step_id, lesson_id, event_type, metadata')
      .eq('module_id', moduleId);

    if (lessonFilter) {
      query = query.eq('lesson_id', lessonFilter);
    }
    if (studentIds) {
      query = query.in('user_id', studentIds);
    }

    const { data, error } = await query;
    if (error || !data) {
      setStepStats([]);
      setLoading(false);
      return;
    }

    // Aggregate by step_id
    const map = new Map<string, { starts: number; completes: number; fails: number; hints: number; totalTime: number; timeCount: number; totalAttempts: number; attemptCount: number; uniqueUsers: Set<string>; lessonId: string }>();

    for (const evt of data as StepEvent[]) {
      if (!map.has(evt.step_id)) {
        map.set(evt.step_id, { starts: 0, completes: 0, fails: 0, hints: 0, totalTime: 0, timeCount: 0, totalAttempts: 0, attemptCount: 0, uniqueUsers: new Set(), lessonId: evt.lesson_id });
      }
      const s = map.get(evt.step_id)!;
      switch (evt.event_type) {
        case 'step_start':
          s.starts++;
          break;
        case 'step_complete':
          s.completes++;
          if (typeof evt.metadata?.time_spent_seconds === 'number') {
            s.totalTime += evt.metadata.time_spent_seconds as number;
            s.timeCount++;
          }
          if (typeof evt.metadata?.attempt_count === 'number') {
            s.totalAttempts += evt.metadata.attempt_count as number;
            s.attemptCount++;
          }
          break;
        case 'check_fail':
          s.fails++;
          break;
        case 'hint_used':
          s.hints++;
          break;
      }
    }

    const stats: StepStats[] = Array.from(map.entries()).map(([stepId, s]) => {
      const titleInfo = stepTitleMap[stepId] || { stepTitle: stepId, lessonTitle: 'Unknown', lessonId: s.lessonId };
      return {
        stepId,
        lessonId: titleInfo.lessonId,
        stepTitle: titleInfo.stepTitle,
        lessonTitle: titleInfo.lessonTitle,
        starts: s.starts,
        completes: s.completes,
        fails: s.fails,
        hintUses: s.hints,
        avgTimeSeconds: s.timeCount > 0 ? Math.round(s.totalTime / s.timeCount) : 0,
        avgAttempts: s.attemptCount > 0 ? Math.round((s.totalAttempts / s.attemptCount) * 10) / 10 : 0,
        hintUsagePercent: s.starts > 0 ? Math.round((s.hints / s.starts) * 100) : 0,
      };
    });

    setStepStats(stats);
    setLoading(false);
  }, [moduleId, classId, lessonFilter, stepTitleMap]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalStarts = stepStats.reduce((a, s) => a + s.starts, 0);
  const totalCompletes = stepStats.reduce((a, s) => a + s.completes, 0);
  const stepsWithTime = stepStats.filter((s) => s.avgTimeSeconds > 0);
  const avgTimePerStep = stepsWithTime.length > 0 ? Math.round(stepsWithTime.reduce((a, s) => a + s.avgTimeSeconds, 0) / stepsWithTime.length) : 0;
  const stepsWithAttempts = stepStats.filter((s) => s.avgAttempts > 0);
  const avgAttemptsPerStep = stepsWithAttempts.length > 0 ? Math.round((stepsWithAttempts.reduce((a, s) => a + s.avgAttempts, 0) / stepsWithAttempts.length) * 10) / 10 : 0;

  return { stepStats, totalStarts, totalCompletes, avgTimePerStep, avgAttemptsPerStep, loading };
}
