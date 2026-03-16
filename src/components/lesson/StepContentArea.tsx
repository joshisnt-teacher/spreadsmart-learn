import React from 'react';
import SpreadsheetWorkspace from '@/components/SpreadsheetWorkspace';
import ChartWorkspace from '@/components/ChartWorkspace';
import ChartBuilder from '@/components/ChartBuilder';
import QuizStep from '@/components/QuizStep';
import InteractiveTable from '@/components/InteractiveTable';
import type { Step, CheckResult, ChartType } from '@/types/lesson';

interface StepContentAreaProps {
  currentStep: Step;
  isMobile: boolean;
  isChartStep: boolean;
  isQuizStep: boolean;
  isTableTaskStep: boolean;
  isInstructionStep: boolean;
  isChallengeStep: boolean;
  resetKey: number;
  feedback: CheckResult | null;
  currentCellData: any[];
  quizAnswer: string;
  tableAnswer: string;
  onDataChange: (celldata: any[]) => void;
  onChartSelectionChange: (type: ChartType | null, xKey: string | null, yKey: string | null) => void;
  onQuizAnswerChange: (v: string) => void;
  onTableAnswerChange: (v: string) => void;
}

const StepContentArea: React.FC<StepContentAreaProps> = ({
  currentStep, isMobile, isChartStep, isQuizStep, isTableTaskStep, isInstructionStep, isChallengeStep,
  resetKey, feedback, currentCellData, quizAnswer, tableAnswer,
  onDataChange, onChartSelectionChange, onQuizAnswerChange, onTableAnswerChange,
}) => {
  if (isChartStep) {
    return (
      <div className={`flex-1 flex ${isMobile ? 'flex-col' : ''} min-h-0`}>
        {currentStep.initialSheetState && (
          <div className={`${isMobile ? 'h-1/2' : 'w-1/2'} p-2 md:p-4 min-h-0`}>
            <div className="h-full border rounded-lg overflow-hidden bg-background shadow-sm">
              <SpreadsheetWorkspace
                initialState={currentStep.initialSheetState}
                editableCells={currentStep.task?.editableCells ?? []}
                onDataChange={onDataChange}
                resetKey={resetKey}
              />
            </div>
          </div>
        )}
        <div className={`${currentStep.initialSheetState ? (isMobile ? 'h-1/2' : 'w-1/2') : 'flex-1'} p-2 md:p-4 min-h-0`}>
          <div className="h-full border rounded-lg overflow-hidden bg-background shadow-sm">
            {currentStep.chartTask ? (
              <ChartBuilder
                config={currentStep.chartConfig!}
                cellData={currentCellData.length > 0 ? currentCellData : currentStep.initialSheetState?.celldata ?? []}
                onSelectionChange={(type, xKey, yKey) => onChartSelectionChange(type, xKey, yKey)}
              />
            ) : currentStep.chartConfig ? (
              <ChartWorkspace
                config={currentStep.chartConfig}
                cellData={currentCellData.length > 0 ? currentCellData : currentStep.initialSheetState?.celldata ?? []}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (isQuizStep && currentStep.quiz) {
    return (
      <QuizStep
        quiz={currentStep.quiz}
        question={currentStep.instruction}
        feedback={feedback}
        onAnswerChange={onQuizAnswerChange}
        answer={quizAnswer}
      />
    );
  }

  if (isTableTaskStep && currentStep.tableTask) {
    return (
      <div className="flex-1 flex flex-col p-2 md:p-4 min-h-0">
        <InteractiveTable
          key={currentStep.id}
          config={currentStep.tableTask}
          answer={tableAnswer}
          onAnswerChange={onTableAnswerChange}
        />
      </div>
    );
  }

  if (isInstructionStep && !isChallengeStep) {
    return currentStep.initialSheetState ? (
      <div className="flex-1 p-2 md:p-4 min-h-0">
        <div className="h-full border rounded-lg overflow-hidden bg-background shadow-sm opacity-80">
          <SpreadsheetWorkspace
            initialState={currentStep.initialSheetState}
            editableCells={[]}
            onDataChange={() => {}}
            resetKey={resetKey}
          />
        </div>
      </div>
    ) : <div className="flex-1" />;
  }

  if ((currentStep.initialSheetState && currentStep.task) || isChallengeStep) {
    return (
      <div className="flex-1 p-2 md:p-4 min-h-0">
        <div className="h-full border rounded-lg overflow-hidden bg-background shadow-sm">
          <SpreadsheetWorkspace
            initialState={currentStep.initialSheetState!}
            editableCells={currentStep.task!.editableCells}
            onDataChange={onDataChange}
            resetKey={resetKey}
          />
        </div>
      </div>
    );
  }

  return <div className="flex-1" />;
};

export default StepContentArea;
