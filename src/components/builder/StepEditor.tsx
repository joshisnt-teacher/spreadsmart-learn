import React from 'react';
import { Trash2, Save, BookOpen, FileText, HelpCircle, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import TaskStepEditor, { type TaskStepConfig } from '@/components/builder/TaskStepEditor';

const STEP_TYPES = [
  { value: 'instruction', label: 'Instruction', icon: FileText },
  { value: 'task', label: 'Spreadsheet Task', icon: Grid3X3 },
  { value: 'quiz', label: 'Quiz', icon: HelpCircle },
] as const;

interface StepEditorProps {
  stepTitle: string;
  setStepTitle: (v: string) => void;
  stepInstruction: string;
  setStepInstruction: (v: string) => void;
  stepType: string;
  setStepType: (v: string) => void;
  stepWhyItMatters: string;
  setStepWhyItMatters: (v: string) => void;
  // Quiz
  quizType: 'multiple-choice' | 'short-answer';
  setQuizType: (v: 'multiple-choice' | 'short-answer') => void;
  quizOptions: string[];
  setQuizOptions: (v: string[]) => void;
  quizCorrectAnswer: string;
  setQuizCorrectAnswer: (v: string) => void;
  quizExplanation: string;
  setQuizExplanation: (v: string) => void;
  quizAcceptable: string;
  setQuizAcceptable: (v: string) => void;
  // Task
  taskConfig: TaskStepConfig | null;
  setTaskConfig: (v: TaskStepConfig | null) => void;
  // Actions
  onSave: () => void;
  onDelete: () => void;
}

const StepEditor: React.FC<StepEditorProps> = ({
  stepTitle, setStepTitle, stepInstruction, setStepInstruction,
  stepType, setStepType, stepWhyItMatters, setStepWhyItMatters,
  quizType, setQuizType, quizOptions, setQuizOptions,
  quizCorrectAnswer, setQuizCorrectAnswer, quizExplanation, setQuizExplanation,
  quizAcceptable, setQuizAcceptable,
  taskConfig, setTaskConfig,
  onSave, onDelete,
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Edit Step</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={onDelete}>
            <Trash2 className="w-4 h-4 mr-1" /> Delete
          </Button>
          <Button size="sm" onClick={onSave}>
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

        {stepType === 'task' && (
          <TaskStepEditor config={taskConfig} onChange={setTaskConfig} />
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
  );
};

export default StepEditor;
