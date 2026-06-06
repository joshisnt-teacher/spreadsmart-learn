import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WordMatchRenderer } from '../WordMatchRenderer';
import type { WordMatchBlock } from '@/types/module-v2';
import type { BlockContext } from '../BlockRegistry';

const block: WordMatchBlock = {
  type: 'word-match',
  blockId: 'wm-1',
  pairs: [
    { id: 'p1', term: 'Revenue', definition: 'Total income from sales' },
    { id: 'p2', term: 'Profit', definition: 'Income minus expenses' },
  ],
};

const ctx: BlockContext = { stepId: 's1', lessonId: 'l1', moduleId: 'm1' };

describe('WordMatchRenderer', () => {
  it('renders all terms and definitions', () => {
    render(<WordMatchRenderer block={block} context={ctx} />);
    expect(screen.getByText('Revenue')).toBeTruthy();
    expect(screen.getByText('Profit')).toBeTruthy();
    expect(screen.getByText('Total income from sales')).toBeTruthy();
  });

  it('calls onResponse correct:true when all pairs correctly matched', () => {
    const onResponse = vi.fn();
    render(<WordMatchRenderer block={block} context={{ ...ctx, onResponse }} />);
    fireEvent.click(screen.getByText('Revenue'));
    fireEvent.click(screen.getByText('Total income from sales'));
    fireEvent.click(screen.getByText('Profit'));
    fireEvent.click(screen.getByText('Income minus expenses'));
    fireEvent.click(screen.getByRole('button', { name: /check/i }));
    expect(onResponse).toHaveBeenCalledWith(
      expect.objectContaining({ correct: true, blockId: 'wm-1' })
    );
  });
});
