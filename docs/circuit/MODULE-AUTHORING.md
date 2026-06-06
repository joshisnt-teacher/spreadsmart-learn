# Circuit Module Authoring Guide

This guide is for AI agents building modules for Circuit (spreadsmart-learn).
Load this file as context at the start of any module-creation session.

## Overview

A **Module** contains **Lessons**, which contain **Steps**.
Each step has a `layout` and a `blocks[]` array.
Blocks are the atomic content units — text, video, interactive activities, etc.

## Quick Start

```typescript
import { text, callout, trueFalse, wordMatch, fillInBlank, flashcards, sequence, dragSort, imageHotspot, labelDiagram, crossword } from '@/lib/blocks/factories';
import { instructionStep, interactiveStep } from '@/lib/blocks/steps';
import { publishModule } from '@/lib/blocks/assembler';

const result = await publishModule(
  {
    title: 'Introduction to Business',
    description: 'Learn key business concepts through interactive activities.',
    estimatedMinutes: 20,
  },
  [
    {
      title: 'Lesson 1: Revenue and Profit',
      description: 'Understand how businesses generate and measure success.',
      steps: [
        instructionStep({
          title: 'What is Revenue?',
          blocks: [
            text('**Revenue** is the total income a business earns from selling goods or services.'),
            callout({ variant: 'why-it-matters', content: 'Revenue is the starting point of all business analysis.' }),
          ],
        }),
        interactiveStep({
          title: 'True or False?',
          layout: 'stacked',
          blocks: [
            text('Test your understanding:'),
            trueFalse({
              statement: 'A business with high revenue always makes a profit.',
              correct: false,
              explanation: 'Revenue is total income. Profit = Revenue − Costs. High revenue does not guarantee profit.',
            }),
          ],
          scoring: { xpValue: 10, hints: [], successMessage: 'Correct!' },
        }),
      ],
    },
  ]
);

console.log('Published module ID:', result.moduleId);
```

---

## Block Types Reference

### `text(content: string)`
Markdown content. Supports **bold**, *italic*, lists, headings.
```typescript
text('## Key Terms\n- **Revenue** — total income\n- **Profit** — income minus costs')
```

### `callout({ variant, content })`
Variants: `'tip'` | `'warning'` | `'why-it-matters'` | `'reflection'`
```typescript
callout({ variant: 'tip', content: 'Remember: costs include both fixed and variable expenses.' })
```

### `video(url, caption?)`
YouTube embed URL or direct MP4.
```typescript
video('https://www.youtube.com/embed/dQw4w9WgXcQ', 'Introduction to supply and demand')
```

### `trueFalse({ statement, correct, explanation })`
Binary choice. Always provide a clear explanation — shown after answering.
```typescript
trueFalse({
  statement: 'Supply increases when price decreases.',
  correct: false,
  explanation: 'Higher prices incentivise producers to supply more, not less.',
})
```

### `fillInBlank({ text, blanks })`
Use `{{blank}}` in text for each gap. Blanks match by array index.
```typescript
fillInBlank({
  text: 'When demand increases and supply stays the same, price will {{blank}}.',
  blanks: [{ accepted: ['rise', 'increase', 'go up'] }],
})
```

### `wordMatch({ pairs, instruction? })`
Best for vocabulary matching. Provide 3–6 pairs.
```typescript
wordMatch({
  instruction: 'Match each term to its definition.',
  pairs: [
    { term: 'Supply', definition: 'Amount producers are willing to sell' },
    { term: 'Demand', definition: 'Amount consumers want to buy' },
    { term: 'Equilibrium', definition: 'Point where supply equals demand' },
  ],
})
```

### `dragSort({ instruction, items, mode? })`
Mode `'order'` for sequential steps. Mode `'group'` for categorisation.
```typescript
dragSort({
  instruction: 'Put these steps of the design thinking process in order.',
  mode: 'order',
  items: [
    { label: 'Empathise', correctPosition: 1 },
    { label: 'Define', correctPosition: 2 },
    { label: 'Ideate', correctPosition: 3 },
    { label: 'Prototype', correctPosition: 4 },
    { label: 'Test', correctPosition: 5 },
  ],
})
```

### `sequence({ instruction, items })`
Simpler than dragSort — click-to-swap ordering only, no groups.
```typescript
sequence({
  instruction: 'Arrange these events in chronological order.',
  items: [
    { label: 'Industrial Revolution begins', correctIndex: 0 },
    { label: 'World War I', correctIndex: 1 },
    { label: 'Moon landing', correctIndex: 2 },
  ],
})
```

