import React from 'react';
import type { TextBlock } from '@/types/module-v2';
import { BlockContext } from './BlockRegistry';

interface Props {
  block: TextBlock;
  context: BlockContext;
}

/**
 * Renders markdown-like text with support for:
 * - **bold** text
 * - `inline code`
 * - simple tables (pipe-delimited)
 */
export const TextBlockRenderer: React.FC<Props> = ({ block }) => {
  const renderInline = (text: string) => {
    const tokens = text.split(/(\*\*.*?\*\*|`[^`]+`)/g);
    return tokens.map((tok, i) => {
      if (tok.startsWith('**') && tok.endsWith('**')) {
        return (
          <code
            key={i}
            className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono text-xs"
          >
            {tok.slice(2, -2)}
          </code>
        );
      }
      if (tok.startsWith('`') && tok.endsWith('`')) {
        return (
          <code
            key={i}
            className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono text-xs"
          >
            {tok.slice(1, -1)}
          </code>
        );
      }
      return <span key={i}>{tok}</span>;
    });
  };

  const lines = block.content.split('\n');
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

  return (
    <div className="prose prose-sm max-w-none text-foreground/90">
      {blocks.map((b, bi) => {
        if (b.type === 'table') {
          const rows = b.lines
            .map((l) =>
              l
                .trim()
                .replace(/^\|/, '')
                .replace(/\|$/, '')
                .split('|')
                .map((c) => c.trim())
            )
            .filter((cells) => !cells.every((c) => /^-+$/.test(c)));
          const [header, ...body] = rows;
          if (!header) return null;
          return (
            <div key={bi} className="overflow-x-auto my-2">
              <table className="text-sm border-collapse w-auto">
                <thead>
                  <tr>
                    {header.map((h, hi) => (
                      <th
                        key={hi}
                        className="border border-border px-3 py-1.5 bg-muted font-semibold text-left"
                      >
                        {renderInline(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {body.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          className="border border-border px-3 py-1.5"
                        >
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        const line = b.lines[0];
        if (!line) return <p key={bi} className="mb-1.5" />;
        return (
          <p key={bi} className="mb-1.5 last:mb-0">
            {renderInline(line)}
          </p>
        );
      })}
    </div>
  );
};
