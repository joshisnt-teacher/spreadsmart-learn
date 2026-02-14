import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { QuizQuestion, CheckResult } from '@/types/lesson';

interface QuizStepProps {
  quiz: QuizQuestion;
  feedback: CheckResult | null;
  onAnswerChange: (answer: string) => void;
  answer: string;
}

const QuizStep: React.FC<QuizStepProps> = ({ quiz, feedback, onAnswerChange, answer }) => {
  const isCorrect = feedback?.type === 'correct';
  const isIncorrect = feedback?.type === 'incorrect' || feedback?.type === 'almost';

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {quiz.type === 'multiple-choice' && quiz.options ? (
          <RadioGroup
            value={answer}
            onValueChange={onAnswerChange}
            className="space-y-3"
            disabled={isCorrect}
          >
            {quiz.options.map((option) => {
              const isSelected = answer === option;
              const showCorrect = isCorrect && isSelected;
              const showWrong = isIncorrect && isSelected;

              return (
                <Label
                  key={option}
                  htmlFor={`option-${option}`}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    showCorrect
                      ? 'border-accent bg-accent/10'
                      : showWrong
                      ? 'border-destructive bg-destructive/10'
                      : isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/40 hover:bg-muted/50'
                  } ${isCorrect ? 'cursor-default' : ''}`}
                >
                  <RadioGroupItem value={option} id={`option-${option}`} />
                  <span className="text-sm font-medium flex-1">{option}</span>
                  {showCorrect && <CheckCircle2 className="w-5 h-5 text-accent" />}
                  {showWrong && <XCircle className="w-5 h-5 text-destructive" />}
                </Label>
              );
            })}
          </RadioGroup>
        ) : (
          <div className="space-y-3">
            <Input
              value={answer}
              onChange={(e) => onAnswerChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
              placeholder="Type your answer…"
              disabled={isCorrect}
              className={`text-base h-12 ${
                isCorrect
                  ? 'border-accent bg-accent/10'
                  : isIncorrect
                  ? 'border-destructive bg-destructive/10'
                  : ''
              }`}
            />
          </div>
        )}

        {/* Explanation after correct answer */}
        {isCorrect && quiz.explanation && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-lg bg-accent/10 text-accent text-sm"
          >
            {quiz.explanation}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default QuizStep;
