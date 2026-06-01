import React, { useState } from 'react';
import SpreadsheetWorkspace from '@/components/SpreadsheetWorkspace';
import type { SpreadsheetBlock } from '@/types/module-v2';
import { BlockContext } from './BlockRegistry';

interface Props {
  block: SpreadsheetBlock;
  context: BlockContext;
}

/**
 * Wraps the existing SpreadsheetWorkspace as a block renderer.
 * In the full refactor, the check logic would live here or be delegated
 * to a shared marking hook.
 */
export const SpreadsheetBlockRenderer: React.FC<Props> = ({ block }) => {
  const [cellData, setCellData] = useState<any[]>([]);

  return (
    <div className="h-full border rounded-lg overflow-hidden bg-background shadow-sm">
      <SpreadsheetWorkspace
        initialState={block.initialState}
        editableCells={block.editableCells}
        onDataChange={setCellData}
        resetKey={0}
      />
    </div>
  );
};
