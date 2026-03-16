import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Eye, BookOpen, FileText, HelpCircle, Settings, Grid3X3, Pencil, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useModuleBuilder } from '@/hooks/useCustomModules';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Step, QuizQuestion } from '@/types/lesson';
import type { TaskStepConfig } from '@/components/builder/TaskStepEditor';
import AiAssistantModal, { type AiAction } from '@/components/builder/AiAssistantModal';
import ModuleSettingsPanel from '@/components/builder/ModuleSettingsPanel';
import StepEditor from '@/components/builder/StepEditor';

const STEP_TYPES = [
  { value: 'instruction', label: 'Instruction', icon: FileText },
  { value: 'task', label: 'Spreadsheet Task', icon: Grid3X3 },
  { value: 'quiz', label: 'Quiz', icon: HelpCircle },
] as const;

const ModuleBuilder: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { user, role, loading: authLoading } = useAuth();
  const builder = useModuleBuilder(moduleId);

  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');
  const [moduleMinutes, setModuleMinutes] = useState(15);
  const [moduleBannerUrl, setModuleBannerUrl] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState('');

  // Step editing state
  const [stepTitle, setStepTitle] = useState('');
  const [stepInstruction, setStepInstruction] = useState('');
  const [stepType, setStepType] = useState('instruction');
  const [stepWhyItMatters, setStepWhyItMatters] = useState('');
  const [quizType, setQuizType] = useState<'multiple-choice' | 'short-answer'>('multiple-choice');
  const [quizOptions, setQuizOptions] = useState<string[]>(['', '', '', '']);
  const [quizCorrectAnswer, setQuizCorrectAnswer] = useState('');
  const [quizExplanation, setQuizExplanation] = useState('');
  const [quizAcceptable, setQuizAcceptable] = useState('');
  const [taskConfig, setTaskConfig] = useState<TaskStepConfig | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || role === 'student')) navigate(user ? '/dashboard' : '/auth');
  }, [authLoading, user, role, navigate]);

  useEffect(() => {
    if (builder.module) {
      setModuleTitle(builder.module.title);
      setModuleDescription(builder.module.description);
      setModuleMinutes(builder.module.estimated_minutes);
      setModuleBannerUrl(builder.module.banner_url ?? null);
    }
  }, [builder.module?.id, builder.module?.updated_at]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentLesson = builder.fullModule?.lessons.find(l => l.id === selectedLessonId);
  const currentStep = currentLesson?.steps.find(s => s.id === selectedStepId);

  useEffect(() => { if (currentLesson) setLessonTitle(currentLesson.title); }, [currentLesson?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (currentStep) {
      setStepTitle(currentStep.title);
      setStepInstruction(currentStep.instruction);
      setStepType(currentStep.type ?? 'instruction');
      setStepWhyItMatters(currentStep.whyItMatters ?? '');
      if (currentStep.quiz) {
        setQuizType(currentStep.quiz.type);
        setQuizOptions(currentStep.quiz.options ?? ['', '', '', '']);
        setQuizCorrectAnswer(currentStep.quiz.correctAnswer);
        setQuizExplanation(currentStep.quiz.explanation ?? '');
        setQuizAcceptable((currentStep.quiz.acceptableAnswers ?? []).join(', '));
      } else {
        setQuizType('multiple-choice'); setQuizOptions(['', '', '', '']); setQuizCorrectAnswer(''); setQuizExplanation(''); setQuizAcceptable('');
      }
      if (currentStep.initialSheetState && currentStep.task) {
        setTaskConfig({ initialSheetState: currentStep.initialSheetState, task: currentStep.task });
      } else { setTaskConfig(null); }
    }
  }, [currentStep?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSaveStep = async () => {
    if (!selectedStepId) return;
    const config: Record<string, unknown> = {};
    if (stepType === 'quiz') {
      const quiz: QuizQuestion = { type: quizType, correctAnswer: quizCorrectAnswer, explanation: quizExplanation || undefined, acceptableAnswers: quizAcceptable ? quizAcceptable.split(',').map(s => s.trim()).filter(Boolean) : undefined };
      if (quizType === 'multiple-choice') quiz.options = quizOptions.filter(o => o.trim());
      config.quiz = quiz;
    }
    if (stepType === 'task' && taskConfig) { config.initialSheetState = taskConfig.initialSheetState; config.task = taskConfig.task; }
    await builder.updateStep(selectedStepId, { title: stepTitle, instruction: stepInstruction, type: stepType, why_it_matters: stepWhyItMatters || null, config });
    toast({ title: 'Step saved' });
  };

  const handlePublishToggle = async () => {
    if (!builder.module) return;
    const newStatus = builder.module.status === 'published' ? 'draft' : 'published';
    await builder.updateModule({ status: newStatus as any });
    toast({ title: newStatus === 'published' ? 'Module published!' : 'Module unpublished' });
  };

  const handleAiResult = async (action: AiAction, result: any) => {
    if (action === 'generate_module') {
      await builder.updateModule({ title: result.title, description: result.description, estimated_minutes: result.estimatedMinutes });
      setModuleTitle(result.title); setModuleDescription(result.description); setModuleMinutes(result.estimatedMinutes);
      for (let i = 0; i < (result.lessons ?? []).length; i++) {
        const genLesson = result.lessons[i];
        const { data: lessonRow, error: lessonErr } = await supabase.from('custom_lessons').insert({ module_id: moduleId!, title: genLesson.title || 'Untitled Lesson', description: genLesson.description || '', order: i } as any).select('id').single();
        if (lessonErr || !lessonRow) continue;
        const lessonId = (lessonRow as any).id;
        for (let j = 0; j < (genLesson.steps ?? []).length; j++) {
          const genStep = genLesson.steps[j];
          const cfg: Record<string, unknown> = {};
          if (genStep.quiz) cfg.quiz = genStep.quiz;
          if (genStep.initialSheetState) cfg.initialSheetState = genStep.initialSheetState;
          if (genStep.task) cfg.task = genStep.task;
          await supabase.from('custom_steps').insert({ lesson_id: lessonId, title: genStep.title || 'Untitled Step', instruction: genStep.instruction || '', type: genStep.type || 'instruction', why_it_matters: genStep.whyItMatters || null, order: j, config: cfg } as any);
        }
      }
      await builder.refetch();
      toast({ title: 'Module generated!', description: `Created ${result.lessons?.length ?? 0} lessons.` });
    } else if (action === 'generate_step') {
      if (!selectedLessonId) { toast({ title: 'Select a lesson first', variant: 'destructive' }); return; }
      const currentLessonSteps = builder.fullModule?.lessons.find(l => l.id === selectedLessonId)?.steps ?? [];
      const cfg: Record<string, unknown> = {};
      if (result.quiz) cfg.quiz = result.quiz;
      if (result.initialSheetState) cfg.initialSheetState = result.initialSheetState;
      if (result.task) cfg.task = result.task;
      const { data: stepRow } = await supabase.from('custom_steps').insert({ lesson_id: selectedLessonId, title: result.title || 'Untitled Step', instruction: result.instruction || '', type: result.type || 'instruction', why_it_matters: result.whyItMatters || null, order: currentLessonSteps.length, config: cfg } as any).select('id').single();
      await builder.refetch();
      if (stepRow) setSelectedStepId((stepRow as any).id);
    } else if (action === 'improve_content') {
      if (result.title) setStepTitle(result.title);
      if (result.instruction) setStepInstruction(result.instruction);
      if (result.whyItMatters) setStepWhyItMatters(result.whyItMatters);
      toast({ title: 'Content improved!', description: 'Review the changes and click Save Step when ready.' });
    }
  };

  if (builder.loading || authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  }
  if (!builder.module || !builder.fullModule) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Module not found</p></div>;
  }

  const mod = builder.fullModule;
  const isPublished = builder.module.status === 'published';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            {isEditingTitle ? (
              <Input value={moduleTitle} onChange={e => setModuleTitle(e.target.value)}
                onBlur={() => { setIsEditingTitle(false); builder.updateModule({ title: moduleTitle }); }}
                onKeyDown={e => { if (e.key === 'Enter') { setIsEditingTitle(false); builder.updateModule({ title: moduleTitle }); } }}
                autoFocus className="font-bold text-lg h-8 w-64" />
            ) : (
              <h1 className="font-bold text-lg leading-tight cursor-pointer group flex items-center gap-1.5 hover:text-primary transition-colors" onClick={() => setIsEditingTitle(true)}>
                {moduleTitle || 'Untitled Module'}
                <Pencil className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
              </h1>
            )}
            <Badge variant={isPublished ? 'default' : 'secondary'} className="text-xs mt-0.5">{isPublished ? 'Published' : 'Draft'}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-primary border-primary/30 hover:bg-primary/10" onClick={() => setAiModalOpen(true)}>
            <Wand2 className="w-4 h-4 mr-1.5" /> AI Assist
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="w-4 h-4 mr-1.5" /> Settings
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate(`/module/${moduleId}`)}>
            <Eye className="w-4 h-4 mr-1.5" /> Preview
          </Button>
          <Button size="sm" variant={isPublished ? 'secondary' : 'default'} onClick={handlePublishToggle}>
            {isPublished ? 'Unpublish' : 'Publish'}
          </Button>
        </div>
      </header>

      {showSettings && (
        <ModuleSettingsPanel
          moduleId={moduleId!}
          moduleTitle={moduleTitle} setModuleTitle={setModuleTitle}
          moduleDescription={moduleDescription} setModuleDescription={setModuleDescription}
          moduleMinutes={moduleMinutes} setModuleMinutes={setModuleMinutes}
          moduleBannerUrl={moduleBannerUrl} setModuleBannerUrl={setModuleBannerUrl}
          onSave={(updates) => builder.updateModule(updates)}
        />
      )}

      {/* Main editor area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Lesson sidebar */}
        <div className="w-64 border-r border-border bg-card flex flex-col shrink-0">
          <div className="p-3 flex items-center justify-between border-b border-border">
            <span className="text-sm font-semibold text-muted-foreground">Lessons</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => builder.addLesson()}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {mod.lessons.map((lesson, idx) => (
              <div key={lesson.id}
                className={`rounded-lg p-2.5 cursor-pointer transition-colors text-sm ${selectedLessonId === lesson.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted'}`}
                onClick={() => { setSelectedLessonId(lesson.id); setSelectedStepId(null); }}>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs font-mono w-5 shrink-0">{idx + 1}.</span>
                  <span className="truncate font-medium">{lesson.title}</span>
                </div>
                <span className="text-xs text-muted-foreground ml-7">{lesson.steps.length} steps</span>
              </div>
            ))}
            {mod.lessons.length === 0 && <p className="text-xs text-muted-foreground text-center py-6">No lessons yet. Click + to add one.</p>}
          </div>
        </div>

        {/* Step list + editor */}
        <div className="flex-1 flex overflow-hidden">
          {selectedLessonId && currentLesson ? (
            <>
              {/* Steps column */}
              <div className="w-56 border-r border-border bg-card/50 flex flex-col shrink-0">
                <div className="p-3 border-b border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-muted-foreground">Steps</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => builder.addStep(selectedLessonId)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input value={lessonTitle} onChange={e => setLessonTitle(e.target.value)}
                    onBlur={() => builder.updateLesson(selectedLessonId, { title: lessonTitle })}
                    className="text-xs h-8" placeholder="Lesson title" />
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {currentLesson.steps.map((step) => {
                    const TypeIcon = STEP_TYPES.find(t => t.value === step.type)?.icon ?? FileText;
                    return (
                      <div key={step.id}
                        className={`rounded-md p-2 cursor-pointer transition-colors text-xs flex items-center gap-2 ${selectedStepId === step.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted'}`}
                        onClick={() => setSelectedStepId(step.id)}>
                        <TypeIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">{step.title}</span>
                      </div>
                    );
                  })}
                  {currentLesson.steps.length === 0 && <p className="text-xs text-muted-foreground text-center py-6">No steps yet.</p>}
                </div>
                <div className="p-2 border-t border-border">
                  <Button variant="ghost" size="sm" className="w-full text-destructive hover:text-destructive text-xs"
                    onClick={async () => { await builder.deleteLesson(selectedLessonId); setSelectedLessonId(null); setSelectedStepId(null); }}>
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete Lesson
                  </Button>
                </div>
              </div>

              {/* Step editor */}
              <div className="flex-1 overflow-y-auto p-6">
                {selectedStepId && currentStep ? (
                  <StepEditor
                    stepTitle={stepTitle} setStepTitle={setStepTitle}
                    stepInstruction={stepInstruction} setStepInstruction={setStepInstruction}
                    stepType={stepType} setStepType={setStepType}
                    stepWhyItMatters={stepWhyItMatters} setStepWhyItMatters={setStepWhyItMatters}
                    quizType={quizType} setQuizType={setQuizType}
                    quizOptions={quizOptions} setQuizOptions={setQuizOptions}
                    quizCorrectAnswer={quizCorrectAnswer} setQuizCorrectAnswer={setQuizCorrectAnswer}
                    quizExplanation={quizExplanation} setQuizExplanation={setQuizExplanation}
                    quizAcceptable={quizAcceptable} setQuizAcceptable={setQuizAcceptable}
                    taskConfig={taskConfig} setTaskConfig={setTaskConfig}
                    onSave={handleSaveStep}
                    onDelete={async () => { await builder.deleteStep(selectedStepId); setSelectedStepId(null); }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <BookOpen className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                      <p className="text-muted-foreground">Select a step to edit, or add a new one.</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="font-semibold mb-1">Select a Lesson</h3>
                <p className="text-sm text-muted-foreground">Choose a lesson from the sidebar, or create a new one to get started.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <AiAssistantModal open={aiModalOpen} onOpenChange={setAiModalOpen} onResult={handleAiResult}
        context={{ moduleTitle, moduleDescription, currentLessonTitle: currentLesson?.title, currentStepTitle: currentStep?.title, currentStepInstruction: currentStep?.instruction }} />
    </div>
  );
};

export default ModuleBuilder;
