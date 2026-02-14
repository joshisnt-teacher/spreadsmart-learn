

# Fix: Render Markdown Tables and Inline Code in Instructions

## Problem

The instruction renderer in `LessonPlayer.tsx` splits text by newlines and only processes `**bold**` syntax. The "What Is a Summary Table?" step contains markdown tables and inline code backticks, which display as raw pipe characters and backtick text instead of formatted content.

## Solution

Upgrade the instruction rendering logic to handle three markdown features:
1. **Tables** -- detect consecutive lines starting with `|` and render them as HTML `<table>` elements
2. **Inline code** -- detect backtick-wrapped text and render as `<code>` elements
3. **Bold** -- keep the existing `**bold**` handling

## Changes

### `src/components/LessonPlayer.tsx` (instruction rendering block, ~lines 330-345)

Replace the simple line-by-line renderer with a smarter one that:

1. **Groups lines into blocks** -- consecutive lines starting with `|` are collected into a table block; other lines remain as paragraph blocks
2. **Renders table blocks** as styled `<table>` elements:
   - First row becomes `<thead>` with bold header cells
   - Separator rows (`|---|---|`) are skipped
   - Remaining rows become `<tbody>` rows
3. **Renders paragraph blocks** with:
   - `**bold**` converted to styled `<code>` elements (existing behavior)
   - `` `code` `` converted to styled `<code>` elements (new)

The parsing logic will be a helper function that:
```
- Split instruction by \n
- Walk through lines, grouping consecutive | lines into table blocks
- For each table block: parse headers, skip separator, parse data rows
- For each text line: process **bold** and `code` inline formatting
```

No other files need changes -- the instruction text in `charts-module.ts` already uses correct markdown syntax; it just needs a renderer that understands it.
