import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { AlertTriangle, Clock, Target, TrendingDown } from 'lucide-react';
import { useModuleAnalytics } from '@/hooks/useModuleAnalytics';
import { allModules } from '@/data/module-registry';
import type { Module } from '@/types/lesson';

interface ModuleAnalyticsViewProps {
  classId?: string | null;
  customModules?: Module[];
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

const ModuleAnalyticsView: React.FC<ModuleAnalyticsViewProps> = ({ classId, customModules = [] }) => {
  const availableModules = useMemo(() => [...allModules, ...customModules], [customModules]);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(availableModules[0]?.id ?? null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  const selectedModule = availableModules.find((m) => m.id === selectedModuleId);
  const lessons = selectedModule?.lessons ?? [];

  // Build step title map for the selected module
  const stepTitleMap = useMemo(() => {
    const map: Record<string, { stepTitle: string; lessonTitle: string; lessonId: string }> = {};
    if (!selectedModule) return map;
    for (const lesson of selectedModule.lessons) {
      for (const step of lesson.steps) {
        map[step.id] = { stepTitle: step.title, lessonTitle: lesson.title, lessonId: lesson.id };
      }
    }
    return map;
  }, [selectedModule]);

  const { stepStats, totalStarts, totalCompletes, avgTimePerStep, avgAttemptsPerStep, loading } = useModuleAnalytics(
    selectedModuleId,
    classId ?? null,
    selectedLessonId,
    stepTitleMap,
  );

  // Most failed steps sorted by fail count
  const mostFailed = useMemo(() => [...stepStats].sort((a, b) => b.fails - a.fails).filter((s) => s.fails > 0), [stepStats]);

  // Drop-off funnel: steps in lesson order with start counts
  const funnelData = useMemo(() => {
    if (!selectedModule) return [];
    const targetLessons = selectedLessonId ? lessons.filter((l) => l.id === selectedLessonId) : lessons;
    const data: { name: string; starts: number; completes: number }[] = [];
    for (const lesson of targetLessons) {
      for (const step of lesson.steps) {
        const stat = stepStats.find((s) => s.stepId === step.id);
        data.push({
          name: step.title.length > 20 ? step.title.slice(0, 18) + '…' : step.title,
          starts: stat?.starts ?? 0,
          completes: stat?.completes ?? 0,
        });
      }
    }
    return data;
  }, [selectedModule, selectedLessonId, lessons, stepStats]);

  const dropOffRate = totalStarts > 0 ? Math.round(((totalStarts - totalCompletes) / totalStarts) * 100) : 0;

  if (availableModules.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No modules available to analyse.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <Select value={selectedModuleId ?? ''} onValueChange={(v) => { setSelectedModuleId(v); setSelectedLessonId(null); }}>
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Select module" />
          </SelectTrigger>
          <SelectContent>
            {availableModules.map((m) => (
              <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedLessonId ?? 'all'} onValueChange={(v) => setSelectedLessonId(v === 'all' ? null : v)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All lessons" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All lessons</SelectItem>
            {lessons.map((l) => (
              <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading analytics…</p>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <Target className="w-4 h-4" /> Starts → Completes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{totalStarts} → {totalCompletes}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4" /> Drop-off Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{dropOffRate}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Avg. Time / Step
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{avgTimePerStep > 0 ? formatTime(avgTimePerStep) : 'No data'}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Avg. Attempts / Step
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{avgAttemptsPerStep > 0 ? avgAttemptsPerStep : 'No data'}</p>
              </CardContent>
            </Card>
          </div>

          {/* Drop-off funnel chart */}
          {funnelData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Step Drop-off Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={funnelData} margin={{ top: 4, right: 8, left: 0, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="name" angle={-35} textAnchor="end" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                      <Tooltip />
                      <Bar dataKey="starts" name="Starts" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="completes" name="Completes" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Most Failed Steps table */}
          {mostFailed.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Most Failed Steps</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Step</TableHead>
                      <TableHead>Lesson</TableHead>
                      <TableHead className="text-right">Fail Count</TableHead>
                      <TableHead className="text-right">Stuck Signals</TableHead>
                      <TableHead className="text-right">Avg Attempts</TableHead>
                      <TableHead className="text-right">Avg Time</TableHead>
                      <TableHead className="text-right">Hint Usage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mostFailed.slice(0, 15).map((s) => (
                      <TableRow key={s.stepId}>
                        <TableCell className="font-medium">{s.stepTitle}</TableCell>
                        <TableCell className="text-muted-foreground">{s.lessonTitle}</TableCell>
                        <TableCell className="text-right text-destructive font-semibold">{s.fails}</TableCell>
                        <TableCell className="text-right">{s.stuckCount > 0 ? <span className="text-warning font-semibold">{s.stuckCount}</span> : 'None'}</TableCell>
                        <TableCell className="text-right">{s.avgAttempts || 'No data'}</TableCell>
                        <TableCell className="text-right">{s.avgTimeSeconds > 0 ? formatTime(s.avgTimeSeconds) : 'No data'}</TableCell>
                        <TableCell className="text-right">{s.hintUsagePercent}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {stepStats.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No analytics data yet. Data will appear once students start working on this module.
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default ModuleAnalyticsView;
