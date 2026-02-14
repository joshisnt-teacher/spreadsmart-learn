import React, { useState } from 'react';
import { Wand2, Sparkles, BookOpen, FileText, RefreshCw, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type AiAction = 'generate_module' | 'generate_step' | 'improve_content';

interface AiAssistantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResult: (action: AiAction, result: any) => void;
  context?: {
    moduleTitle?: string;
    moduleDescription?: string;
    currentLessonTitle?: string;
    currentStepTitle?: string;
    currentStepInstruction?: string;
  };
}

const ACTION_OPTIONS = [
  {
    value: 'generate_module' as AiAction,
    label: 'Generate Full Module',
    description: 'Create a complete module with lessons, steps, quizzes, and tasks',
    icon: BookOpen,
    placeholder: 'e.g. "Create a module about Excel budgeting for beginners. Include SUM, AVERAGE formulas and a quiz."',
  },
  {
    value: 'generate_step' as AiAction,
    label: 'Generate Step',
    description: 'Create a single instruction, task, or quiz step',
    icon: FileText,
    placeholder: 'e.g. "Create a spreadsheet task where students calculate total sales using SUM" or "Make a quiz about cell references"',
  },
  {
    value: 'improve_content' as AiAction,
    label: 'Improve Content',
    description: 'Rewrite and enhance the current step\'s title, instruction, or explanation',
    icon: RefreshCw,
    placeholder: 'e.g. "Make the instruction clearer and more engaging" or "Add a real-world analogy"',
  },
];

const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ open, onOpenChange, onResult, context }) => {
  const [selectedAction, setSelectedAction] = useState<AiAction | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedAction || !prompt.trim()) return;
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-module-assist', {
        body: { action: selectedAction, prompt: prompt.trim(), context },
      });

      if (error) throw error;

      if (data?.error) {
        toast({ title: 'AI Error', description: data.error, variant: 'destructive' });
        return;
      }

      onResult(selectedAction, data.result);
      onOpenChange(false);
      setSelectedAction(null);
      setPrompt('');
      toast({ title: 'AI content generated!', description: 'Review the generated content and save when ready.' });
    } catch (err: any) {
      console.error('AI assist error:', err);
      toast({ title: 'Error', description: err.message || 'Failed to generate content', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedAction(null);
    setPrompt('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-primary" />
            AI Module Assistant
          </DialogTitle>
          <DialogDescription>
            {selectedAction ? 'Describe what you want to create or improve.' : 'Choose what you\'d like the AI to help with.'}
          </DialogDescription>
        </DialogHeader>

        {!selectedAction ? (
          <div className="space-y-2 pt-2">
            {ACTION_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  className="w-full flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent hover:border-primary/30 transition-colors text-left"
                  onClick={() => setSelectedAction(opt.value)}
                >
                  <Icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{opt.label}</p>
                    <p className="text-xs text-muted-foreground">{opt.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {context && (selectedAction === 'generate_step' || selectedAction === 'improve_content') && (
              <div className="rounded-md bg-muted/50 p-3 text-xs space-y-1">
                <p className="font-medium text-muted-foreground">Current context:</p>
                {context.moduleTitle && <p>Module: {context.moduleTitle}</p>}
                {context.currentLessonTitle && <p>Lesson: {context.currentLessonTitle}</p>}
                {context.currentStepTitle && <p>Step: {context.currentStepTitle}</p>}
              </div>
            )}

            <div className="space-y-2">
              <Label>Your prompt</Label>
              <Textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder={ACTION_OPTIONS.find(a => a.value === selectedAction)?.placeholder}
                rows={4}
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={handleBack} disabled={loading}>
                ← Back
              </Button>
              <Button onClick={handleSubmit} disabled={loading || !prompt.trim()} size="sm">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-1.5" /> Generate
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AiAssistantModal;
