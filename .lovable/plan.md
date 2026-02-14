

# New Module: Graphs and Pivot Tables

## The Core Challenge

FortuneSheet (our spreadsheet library) does **not** support charts or pivot tables. These features are listed as "coming soon" in their documentation and are not available in the installed version. So we cannot render a chart inside the spreadsheet component the way Excel would.

## Proposed Solution: Hybrid Approach

Keep everything inside the app by combining the existing spreadsheet workspace with a new **chart workspace** component powered by Recharts (already installed). The module would flow in three phases:

### Phase 1: Data Preparation (Spreadsheet steps)
Teach students how to organize and structure data for charting -- using the existing spreadsheet workspace and marking engine. Topics:
- Structuring data in a table layout (headers, consistent rows)
- Using formulas to summarize data (SUM, AVERAGE by category)
- Sorting and grouping data manually (simulating what a pivot table does conceptually)

These steps work exactly like the current module -- spreadsheet tasks with auto-marking.

### Phase 2: Understanding Charts (Instruction + Interactive Chart steps)
Introduce a new step type called `'chart'` that renders an interactive chart component (built with Recharts) alongside the spreadsheet data. This would:
- Show students a dataset in a read-only spreadsheet
- Display the corresponding chart (bar, line, pie) next to or below the data
- Let students answer questions about the chart by typing answers into cells (e.g., "Which month had the highest sales? Type your answer in B1")

### Phase 3: Build Your Own Chart (Interactive chart-building steps)
A new step type where students:
1. See a dataset in the spreadsheet
2. Choose chart type, X-axis column, Y-axis column via a simple form/dropdown UI
3. The app renders the chart live from their selections
4. The marking engine checks that they selected the correct chart type and axes for the given data

## Technical Changes

### 1. Extend the Step type (`src/types/lesson.ts`)

Add new step type and chart configuration:

```typescript
type StepType = 'instruction' | 'task' | 'challenge' | 'chart';

interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'area';
  dataSource: 'sheet' | 'static'; // read from sheet or predefined
  staticData?: { name: string; value: number }[];
  xKey?: string;
  yKey?: string;
  title?: string;
}

interface ChartTaskExpectation {
  expectedChartType?: 'bar' | 'line' | 'pie' | 'area';
  expectedXKey?: string;
  expectedYKey?: string;
}

// Add to Step interface:
chartConfig?: ChartConfig;
chartTask?: ChartTaskExpectation;
```

### 2. New component: `ChartWorkspace.tsx`

A component that renders a Recharts chart from either:
- Static data defined in the step
- Data extracted from the spreadsheet state

For "build your own chart" steps, it includes dropdowns for chart type, X-axis, and Y-axis selection, with a live-updating preview.

### 3. New component: `ChartBuilder.tsx`

For interactive chart-building steps:
- Dropdown to select chart type (bar, line, pie)
- Dropdowns to select which columns map to X and Y axes
- Live chart preview updates as selections change
- "Check" button validates selections against expected answers

### 4. Update `LessonPlayer.tsx`

Add rendering logic for `type: 'chart'` steps:
- Split layout: spreadsheet on one side, chart on the other (using the existing resizable panels library)
- For chart-building steps, show the builder UI instead of a static chart

### 5. Extend marking engine (`src/lib/marking-engine.ts`)

Add a `checkChartTask` function that validates:
- Correct chart type selected
- Correct axis mappings
- Can also check cell-based answers (reusing existing logic)

### 6. New data file: `src/data/charts-module.ts`

The full module content with lessons like:
- Lesson 1: Preparing Data for Charts (spreadsheet tasks)
- Lesson 2: Reading Charts (chart display + cell-answer tasks)
- Lesson 3: Building Your Own Charts (chart builder tasks)
- Lesson 4: Pivot Table Concepts (spreadsheet tasks simulating grouping/summarizing)

### 7. Register the new module

Update `ModulePlayer.tsx` and `StudentDashboard.tsx` to support multiple modules (currently hardcoded to `excelBasicsModule`).

## What This Looks Like for Students

1. They work with data in the familiar spreadsheet
2. They see real interactive charts rendered from that data (bar charts, pie charts, line graphs)
3. They build their own charts by selecting options, seeing instant visual feedback
4. They answer comprehension questions about charts
5. Everything stays inside the app -- no external tools needed

## Pivot Tables Approach

True pivot tables are not feasible in FortuneSheet. Instead, we teach the **concept** through guided exercises:
- "Group this sales data by region using SUM formulas"
- "Create a summary table from raw data"
- Students manually build what a pivot table would produce, which actually teaches the underlying logic better

## What We Already Have vs. What's New

| Feature | Status |
|---|---|
| Spreadsheet workspace | Already built |
| Cell-based marking | Already built |
| Formula checking | Already built |
| Recharts library | Already installed |
| Resizable panels | Already installed |
| Chart rendering component | **New** |
| Chart builder UI | **New** |
| Chart task marking | **New** |
| Multi-module support | **New** |
| Charts module content | **New** |

