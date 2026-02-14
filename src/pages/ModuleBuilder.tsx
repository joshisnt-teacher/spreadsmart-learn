import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, GripVertical, Save, Eye, BookOpen, FileText, HelpCircle, ChevronRight, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useModuleBuilder } from '@/hooks/useCustomModules';
import { stepToConfig } from '@/lib/module-transform';
import { toast } from '@/hooks/use-toast';
import type { Step, QuizQuestion } from '@/types/lesson';

const STEP_TYPES = [
  { value: 'instruction', label: 'Instruction', icon: FileText },
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

  // Local editing state for step
  const [stepTitle, setStepTitle] = useState('');
  const [stepInstruction, setStepInstruction] = useState('');
  const [stepType, setStepType] = useState('instruction');
  const [stepWhyItMatters, setStepWhyItMatters] = useState('');
  // Quiz-specific
  const [quizType, setQuizType] = useState<'multiple-choice' | 'short-answer'>('multiple-choice');
  const [quizOptions, setQuizOptions] = useState<string[]>(['', '', '', '']);
  const [quizCorrectAnswer, setQuizCorrectAnswer] = useState('');
  const [quizExplanation, setQuizExplanation] = useState('');
  const [quizAcceptable, setQuizAcceptable] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || role === 'student')) {
      navigate(user ? '/dashboard' : '/auth');
    }
  }, [authLoading, user, role, navigate]);

  // When we select a step, populate local editing state
  const currentLesson = builder.fullModule?.lessons.find(l => l.id === selectedLessonId);
  const currentStep = currentLesson?.steps.find(s => s.id === selectedStepId);

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
        setQuizType('multiple-choice');
        setQuizOptions(['', '', '', '']);
        setQuizCorrectAnswer('');
        setQuizExplanation('');
        setQuizAcceptable('');
      }
    }
  }, [currentStep?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSaveStep = async () => {
    if (!selectedStepId) return;
    const config: Record<string, unknown> = {};
    if (stepType === 'quiz') {
      const quiz: QuizQuestion = {
        type: quizType,
        correctAnswer: quizCorrectAnswer,
        explanation: quizExplanation || undefined,
        acceptableAnswers: quizAcceptable ? quizAcceptable.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      };
      if (quizType === 'multiple-choice') {
        quiz.options = quizOptions.filter(o => o.trim());
      }
      config.quiz = quiz;
    }
    await builder.updateStep(selectedStepId, {
      title: stepTitle,
      instruction: stepInstruction,
      type: stepType,
      why_it_matters: stepWhyItMatters || null,
      config,
    });
    toast({ title: 'Step saved' });
  };

  const handlePublishToggle = async () => {
    if (!builder.module) return;
    const newStatus = builder.module.status === 'published' ? 'draft' : 'published';
    await builder.updateModule({ status: newStatus as any });
    toast({ title: newStatus === 'published' ? 'Module published!' : 'Module unpublished' });
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
            <h1 className="font-bold text-lg leading-tight">{mod.title || 'Untitled Module'}</h1>
            <Badge variant={isPublished ? 'default' : 'secondary'} className="text-xs mt-0.5">
              {isPublished ? 'Published' : 'Draft'}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
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

      {/* Settings panel */}
      {showSettings && (
        <div className="border-b border-border bg-muted/30 px-4 py-4">
          <div className="max-w-2xl mx-auto grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Module Title</Label>
              <Input
                value={builder.module.title}
                onChange={e => builder.updateModule({ title: e.target.value })}
                placeholder="Module title"
              />
            </div>
            <div className="space-y-2">
              <Label>Estimated Minutes</Label>
              <Input
                type="number"
                value={builder.module.estimated_minutes}
                onChange={e => builder.updateModule({ estimated_minutes: parseInt(e.target.value) || 15 })}
                min={1}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={builder.module.description}
                onChange={e => builder.updateModule({ description: e.target.value })}
                placeholder="What will students learn?"
                rows={2}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main editor area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Lesson sidebar */}
        <div className="w-64 border-r border-border bg-card flex flex-col shrink-0">
          <div className="p-3 flex items-center justify-between border-b border-border">
            <span className="text-sm font-semibold text-muted-foreground">Lessons</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={async () => {
              await builder.addLesson();
            }}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {mod.lessons.map((lesson, idx) => (
              <div
                key={lesson.id}
                className={`rounded-lg p-2.5 cursor-pointer transition-colors text-sm ${
                  selectedLessonId === lesson.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted'
                }`}
                onClick={() => { setSelectedLessonId(lesson.id); setSelectedStepId(null); }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs font-mono w-5 shrink-0">{idx + 1}.</span>
                  <span className="truncate font-medium">{lesson.title}</span>
                </div>
                <span className="text-xs text-muted-foreground ml-7">{lesson.steps.length} steps</span>
              </div>
            ))}
            {mod.lessons.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-6">No lessons yet. Click + to add one.</p>
            )}
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
                  {/* Lesson title edit */}
                  <Input
                    value={currentLesson.title}
                    onChange={e => builder.updateLesson(selectedLessonId, { title: e.target.value })}
                    className="text-xs h-8"
                    placeholder="Lesson title"
                  />
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {currentLesson.steps.map((step, idx) => {
                    const TypeIcon = STEP_TYPES.find(t => t.value === step.type)?.icon ?? FileText;
                    return (
                      <div
                        key={step.id}
                        className={`rounded-md p-2 cursor-pointer transition-colors text-xs flex items-center gap-2 ${
                          selectedStepId === step.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted'
                        }`}
                        onClick={() => setSelectedStepId(step.id)}
                      >
                        <TypeIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">{step.title}</span>
                      </div>
                    );
                  })}
                  {currentLesson.steps.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-6">No steps yet.</p>
                  )}
                </div>
                <div className="p-2 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-destructive hover:text-destructive text-xs"
                    onClick={async () => {
                      await builder.deleteLesson(selectedLessonId);
                      setSelectedLessonId(null);
                      setSelectedStepId(null);
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete Lesson
                  </Button>
                </div>
              </div>

              {/* Step editor */}
              <div className="flex-1 overflow-y-auto p-6">
                {selectedStepId && currentStep ? (
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold">Edit Step</h2>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={async () => {
                            await builder.deleteStep(selectedStepId);
                            setSelectedStepId(null);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                        <Button size="sm" onClick={handleSaveStep}>
                          <Save className="w-4 h-4 mr-1.5" /> Save Step
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Step Title</Label>
                          <Input value={stepTitle} onChange={e => setStepTitle(e.target.value)} placeholder="Step title" />
                        </div>
                        <div className="space-y-2">
                          <Label>Step Type</Label>
                          <Select value={stepType} onValueChange={setStepType}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {STEP_TYPES.map(t => (
                                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Instruction / Content</Label>
                        <Textarea
                          value={stepInstruction}
                          onChange={e => setStepInstruction(e.target.value)}
                          placeholder="The main content students will see. Supports basic formatting."
                          rows={5}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Why It Matters <span className="text-muted-foreground font-normal">(optional)</span></Label>
                        <Input
                          value={stepWhyItMatters}
                          onChange={e => setStepWhyItMatters(e.target.value)}
                          placeholder="Help students understand why this concept is important"
                        />
                      </div>

                      <Separator />

                      {/* Type-specific editors */}
                      {stepType === 'quiz' && (
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <HelpCircle className="w-4 h-4" /> Quiz Configuration
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label>Question Type</Label>
                              <Select value={quizType} onValueChange={v => setQuizType(v as any)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                  <SelectItem value="short-answer">Short Answer</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {quizType === 'multiple-choice' && (
                              <div className="space-y-2">
                                <Label>Options</Label>
                                {quizOptions.map((opt, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground w-5">{String.fromCharCode(65 + i)}.</span>
                                    <Input
                                      value={opt}
                                      onChange={e => {
                                        const next = [...quizOptions];
                                        next[i] = e.target.value;
                                        setQuizOptions(next);
                                      }}
                                      placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                      className="text-sm"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="space-y-2">
                              <Label>Correct Answer</Label>
                              <Input
                                value={quizCorrectAnswer}
                                onChange={e => setQuizCorrectAnswer(e.target.value)}
                                placeholder="The correct answer text"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Acceptable Alternatives <span className="text-muted-foreground font-normal">(comma-separated)</span></Label>
                              <Input
                                value={quizAcceptable}
                                onChange={e => setQuizAcceptable(e.target.value)}
                                placeholder="e.g. SUM, sum, Sum"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Explanation <span className="text-muted-foreground font-normal">(shown after answering)</span></Label>
                              <Textarea
                                value={quizExplanation}
                                onChange={e => setQuizExplanation(e.target.value)}
                                placeholder="Explain why this answer is correct"
                                rows={2}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {stepType === 'instruction' && (
                        <div className="rounded-lg border border-dashed border-border p-6 text-center">
                          <FileText className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Instruction steps display the content above to students. No additional configuration needed.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
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
    </div>
  );
};

export default ModuleBuilder;
