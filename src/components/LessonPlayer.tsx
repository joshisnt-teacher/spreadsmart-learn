import React from 'react';
import { BookOpen, Award, Lightbulb, Menu, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLessonPlayer } from '@/hooks/useLessonPlayer';
import LessonSidebar from '@/components/lesson/LessonSidebar';
import StepContentArea from '@/components/lesson/StepContentArea';
import FeedbackBar from '@/components/lesson/FeedbackBar';
import type { Lesson } from '@/types/lesson';
import { Trophy } from 'lucide-react';

interface LessonPlayerProps {
  lesson: Lesson;
  moduleId?: string;
  onComplete?: (xpEarned: number) => void;
  onBack?: () => void;
}

const LessonPlayer: React.FC<LessonPlayerProps> = ({ lesson, moduleId = '', onComplete, onBack }) => {
  const player = useLessonPlayer(lesson, moduleId, onComplete);

  if (!player.currentStep) return null;

  // Instruction rendering helper
  const renderInline = (text: string) => {
    const tokens = text.split(/(\*\*.*?\*\*|`[^`]+`)/g);
    return tokens.map((tok, i) => {
      if (tok.startsWith('**') && tok.endsWith('**')) return <code key={i} className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono text-xs">{tok.slice(2, -2)}</code>;
      if (tok.startsWith('`') && tok.endsWith('`')) return <code key={i} className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono text-xs">{tok.slice(1, -1)}</code>;
      return <span key={i}>{tok}</span>;
    });
  };

  const renderInstruction = () => {
    const lines = player.currentStep!.instruction.split('\n');
    const blocks: { type: 'text' | 'table'; lines: string[] }[] = [];
    for (const line of lines) {
      if (line.trimStart().startsWith('|')) {
        const last = blocks[blocks.length - 1];
        if (last?.type === 'table') last.lines.push(line);
        else blocks.push({ type: 'table', lines: [line] });
      } else {
        blocks.push({ type: 'text', lines: [line] });
      }
    }

    return blocks.map((block, bi) => {
      if (block.type === 'table') {
        const rows = block.lines
          .map(l => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim()))
          .filter(cells => !cells.every(c => /^-+$/.test(c)));
        const [header, ...body] = rows;
        return (
          <div key={bi} className="overflow-x-auto my-2">
            <table className="text-sm border-collapse w-auto">
              <thead><tr>{header.map((h, hi) => <th key={hi} className="border border-border px-3 py-1.5 bg-muted font-semibold text-left">{renderInline(h)}</th>)}</tr></thead>
              <tbody>{body.map((row, ri) => <tr key={ri}>{row.map((cell, ci) => <td key={ci} className="border border-border px-3 py-1.5">{renderInline(cell)}</td>)}</tr>)}</tbody>
            </table>
          </div>
        );
      }
      const line = block.lines[0];
      if (!line) return <p key={bi} className="mb-1.5" />;
      return <p key={bi} className="mb-1.5 last:mb-0">{renderInline(line)}</p>;
    });
  };

  const sidebarContent = (
    <LessonSidebar
      lesson={lesson}
      currentStepIndex={player.currentStepIndex}
      progress={player.progress}
      progressPercent={player.progressPercent}
      onStepClick={player.handleStepClick}
      onBack={onBack}
    />
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile sidebar overlay */}
      {player.isMobile && player.sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => player.setSidebarOpen(false)} />
          <aside className="relative w-72 bg-card flex flex-col z-10 shadow-xl">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 z-10" onClick={() => player.setSidebarOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      {!player.isMobile && (
        <aside className="w-64 border-r bg-card flex flex-col shrink-0">
          {sidebarContent}
        </aside>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Instruction panel */}
        <div className={`p-4 md:p-6 border-b ${player.isChallengeStep ? 'bg-gradient-to-r from-warning/10 via-accent/10 to-primary/10' : 'bg-card'}`}>
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              {player.isMobile && (
                <Button variant="ghost" size="icon" className="h-6 w-6 -ml-1" onClick={() => player.setSidebarOpen(true)}>
                  <Menu className="w-4 h-4" />
                </Button>
              )}
              {player.isChallengeStep ? <Award className="w-3.5 h-3.5 text-warning" /> : <BookOpen className="w-3.5 h-3.5" />}
              <span>Step {player.currentStepIndex + 1} of {lesson.steps.length}</span>
              {player.isChallengeStep && (
                <Badge className="bg-warning text-warning-foreground ml-1 text-[10px] px-1.5 py-0">
                  <Trophy className="w-3 h-3 mr-0.5" /> Challenge
                </Badge>
              )}
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-3">{player.currentStep.title}</h3>
            <div className="prose prose-sm max-w-none text-foreground/90">
              {renderInstruction()}
            </div>

            {player.currentStep.whyItMatters && (
              <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                <Lightbulb className="w-3.5 h-3.5 mt-0.5 shrink-0 text-warning" />
                <span>{player.currentStep.whyItMatters}</span>
              </div>
            )}
          </div>
        </div>

        {/* Step content */}
        <StepContentArea
          currentStep={player.currentStep}
          isMobile={player.isMobile}
          isChartStep={player.isChartStep}
          isQuizStep={player.isQuizStep}
          isTableTaskStep={player.isTableTaskStep}
          isInstructionStep={player.isInstructionStep}
          isChallengeStep={player.isChallengeStep}
          resetKey={player.resetKey}
          feedback={player.feedback}
          currentCellData={player.currentCellData}
          quizAnswer={player.quizAnswer}
          tableAnswer={player.tableAnswer}
          onDataChange={player.handleDataChange}
          onChartSelectionChange={(type, xKey, yKey) => player.setChartSelection({ type, xKey, yKey })}
          onQuizAnswerChange={player.setQuizAnswer}
          onTableAnswerChange={player.setTableAnswer}
        />

        {/* Feedback & Controls */}
        <FeedbackBar
          feedback={player.feedback}
          showHint={player.showHint}
          currentHint={player.currentHint}
          isInstructionStep={player.isInstructionStep}
          isStepComplete={player.isStepComplete}
          isLastStep={player.isLastStep}
          isRedoing={player.isRedoing}
          isMobile={player.isMobile}
          showStuckButton={player.showStuckButton}
          stuckTriggered={player.stuckTriggered}
          isAssessment={player.isAssessment}
          onCheck={player.handleCheck}
          onInstructionContinue={player.handleInstructionContinue}
          onNext={player.handleNext}
          onReset={player.handleReset}
          onHint={player.handleHint}
          onStuck={player.handleStuck}
        />
      </div>
    </div>
  );
};

export default LessonPlayer;
