import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TrueFalseRenderer } from '../TrueFalseRenderer';
import type { TrueFalseBlock } from '@/types/module-v2';
import type { BlockContext } from '../BlockRegistry';

const block: TrueFalseBlock = {
  type: 'true-false',
  blockId: 'tf-1',
  statement: 'A business with high revenue always makes a profit.',
  correct: false,
  explanation: 'Revenue is income; profit is revenue minus costs.',
};

const ctx: BlockContext = { stepId: 's1', lessonId: 'l1', moduleId: 'm1' };

describe('TrueFalseRenderer', () => {
  it('renders the statement', () => {
    render(<TrueFalseRenderer block={block} context={ctx} />);
    expect(screen.getByText(/high revenue always makes a profit/i)).toBeTruthy();
  });

  it('calls onResponse with correct:true when student picks False on a false statement', () => {
    const onResponse = vi.fn();
    render(<TrueFalseRenderer block={block} context={{ ...ctx, onResponse }} />);
    fireEvent.click(screen.getByRole('button', { name: /false/i }));
    expect(onResponse).toHaveBeenCalledWith({
      blockId: 'tf-1',
      blockType: 'true-false',
      correct: true,
      answer: false,
    });
  });

  it('calls onResponse with correct:false when student picks True on a false statement', () => {
    const onResponse = vi.fn();
    render(<TrueFalseRenderer block={block} context={{ ...ctx, onResponse }} />);
    fireEvent.click(screen.getByRole('button', { name: /true/i }));
    expect(onResponse).toHaveBeenCalledWith(
      expect.objectContaining({ correct: false })
    );
  });

  it('shows explanation after answering', () => {
    render(<TrueFalseRenderer block={block} context={ctx} />);
    fireEvent.click(screen.getByRole('button', { name: /false/i }));
    expect(screen.getByText(/revenue is income/i)).toBeTruthy();
  });
});
