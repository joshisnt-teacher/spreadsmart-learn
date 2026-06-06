import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SequenceRenderer } from '../SequenceRenderer';
import type { SequenceBlock } from '@/types/module-v2';
import type { BlockContext } from '../BlockRegistry';

const block: SequenceBlock = {
  type: 'sequence',
  blockId: 'seq-1',
  instruction: 'Order these steps',
  items: [
    { id: 'i1', label: 'Research', correctIndex: 0 },
    { id: 'i2', label: 'Prototype', correctIndex: 1 },
    { id: 'i3', label: 'Launch', correctIndex: 2 },
  ],
};

const ctx: BlockContext = { stepId: 's1', lessonId: 'l1', moduleId: 'm1' };

describe('SequenceRenderer', () => {
  it('renders all items', () => {
    render(<SequenceRenderer block={block} context={ctx} />);
    expect(screen.getByText('Research')).toBeTruthy();
    expect(screen.getByText('Prototype')).toBeTruthy();
    expect(screen.getByText('Launch')).toBeTruthy();
  });

  it('has a check button', () => {
    render(<SequenceRenderer block={block} context={ctx} />);
    expect(screen.getByRole('button', { name: /check/i })).toBeTruthy();
  });

  it('calls onResponse after checking', () => {
    const onResponse = vi.fn();
    render(<SequenceRenderer block={block} context={{ ...ctx, onResponse }} />);
    fireEvent.click(screen.getByRole('button', { name: /check/i }));
    expect(onResponse).toHaveBeenCalledWith(
      expect.objectContaining({ blockId: 'seq-1', blockType: 'sequence' })
    );
  });
});