### `flashcards({ cards, instruction? })`
Explore-mode — no right/wrong. Students flip through cards.
Best at the start of a lesson to introduce vocabulary.
```typescript
flashcards({
  instruction: 'Review these key terms before starting.',
  cards: [
    { front: 'GDP', back: 'Gross Domestic Product — total market value of all goods and services produced in a country.' },
    { front: 'Inflation', back: 'The rate at which the general level of prices rises over time.' },
  ],
})
```

### `imageHotspot({ imageUrl, imageAlt, hotspots })`
For diagrams with labelled regions. Use `revealText` for info-only hotspots,
`question` + `accepted` for interactive ones.
```typescript
imageHotspot({
  imageUrl: 'https://example.com/supply-demand-graph.png',
  imageAlt: 'Supply and demand diagram',
  hotspots: [
    { x: 50, y: 30, label: 'Equilibrium Point', revealText: 'Where supply and demand curves intersect.' },
    { x: 20, y: 20, label: 'Surplus Region', question: 'What happens to price in this region?', accepted: ['falls', 'decreases', 'drops'] },
  ],
})
```

### `labelDiagram({ imageUrl, imageAlt, labels, slots })`
Students drag labels to correct positions on a diagram.
`correctLabelIndex` refers to the index in the `labels` array.
```typescript
labelDiagram({
  imageUrl: 'https://example.com/cell-diagram.png',
  imageAlt: 'Plant cell diagram',
  labels: [
    { text: 'Cell Wall' },
    { text: 'Chloroplast' },
    { text: 'Nucleus' },
    { text: 'Vacuole' },
  ],
  slots: [
    { x: 10, y: 50, correctLabelIndex: 0 },
    { x: 30, y: 25, correctLabelIndex: 1 },
    { x: 50, y: 50, correctLabelIndex: 2 },
    { x: 70, y: 60, correctLabelIndex: 3 },
  ],
})
```

### `crossword({ clues })`
Words must be UPPERCASE. Author pre-calculates grid positions.
Best for 4–8 vocabulary terms at the end of a lesson.
```typescript
crossword({
  clues: [
    { word: 'REVENUE',  clue: 'Total income from sales',           direction: 'across', row: 0, col: 0 },
    { word: 'PROFIT',   clue: 'Revenue minus costs',               direction: 'down',   row: 0, col: 3 },
    { word: 'COST',     clue: 'Expense incurred by a business',    direction: 'across', row: 2, col: 3 },
  ],
})
```
**Grid placement tip:** Draw the grid on paper first, then encode `row`/`col` for each word's starting letter.

---

## Step Layouts

| Layout | When to use |
|---|---|
| `'instruction-full'` | Text, video, callouts — no interactive workspace |
| `'stacked'` | Instruction above, interactive block below (default for interactive steps) |
| `'split-left-instruction'` | Long instruction with a spreadsheet or complex workspace |
| `'split-right-instruction'` | Workspace on left, notes on right |
| `'workspace-full'` | Full-screen interactive (crosswords, complex diagrams) |

---

## Module Design Patterns

### Vocabulary lesson (HASS / Business)
1. `instructionStep` — flashcards to introduce terms
2. `instructionStep` — text with definitions and context
3. `interactiveStep` — wordMatch to test understanding
4. `interactiveStep` — fillInBlank in context
5. `interactiveStep` — crossword as final review

### Process / sequence lesson
1. `instructionStep` — text + callout explaining the process
2. `instructionStep` — video of the process
3. `interactiveStep` — dragSort or sequence to order steps
4. `interactiveStep` — trueFalse statements about the process
5. `interactiveStep` — imageHotspot on a process diagram

### Science / geography diagram lesson
1. `instructionStep` — text + image intro
2. `instructionStep` — imageHotspot (info mode, no questions)
3. `interactiveStep` — labelDiagram
4. `interactiveStep` — fillInBlank with key facts
5. `interactiveStep` — wordMatch for terminology

---

## Publishing via Supabase MCP

If using the Supabase MCP directly instead of `publishModule()`, insert in this order:

1. `custom_modules` — requires `teacher_id` (from auth), `title`, `description`, `estimated_minutes`, `status: 'published'`
2. `custom_lessons` — requires `module_id`, `title`, `description`, `order`
3. `custom_steps` — requires `lesson_id`, `title`, `layout`, `order`, `type: 'v2'`, `instruction: ''`, `config: { blocks: [...], scoring: { ... } }`

The `config` JSON column on `custom_steps` holds the complete step definition:
```json
{
  "blocks": [ ...block objects... ],
  "scoring": { "xpValue": 10, "hints": [], "successMessage": "Great work!" }
}
```
