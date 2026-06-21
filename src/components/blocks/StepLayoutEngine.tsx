/**
 * Step Layout Engine
 *
 * Reads step.layout and arranges instruction blocks + workspace blocks
 * into the correct spatial configuration.
 */
import React from 'react';
import type { Step } from '@/types/module-v2';
import { renderBlock, getInstructionBlocks, getWorkspaceBlocks, BlockContext } from './BlockRegistry';

interface Props {
  step: Step;
  context: BlockContext;
  isMobile?: boolean;
}

export const StepLayoutEngine: React.FC<Props> = ({ step, context, isMobile = false }) => {
  const instructionBlocks = getInstructionBlocks(step.blocks);
  const workspaceBlocks = getWorkspaceBlocks(step.blocks);

  const renderInstructions = () => (
    <div className="space-y-2">
      {instructionBlocks.map((block, i) => renderBlock(block, context, i))}
    </div>
  );

  const renderWorkspace = () => (
    <div className="h-full">
      {workspaceBlocks.map((block, i) => renderBlock(block, context, `ws-${i}`))}
      {workspaceBlocks.length === 0 && (
        <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
          Nothing to do here. Just read and continue.
        </div>
      )}
    </div>
  );

  switch (step.layout) {
    case 'instruction-full':
      return (
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          {renderInstructions()}
        </div>
      );

    case 'split-left-instruction':
      if (isMobile) {
        return (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-4 border-b bg-card overflow-auto max-h-[40%]">
              {renderInstructions()}
            </div>
            <div className="flex-1 min-h-0 p-2">
              {renderWorkspace()}
            </div>
          </div>
        );
      }
      return (
        <div className="flex-1 flex min-h-0">
          <div className="w-1/2 p-4 md:p-6 border-r bg-card overflow-auto">
            {renderInstructions()}
          </div>
          <div className="w-1/2 p-2 md:p-4 min-h-0">
            {renderWorkspace()}
          </div>
        </div>
      );

    case 'split-right-instruction':
      if (isMobile) {
        return (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-4 border-b bg-card overflow-auto max-h-[40%]">
              {renderInstructions()}
            </div>
            <div className="flex-1 min-h-0 p-2">
              {renderWorkspace()}
            </div>
          </div>
        );
      }
      return (
        <div className="flex-1 flex min-h-0">
          <div className="w-1/2 p-2 md:p-4 min-h-0">
            {renderWorkspace()}
          </div>
          <div className="w-1/2 p-4 md:p-6 border-l bg-card overflow-auto">
            {renderInstructions()}
          </div>
        </div>
      );

    case 'stacked':
      return (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-4 border-b bg-card overflow-auto max-h-[45%]">
            {renderInstructions()}
          </div>
          <div className="flex-1 min-h-0 p-2 md:p-4">
            {renderWorkspace()}
          </div>
        </div>
      );

    case 'workspace-full':
      return (
        <div className="flex-1 p-2 md:p-4 min-h-0">
          {renderWorkspace()}
        </div>
      );

    default:
      // Fallback for safety
      return (
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          {renderInstructions()}
          {workspaceBlocks.length > 0 && (
            <div className="mt-4 h-96">{renderWorkspace()}</div>
          )}
        </div>
      );
  }
};
