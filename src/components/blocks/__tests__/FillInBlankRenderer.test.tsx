import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FillInBlankRenderer } from '../FillInBlankRenderer';
import type { FillInBlankBlock } from '@/types/module-v2';
import type { BlockContext } from '../BlockRegistry';

const block: FillInBlankBlock = {
  type: 'fill-blank',
  blockId: 'fb-1',
  text: 'Revenue minus {{blank}} equals {{blank}}.',
  blanks: [
    { id: 'b1', accepted: ['costs', 'expenses'] },
    { id: 'b2', accepted: ['profit'] },
  ],
};

const ctx: BlockContext = { stepId: 's1', lessonId: 'l1', moduleId: 'm1' };

describe('FillInBlankRenderer', () => {
  it('renders inputs in place of {{blank}} markers', () => {
    render(<FillInBlankRenderer block={block} context={ctx} />);
    expect(screen.getAllByRole('textbox')).toHaveLength(2);
  });

  it('calls onResponse correct:true when all blanks match accepted answers', () => {
    const onResponse = vi.fn();
    render(<FillInBlankRenderer block={block} context={{ ...ctx, onResponse }} />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'costs' } });
    fireEvent.change(inputs[1], { target: { value: 'profit' } });
    fireEvent.click(screen.getByRole('button', { name: /check/i }));
    expect(onResponse).toHaveBeenCalledWith(
      expect.objectContaining({ correct: true, blockId: 'fb-1' })
    );
  });

  it('calls onResponse correct:false when a blank is wrong', () => {
    const onResponse = vi.fn();
    render(<FillInBlankRenderer block={block} context={{ ...ctx, onResponse }} />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'wrong' } });
    fireEvent.change(inputs[1], { target: { value: 'profit' } });
    fireEvent.click(screen.getByRole('button', { name: /check/i }));
    expect(onResponse).toHaveBeenCalledWith(
      expect.objectContaining({ correct: false })
    );
  });

  it('accepts case-insensitive answers', () => {
    const onResponse = vi.fn();
    render(<FillInBlankRenderer block={block} context={{ ...ctx, onResponse }} />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'EXPENSES' } });
    fireEvent.change(inputs[1], { target: { value: 'Profit' } });
    fireEvent.click(screen.getByRole('button', { name: /check/i }));
    expect(onResponse).toHaveBeenCalledWith(
      expect.objectContaining({ correct: true })
    );
  });
});
