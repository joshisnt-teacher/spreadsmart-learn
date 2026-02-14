import type { Module } from '@/types/lesson';

export const chartsModule: Module = {
  id: 'charts-pivots',
  title: 'Charts & Data Summaries',
  description: 'Learn how to organise data for charts, read and interpret visualisations, build your own charts, and create summary tables.',
  estimatedMinutes: 50,
  lessons: [
    // ──────────────────────────────────────────────
    // LESSON 1: Preparing Data for Charts (5 steps)
    // ──────────────────────────────────────────────
    {
      id: 'charts-lesson-1',
      order: 1,
      title: 'Preparing Data for Charts',
      description: 'Structure and summarise data so it is ready to be visualised.',
      steps: [
        {
          id: 'charts-1-1',
          order: 1,
          type: 'instruction',
          title: 'Why Data Structure Matters',
          instruction:
            'Before you can create a chart, your data needs to be **well organised**.\n\n' +
            'Good data for charting has:\n' +
            '- **Headers** in the first row describing each column\n' +
            '- **Consistent data types** — numbers in one column, text labels in another\n' +
            '- **No blank rows** in the middle of your data\n\n' +
            'Look at the example below — it has clear headers (Month, Sales) and consistent numeric values.',
          whyItMatters: 'Charts are only as good as the data behind them. Messy data creates misleading or broken charts.',
          initialSheetState: {
            name: 'Sheet1',
            row: 6,
            column: 3,
            celldata: [
              { r: 0, c: 0, v: { v: 'Month', m: 'Month', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Sales', m: 'Sales', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 'Jan', m: 'Jan' } },
              { r: 1, c: 1, v: { v: 420, m: '420' } },
              { r: 2, c: 0, v: { v: 'Feb', m: 'Feb' } },
              { r: 2, c: 1, v: { v: 380, m: '380' } },
              { r: 3, c: 0, v: { v: 'Mar', m: 'Mar' } },
              { r: 3, c: 1, v: { v: 510, m: '510' } },
              { r: 4, c: 0, v: { v: 'Apr', m: 'Apr' } },
              { r: 4, c: 1, v: { v: 470, m: '470' } },
            ],
          },
        },
        {
          id: 'charts-1-2',
          order: 2,
          type: 'task',
          title: 'Fix the Data',
          instruction:
            'This data table has some problems. Fix them so the data is chart-ready:\n\n' +
            '1. Cell **A1** is missing a header. Type **Product** in A1.\n' +
            '2. Cell **B4** is empty. It should be **85**.\n' +
            '3. Click **Check**.',
          whyItMatters: 'Missing headers and blank cells will cause chart errors.',
          initialSheetState: {
            name: 'Sheet1',
            row: 6,
            column: 3,
            celldata: [
              { r: 0, c: 1, v: { v: 'Units Sold', m: 'Units Sold', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 'Widget A', m: 'Widget A' } },
              { r: 1, c: 1, v: { v: 120, m: '120' } },
              { r: 2, c: 0, v: { v: 'Widget B', m: 'Widget B' } },
              { r: 2, c: 1, v: { v: 95, m: '95' } },
              { r: 3, c: 0, v: { v: 'Widget C', m: 'Widget C' } },
              { r: 4, c: 0, v: { v: 'Widget D', m: 'Widget D' } },
              { r: 4, c: 1, v: { v: 110, m: '110' } },
            ],
          },
          task: {
            id: 'task-charts-1-2',
            expectations: [
              { cellRef: 'A1', expectedValue: 'Product' },
              { cellRef: 'B4', expectedValue: 85 },
            ],
            editableCells: ['A1', 'B4'],
            hints: [
              'A1 needs a header — type "Product".',
              'B4 is the Units Sold for Widget C — it should be 85.',
            ],
            successMessage: 'Data is now clean and ready for charting!',
            incorrectMessage: 'Make sure A1 says "Product" and B4 contains 85.',
            xpValue: 10,
            bonusXp: 5,
          },
        },
        {
          id: 'charts-1-3',
          order: 3,
          type: 'task',
          title: 'Summarise with SUM',
          instruction:
            'This table shows ice cream sales by flavour across three days.\n\n' +
            'Calculate the **total** for each flavour:\n' +
            '1. In **E2**, type **=SUM(B2:D2)**\n' +
            '2. In **E3**, type **=SUM(B3:D3)**\n' +
            '3. In **E4**, type **=SUM(B4:D4)**\n' +
            '4. Click **Check**.',
          whyItMatters: 'Summary totals are often what you chart — not the raw daily data.',
          initialSheetState: {
            name: 'Sheet1',
            row: 6,
            column: 6,
            celldata: [
              { r: 0, c: 0, v: { v: 'Flavour', m: 'Flavour', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Mon', m: 'Mon', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 2, v: { v: 'Tue', m: 'Tue', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 3, v: { v: 'Wed', m: 'Wed', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 4, v: { v: 'Total', m: 'Total', bl: 1, bg: '#fff3cd' } },
              { r: 1, c: 0, v: { v: 'Vanilla', m: 'Vanilla' } },
              { r: 1, c: 1, v: { v: 12, m: '12' } },
              { r: 1, c: 2, v: { v: 15, m: '15' } },
              { r: 1, c: 3, v: { v: 10, m: '10' } },
              { r: 2, c: 0, v: { v: 'Chocolate', m: 'Chocolate' } },
              { r: 2, c: 1, v: { v: 20, m: '20' } },
              { r: 2, c: 2, v: { v: 18, m: '18' } },
              { r: 2, c: 3, v: { v: 22, m: '22' } },
              { r: 3, c: 0, v: { v: 'Strawberry', m: 'Strawberry' } },
              { r: 3, c: 1, v: { v: 8, m: '8' } },
              { r: 3, c: 2, v: { v: 11, m: '11' } },
              { r: 3, c: 3, v: { v: 9, m: '9' } },
            ],
          },
          task: {
            id: 'task-charts-1-3',
            expectations: [
              { cellRef: 'E2', expectedValue: 37, expectedFormula: '=SUM(B2:D2)', checkFormula: true },
              { cellRef: 'E3', expectedValue: 60, expectedFormula: '=SUM(B3:D3)', checkFormula: true },
              { cellRef: 'E4', expectedValue: 28, expectedFormula: '=SUM(B4:D4)', checkFormula: true },
            ],
            editableCells: ['E2', 'E3', 'E4'],
            hints: [
              'Use =SUM(B2:D2) to add Mon+Tue+Wed for Vanilla.',
              'Repeat the pattern for each row, changing the row number.',
            ],
            successMessage: 'Totals calculated! Chocolate is the clear winner with 60 sold.',
            almostCorrectMessage: 'Values look right but check you used SUM formulas.',
            incorrectMessage: 'Use =SUM(B2:D2) in E2, =SUM(B3:D3) in E3, =SUM(B4:D4) in E4.',
            xpValue: 15,
            bonusXp: 5,
          },
        },
        {
          id: 'charts-1-4',
          order: 4,
          type: 'instruction',
          title: 'What Makes a Good Chart?',
          instruction:
            'Now that you know how to prepare data, let\'s learn what makes a chart effective:\n\n' +
            '- **Bar charts** compare **categories** — e.g. sales by product\n' +
            '- **Line charts** show **trends over time** — e.g. monthly revenue\n' +
            '- **Pie charts** show **proportions** — e.g. market share\n' +
            '- **Area charts** are like line charts but emphasise **volume**\n\n' +
            '**Rule of thumb:**\n' +
            '- Comparing items? → **Bar chart**\n' +
            '- Showing change over time? → **Line chart**\n' +
            '- Showing parts of a whole? → **Pie chart**',
          whyItMatters: 'Choosing the right chart type makes your data story clear and convincing.',
        },

        // Quiz — Chart types
        {
          id: 'charts-1-4q',
          order: 5,
          type: 'quiz',
          title: 'Quick Check: Chart Types',
          instruction: 'Which chart type is best for showing parts of a whole?',
          quiz: {
            type: 'multiple-choice',
            options: ['Bar', 'Line', 'Pie', 'Area'],
            correctAnswer: 'Pie',
            explanation: 'A pie chart divides a circle into slices, making it easy to see how each part contributes to the total.',
          },
          task: {
            id: 'task-charts-1-4q',
            expectations: [],
            editableCells: [],
            hints: [
              'Think about a chart shaped like a circle with slices.',
              'Each slice represents a proportion of the whole.',
            ],
            successMessage: 'Correct! Pie charts show parts of a whole.',
            incorrectMessage: 'Not quite — think about which chart uses slices to show proportions.',
            xpValue: 5,
          },
        },

        {
          id: 'charts-1-5',
          order: 5,
          type: 'challenge',
          title: 'Prepare & Choose',
          instruction:
            'A shop tracked daily revenue for four departments.\n\n' +
            '1. Calculate the **weekly total** for each department:\n' +
            '   - **F2**: =SUM(B2:E2)\n' +
            '   - **F3**: =SUM(B3:E3)\n' +
            '   - **F4**: =SUM(B4:E4)\n' +
            '   - **F5**: =SUM(B5:E5)\n\n' +
            '2. Which chart type would best compare departments?\n' +
            '   Type your answer in **A8**: either **bar**, **line**, **pie**, or **area**.\n\n' +
            '💡 Think: are you comparing categories or showing a trend?',
          whyItMatters: 'Preparing data AND choosing the right chart are both essential skills.',
          initialSheetState: {
            name: 'Sheet1',
            row: 10,
            column: 7,
            celldata: [
              { r: 0, c: 0, v: { v: 'Department', m: 'Department', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Mon', m: 'Mon', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 2, v: { v: 'Tue', m: 'Tue', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 3, v: { v: 'Wed', m: 'Wed', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 4, v: { v: 'Thu', m: 'Thu', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 5, v: { v: 'Total', m: 'Total', bl: 1, bg: '#fff3cd' } },
              { r: 1, c: 0, v: { v: 'Electronics', m: 'Electronics' } },
              { r: 1, c: 1, v: { v: 450, m: '450' } },
              { r: 1, c: 2, v: { v: 520, m: '520' } },
              { r: 1, c: 3, v: { v: 380, m: '380' } },
              { r: 1, c: 4, v: { v: 490, m: '490' } },
              { r: 2, c: 0, v: { v: 'Clothing', m: 'Clothing' } },
              { r: 2, c: 1, v: { v: 310, m: '310' } },
              { r: 2, c: 2, v: { v: 280, m: '280' } },
              { r: 2, c: 3, v: { v: 350, m: '350' } },
              { r: 2, c: 4, v: { v: 290, m: '290' } },
              { r: 3, c: 0, v: { v: 'Food', m: 'Food' } },
              { r: 3, c: 1, v: { v: 620, m: '620' } },
              { r: 3, c: 2, v: { v: 580, m: '580' } },
              { r: 3, c: 3, v: { v: 640, m: '640' } },
              { r: 3, c: 4, v: { v: 610, m: '610' } },
              { r: 4, c: 0, v: { v: 'Books', m: 'Books' } },
              { r: 4, c: 1, v: { v: 180, m: '180' } },
              { r: 4, c: 2, v: { v: 210, m: '210' } },
              { r: 4, c: 3, v: { v: 190, m: '190' } },
              { r: 4, c: 4, v: { v: 200, m: '200' } },
              { r: 7, c: 0, v: { v: 'Best chart type?', m: 'Best chart type?', bl: 1, bg: '#fff3cd' } },
            ],
          },
          task: {
            id: 'task-charts-1-5',
            expectations: [
              { cellRef: 'F2', expectedValue: 1840, expectedFormula: '=SUM(B2:E2)', checkFormula: true },
              { cellRef: 'F3', expectedValue: 1230, expectedFormula: '=SUM(B3:E3)', checkFormula: true },
              { cellRef: 'F4', expectedValue: 2450, expectedFormula: '=SUM(B4:E4)', checkFormula: true },
              { cellRef: 'F5', expectedValue: 780, expectedFormula: '=SUM(B5:E5)', checkFormula: true },
              { cellRef: 'A8', expectedValue: 'bar' },
            ],
            editableCells: ['F2', 'F3', 'F4', 'F5', 'A8'],
            hints: [
              'Use =SUM(B2:E2) for each department\'s total.',
              'You\'re comparing different departments — which chart type compares categories?',
              'A bar chart is best for comparing categories side by side.',
            ],
            successMessage: '🎉 Data prepared and bar chart correctly identified! Bar charts are perfect for comparing categories.',
            incorrectMessage: 'Calculate totals with =SUM(B2:E2) etc., and type "bar" in A8.',
            xpValue: 30,
            bonusXp: 15,
          },
        },
      ],
    },

    // ──────────────────────────────────────────────
    // LESSON 2: Reading Charts (4 steps)
    // ──────────────────────────────────────────────
    {
      id: 'charts-lesson-2',
      order: 2,
      title: 'Reading Charts',
      description: 'Interpret bar, line, and pie charts to answer questions about data.',
      steps: [
        // Quiz — Axis vocabulary
        {
          id: 'charts-2-0q',
          order: 1,
          type: 'quiz',
          title: 'Quick Check: Chart Axes',
          instruction: 'What is the term for the horizontal line along the bottom of a chart?',
          quiz: {
            type: 'short-answer',
            correctAnswer: 'X-axis',
            acceptableAnswers: ['x axis', 'horizontal axis', 'x-axis', 'the x axis', 'the x-axis'],
            explanation: 'The X-axis runs horizontally (left to right) along the bottom. The Y-axis runs vertically.',
          },
          task: {
            id: 'task-charts-2-0q',
            expectations: [],
            editableCells: [],
            hints: [
              'It\'s named after a letter of the alphabet.',
              'X goes left-to-right, Y goes up-and-down.',
            ],
            successMessage: 'Correct! The X-axis runs horizontally along the bottom of a chart.',
            incorrectMessage: 'Not quite — it\'s called the X-axis (horizontal).',
            xpValue: 5,
          },
        },
        {
          id: 'charts-2-1',
          order: 1,
          type: 'chart',
          title: 'Reading a Bar Chart',
          instruction:
            'Look at the bar chart on the right. It shows **fruit sales** for a week.\n\n' +
            'Answer these questions by typing into the spreadsheet:\n\n' +
            '1. In **B7**, type the name of the **most sold** fruit.\n' +
            '2. In **B8**, type the name of the **least sold** fruit.\n' +
            '3. In **B9**, type the **total** of all fruit sold (use a SUM formula).',
          whyItMatters: 'Being able to read a chart and extract key information is a critical data literacy skill.',
          chartConfig: {
            type: 'bar',
            dataSource: 'sheet',
            xKey: 'Fruit',
            yKey: 'Sold',
            title: 'Fruit Sales This Week',
          },
          initialSheetState: {
            name: 'Sheet1',
            row: 11,
            column: 3,
            celldata: [
              { r: 0, c: 0, v: { v: 'Fruit', m: 'Fruit', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Sold', m: 'Sold', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 'Apples', m: 'Apples' } },
              { r: 1, c: 1, v: { v: 45, m: '45' } },
              { r: 2, c: 0, v: { v: 'Bananas', m: 'Bananas' } },
              { r: 2, c: 1, v: { v: 62, m: '62' } },
              { r: 3, c: 0, v: { v: 'Oranges', m: 'Oranges' } },
              { r: 3, c: 1, v: { v: 38, m: '38' } },
              { r: 4, c: 0, v: { v: 'Grapes', m: 'Grapes' } },
              { r: 4, c: 1, v: { v: 51, m: '51' } },
              { r: 6, c: 0, v: { v: 'Most sold', m: 'Most sold', bl: 1, bg: '#fff3cd' } },
              { r: 7, c: 0, v: { v: 'Least sold', m: 'Least sold', bl: 1, bg: '#fff3cd' } },
              { r: 8, c: 0, v: { v: 'Total', m: 'Total', bl: 1, bg: '#fff3cd' } },
            ],
          },
          task: {
            id: 'task-charts-2-1',
            expectations: [
              { cellRef: 'B7', expectedValue: 'Bananas' },
              { cellRef: 'B8', expectedValue: 'Oranges' },
              { cellRef: 'B9', expectedValue: 196, expectedFormula: '=SUM(B2:B5)', checkFormula: true },
            ],
            editableCells: ['B7', 'B8', 'B9'],
            hints: [
              'Look at the tallest bar — that\'s the most sold fruit.',
              'The shortest bar shows the least sold fruit.',
              'Use =SUM(B2:B5) for the total.',
            ],
            successMessage: 'Bananas lead with 62, Oranges trail with 38. Total: 196!',
            incorrectMessage: 'Check the chart: tallest bar = most sold, shortest = least sold. Use =SUM(B2:B5) for total.',
            xpValue: 15,
            bonusXp: 5,
          },
        },
        {
          id: 'charts-2-2',
          order: 2,
          type: 'chart',
          title: 'Reading a Line Chart',
          instruction:
            'This line chart shows **website visitors** over 5 months.\n\n' +
            'Answer:\n' +
            '1. In **B8**, type the month with the **highest** visitors.\n' +
            '2. In **B9**, type the **difference** between the highest and lowest months (use a formula: =MAX(B2:B6)-MIN(B2:B6)).',
          whyItMatters: 'Line charts reveal trends — understanding them helps you predict what might happen next.',
          chartConfig: {
            type: 'line',
            dataSource: 'sheet',
            xKey: 'Month',
            yKey: 'Visitors',
            title: 'Website Visitors (Jan–May)',
          },
          initialSheetState: {
            name: 'Sheet1',
            row: 11,
            column: 3,
            celldata: [
              { r: 0, c: 0, v: { v: 'Month', m: 'Month', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Visitors', m: 'Visitors', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 'Jan', m: 'Jan' } },
              { r: 1, c: 1, v: { v: 1200, m: '1200' } },
              { r: 2, c: 0, v: { v: 'Feb', m: 'Feb' } },
              { r: 2, c: 1, v: { v: 1450, m: '1450' } },
              { r: 3, c: 0, v: { v: 'Mar', m: 'Mar' } },
              { r: 3, c: 1, v: { v: 1100, m: '1100' } },
              { r: 4, c: 0, v: { v: 'Apr', m: 'Apr' } },
              { r: 4, c: 1, v: { v: 1800, m: '1800' } },
              { r: 5, c: 0, v: { v: 'May', m: 'May' } },
              { r: 5, c: 1, v: { v: 1600, m: '1600' } },
              { r: 7, c: 0, v: { v: 'Peak month', m: 'Peak month', bl: 1, bg: '#fff3cd' } },
              { r: 8, c: 0, v: { v: 'Range', m: 'Range', bl: 1, bg: '#fff3cd' } },
            ],
          },
          task: {
            id: 'task-charts-2-2',
            expectations: [
              { cellRef: 'B8', expectedValue: 'Apr' },
              { cellRef: 'B9', expectedValue: 700, expectedFormula: '=MAX(B2:B6)-MIN(B2:B6)', checkFormula: true },
            ],
            editableCells: ['B8', 'B9'],
            hints: [
              'The peak of the line chart is the highest point — which month is that?',
              'Range = MAX - MIN. Use =MAX(B2:B6)-MIN(B2:B6).',
            ],
            successMessage: 'Apr had the most visitors (1,800) with a range of 700. Nice analysis!',
            incorrectMessage: 'Type "Apr" in B8 and =MAX(B2:B6)-MIN(B2:B6) in B9.',
            xpValue: 15,
            bonusXp: 5,
          },
        },
        {
          id: 'charts-2-3',
          order: 3,
          type: 'chart',
          title: 'Reading a Pie Chart',
          instruction:
            'This pie chart shows how students get to school.\n\n' +
            'Answer:\n' +
            '1. In **B7**, type the **most common** way to get to school.\n' +
            '2. In **B8**, type the **percentage** that walk (calculate: =B3/SUM(B2:B5)*100).',
          whyItMatters: 'Pie charts show proportions — understanding them helps you see the "big picture" of how a total breaks down.',
          chartConfig: {
            type: 'pie',
            dataSource: 'sheet',
            xKey: 'Transport',
            yKey: 'Students',
            title: 'How Students Get to School',
          },
          initialSheetState: {
            name: 'Sheet1',
            row: 10,
            column: 3,
            celldata: [
              { r: 0, c: 0, v: { v: 'Transport', m: 'Transport', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Students', m: 'Students', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 'Bus', m: 'Bus' } },
              { r: 1, c: 1, v: { v: 45, m: '45' } },
              { r: 2, c: 0, v: { v: 'Walk', m: 'Walk' } },
              { r: 2, c: 1, v: { v: 30, m: '30' } },
              { r: 3, c: 0, v: { v: 'Car', m: 'Car' } },
              { r: 3, c: 1, v: { v: 15, m: '15' } },
              { r: 4, c: 0, v: { v: 'Cycle', m: 'Cycle' } },
              { r: 4, c: 1, v: { v: 10, m: '10' } },
              { r: 6, c: 0, v: { v: 'Most common', m: 'Most common', bl: 1, bg: '#fff3cd' } },
              { r: 7, c: 0, v: { v: 'Walk %', m: 'Walk %', bl: 1, bg: '#fff3cd' } },
            ],
          },
          task: {
            id: 'task-charts-2-3',
            expectations: [
              { cellRef: 'B7', expectedValue: 'Bus' },
              { cellRef: 'B8', expectedValue: 30, expectedFormula: '=B3/SUM(B2:B5)*100', checkFormula: true },
            ],
            editableCells: ['B7', 'B8'],
            hints: [
              'The largest slice of the pie is the most common transport method.',
              'Walk % = Walk students / Total students × 100.',
              'Use =B3/SUM(B2:B5)*100 in B8.',
            ],
            successMessage: 'Bus is most popular (45%) and 30% walk. Great pie chart reading!',
            incorrectMessage: 'Type "Bus" in B7 and =B3/SUM(B2:B5)*100 in B8.',
            xpValue: 15,
            bonusXp: 5,
          },
        },
        {
          id: 'charts-2-4',
          order: 4,
          type: 'challenge',
          title: 'Chart Comprehension Challenge',
          instruction:
            'A sports shop tracked sales of different items. The data and a bar chart are shown.\n\n' +
            '1. In **B8**, find the **total** sales using SUM.\n' +
            '2. In **B9**, find the **average** sales using AVERAGE.\n' +
            '3. In **B10**, type the name of the item with the **highest** sales.\n' +
            '4. In **B11**, type the **best chart type** to show these items\' share of total sales.\n\n' +
            '💡 Hint: which chart shows parts of a whole?',
          whyItMatters: 'Combining data analysis with chart interpretation is a key business skill.',
          chartConfig: {
            type: 'bar',
            dataSource: 'sheet',
            xKey: 'Item',
            yKey: 'Sales',
            title: 'Sports Shop Weekly Sales',
          },
          initialSheetState: {
            name: 'Sheet1',
            row: 13,
            column: 3,
            celldata: [
              { r: 0, c: 0, v: { v: 'Item', m: 'Item', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Sales', m: 'Sales', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 'Football', m: 'Football' } },
              { r: 1, c: 1, v: { v: 85, m: '85' } },
              { r: 2, c: 0, v: { v: 'Tennis Racket', m: 'Tennis Racket' } },
              { r: 2, c: 1, v: { v: 42, m: '42' } },
              { r: 3, c: 0, v: { v: 'Running Shoes', m: 'Running Shoes' } },
              { r: 3, c: 1, v: { v: 120, m: '120' } },
              { r: 4, c: 0, v: { v: 'Gym Bag', m: 'Gym Bag' } },
              { r: 4, c: 1, v: { v: 65, m: '65' } },
              { r: 5, c: 0, v: { v: 'Water Bottle', m: 'Water Bottle' } },
              { r: 5, c: 1, v: { v: 95, m: '95' } },
              { r: 7, c: 0, v: { v: 'Total', m: 'Total', bl: 1, bg: '#fff3cd' } },
              { r: 8, c: 0, v: { v: 'Average', m: 'Average', bl: 1, bg: '#fff3cd' } },
              { r: 9, c: 0, v: { v: 'Top item', m: 'Top item', bl: 1, bg: '#fff3cd' } },
              { r: 10, c: 0, v: { v: 'Share chart', m: 'Share chart', bl: 1, bg: '#fff3cd' } },
            ],
          },
          task: {
            id: 'task-charts-2-4',
            expectations: [
              { cellRef: 'B8', expectedValue: 407, expectedFormula: '=SUM(B2:B6)', checkFormula: true },
              { cellRef: 'B9', expectedValue: 81.4, expectedFormula: '=AVERAGE(B2:B6)', checkFormula: true, tolerancePercent: 1 },
              { cellRef: 'B10', expectedValue: 'Running Shoes' },
              { cellRef: 'B11', expectedValue: 'pie' },
            ],
            editableCells: ['B8', 'B9', 'B10', 'B11'],
            hints: [
              'Use =SUM(B2:B6) for total, =AVERAGE(B2:B6) for average.',
              'Look at the chart — the tallest bar is the top seller.',
              'To show each item\'s share of the whole, use a pie chart.',
            ],
            successMessage: '🎉 Running Shoes lead with 120 sales, and a pie chart would best show proportions!',
            incorrectMessage: 'Total=SUM(B2:B6), Average=AVERAGE(B2:B6), top item="Running Shoes", share chart="pie".',
            xpValue: 35,
            bonusXp: 15,
          },
        },
      ],
    },

    // ──────────────────────────────────────────────
    // LESSON 3: Building Your Own Charts (3 steps)
    // ──────────────────────────────────────────────
    {
      id: 'charts-lesson-3',
      order: 3,
      title: 'Building Your Own Charts',
      description: 'Choose chart types and map data to axes to create your own visualisations.',
      steps: [
        {
          id: 'charts-3-1',
          order: 1,
          type: 'instruction',
          title: 'How to Build a Chart',
          instruction:
            'To create a chart you need three things:\n\n' +
            '1. **Chart type** — bar, line, pie, or area\n' +
            '2. **X-axis** — the categories (usually text labels)\n' +
            '3. **Y-axis** — the values (usually numbers)\n\n' +
            'In the next steps, you\'ll use the **Chart Builder** panel to select these options and see the chart update live.\n\n' +
            '**Example:**\n' +
            '- Data: Month (Jan, Feb, Mar) and Sales (100, 150, 120)\n' +
            '- Chart type: Bar\n' +
            '- X-axis: Month\n' +
            '- Y-axis: Sales\n' +
            '- Result: A bar chart comparing monthly sales',
          whyItMatters: 'Knowing how to create a chart from scratch is a core spreadsheet skill used in every workplace.',
        },
        {
          id: 'charts-3-2',
          order: 2,
          type: 'chart',
          title: 'Build a Bar Chart',
          instruction:
            'Use the **Chart Builder** on the right to create a bar chart from this data.\n\n' +
            '1. Set **Chart Type** to **Bar Chart**\n' +
            '2. Set **X-Axis** to **Subject**\n' +
            '3. Set **Y-Axis** to **Score**\n' +
            '4. Click **Check** when your chart looks correct.',
          whyItMatters: 'Hands-on practice is the best way to learn chart creation.',
          chartConfig: {
            type: 'bar',
            dataSource: 'sheet',
            xKey: 'Subject',
            yKey: 'Score',
            title: 'Exam Scores by Subject',
          },
          chartTask: {
            expectedChartType: 'bar',
            expectedXKey: 'Subject',
            expectedYKey: 'Score',
          },
          initialSheetState: {
            name: 'Sheet1',
            row: 6,
            column: 3,
            celldata: [
              { r: 0, c: 0, v: { v: 'Subject', m: 'Subject', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Score', m: 'Score', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 'Maths', m: 'Maths' } },
              { r: 1, c: 1, v: { v: 78, m: '78' } },
              { r: 2, c: 0, v: { v: 'English', m: 'English' } },
              { r: 2, c: 1, v: { v: 85, m: '85' } },
              { r: 3, c: 0, v: { v: 'Science', m: 'Science' } },
              { r: 3, c: 1, v: { v: 92, m: '92' } },
              { r: 4, c: 0, v: { v: 'History', m: 'History' } },
              { r: 4, c: 1, v: { v: 71, m: '71' } },
            ],
          },
          task: {
            id: 'task-charts-3-2',
            expectations: [],
            editableCells: [],
            hints: [
              'Select "Bar Chart" from the Chart Type dropdown.',
              'Set X-Axis to "Subject" and Y-Axis to "Score".',
            ],
            successMessage: 'You built your first bar chart! It clearly shows Science scores highest.',
            incorrectMessage: 'Select Bar Chart, X-Axis = Subject, Y-Axis = Score.',
            xpValue: 20,
            bonusXp: 10,
          },
        },
        {
          id: 'charts-3-3',
          order: 3,
          type: 'chart',
          title: 'Build a Pie Chart',
          instruction:
            'Now build a **pie chart** to show how a student spends their day.\n\n' +
            '1. Set **Chart Type** to **Pie Chart**\n' +
            '2. Set **X-Axis** to **Activity**\n' +
            '3. Set **Y-Axis** to **Hours**\n' +
            '4. Click **Check**.',
          whyItMatters: 'Pie charts are ideal for showing how a total breaks into parts.',
          chartConfig: {
            type: 'pie',
            dataSource: 'sheet',
            xKey: 'Activity',
            yKey: 'Hours',
            title: 'How I Spend My Day',
          },
          chartTask: {
            expectedChartType: 'pie',
            expectedXKey: 'Activity',
            expectedYKey: 'Hours',
          },
          initialSheetState: {
            name: 'Sheet1',
            row: 7,
            column: 3,
            celldata: [
              { r: 0, c: 0, v: { v: 'Activity', m: 'Activity', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Hours', m: 'Hours', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 'School', m: 'School' } },
              { r: 1, c: 1, v: { v: 7, m: '7' } },
              { r: 2, c: 0, v: { v: 'Sleep', m: 'Sleep' } },
              { r: 2, c: 1, v: { v: 9, m: '9' } },
              { r: 3, c: 0, v: { v: 'Homework', m: 'Homework' } },
              { r: 3, c: 1, v: { v: 2, m: '2' } },
              { r: 4, c: 0, v: { v: 'Free Time', m: 'Free Time' } },
              { r: 4, c: 1, v: { v: 4, m: '4' } },
              { r: 5, c: 0, v: { v: 'Meals', m: 'Meals' } },
              { r: 5, c: 1, v: { v: 2, m: '2' } },
            ],
          },
          task: {
            id: 'task-charts-3-3',
            expectations: [],
            editableCells: [],
            hints: [
              'Select "Pie Chart" from the dropdown.',
              'X-Axis = Activity (the labels), Y-Axis = Hours (the values).',
            ],
            successMessage: '🎉 Your pie chart shows Sleep takes the biggest slice! Great job building charts.',
            incorrectMessage: 'Select Pie Chart, X-Axis = Activity, Y-Axis = Hours.',
            xpValue: 20,
            bonusXp: 10,
          },
        },
        {
          id: 'charts-3-4',
          order: 4,
          type: 'chart',
          title: 'Visualise Monthly Rainfall',
          instruction:
            'A weather station recorded average rainfall over six months.\n\n' +
            'Your task: **find the best way to visualise how rainfall changes over time.**\n\n' +
            'Think about:\n' +
            '- Is this about comparing categories or showing a **trend**?\n' +
            '- Which column has the labels? Which has the values?\n\n' +
            'Use the **Chart Builder** to set the chart type, X-axis, and Y-axis, then click **Check**.',
          whyItMatters: 'Choosing the right chart type on your own — without being told — is the real skill.',
          chartConfig: {
            type: 'line',
            dataSource: 'sheet',
            xKey: 'Month',
            yKey: 'Rainfall (mm)',
            title: 'Monthly Rainfall',
          },
          chartTask: {
            expectedChartType: 'line',
            expectedXKey: 'Month',
            expectedYKey: 'Rainfall (mm)',
          },
          initialSheetState: {
            name: 'Sheet1',
            row: 8,
            column: 3,
            celldata: [
              { r: 0, c: 0, v: { v: 'Month', m: 'Month', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Rainfall (mm)', m: 'Rainfall (mm)', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 'Jan', m: 'Jan' } },
              { r: 1, c: 1, v: { v: 78, m: '78' } },
              { r: 2, c: 0, v: { v: 'Feb', m: 'Feb' } },
              { r: 2, c: 1, v: { v: 62, m: '62' } },
              { r: 3, c: 0, v: { v: 'Mar', m: 'Mar' } },
              { r: 3, c: 1, v: { v: 55, m: '55' } },
              { r: 4, c: 0, v: { v: 'Apr', m: 'Apr' } },
              { r: 4, c: 1, v: { v: 41, m: '41' } },
              { r: 5, c: 0, v: { v: 'May', m: 'May' } },
              { r: 5, c: 1, v: { v: 35, m: '35' } },
              { r: 6, c: 0, v: { v: 'Jun', m: 'Jun' } },
              { r: 6, c: 1, v: { v: 28, m: '28' } },
            ],
          },
          task: {
            id: 'task-charts-3-4',
            expectations: [],
            editableCells: [],
            hints: [
              'The data shows values changing over time — which chart type shows trends?',
              'A line chart is best for showing change over time.',
              'X-Axis = Month (the time labels), Y-Axis = Rainfall (mm) (the values).',
            ],
            successMessage: 'A line chart is perfect here — it clearly shows rainfall decreasing from January to June!',
            incorrectMessage: 'This data shows a trend over time. Try a Line Chart with X = Month, Y = Rainfall (mm).',
            xpValue: 25,
            bonusXp: 10,
          },
        },
        {
          id: 'charts-3-5',
          order: 5,
          type: 'chart',
          title: 'Visualise Budget Spending',
          instruction:
            'A student tracked how they spent their monthly pocket money.\n\n' +
            'Your task: **choose the best chart to visualise each category\'s share of total spending.**\n\n' +
            'Think about:\n' +
            '- Are you comparing separate items, or showing **parts of a whole**?\n' +
            '- Which column contains the category names? Which has the amounts?\n\n' +
            'Set up the Chart Builder and click **Check**.',
          whyItMatters: 'Understanding when to use a pie chart vs a bar chart is a common real-world decision.',
          chartConfig: {
            type: 'pie',
            dataSource: 'sheet',
            xKey: 'Category',
            yKey: 'Amount (£)',
            title: 'Monthly Spending Breakdown',
          },
          chartTask: {
            expectedChartType: 'pie',
            expectedXKey: 'Category',
            expectedYKey: 'Amount (£)',
          },
          initialSheetState: {
            name: 'Sheet1',
            row: 7,
            column: 3,
            celldata: [
              { r: 0, c: 0, v: { v: 'Category', m: 'Category', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Amount (£)', m: 'Amount (£)', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 'Food', m: 'Food' } },
              { r: 1, c: 1, v: { v: 25, m: '25' } },
              { r: 2, c: 0, v: { v: 'Games', m: 'Games' } },
              { r: 2, c: 1, v: { v: 15, m: '15' } },
              { r: 3, c: 0, v: { v: 'Clothes', m: 'Clothes' } },
              { r: 3, c: 1, v: { v: 10, m: '10' } },
              { r: 4, c: 0, v: { v: 'Savings', m: 'Savings' } },
              { r: 4, c: 1, v: { v: 30, m: '30' } },
              { r: 5, c: 0, v: { v: 'Transport', m: 'Transport' } },
              { r: 5, c: 1, v: { v: 5, m: '5' } },
            ],
          },
          task: {
            id: 'task-charts-3-5',
            expectations: [],
            editableCells: [],
            hints: [
              'You want to show how each category contributes to the total — which chart shows parts of a whole?',
              'A pie chart shows proportions of a total.',
              'X-Axis = Category, Y-Axis = Amount (£).',
            ],
            successMessage: 'A pie chart is ideal here — Savings takes the biggest slice at £30!',
            incorrectMessage: 'You\'re showing parts of a whole. Try a Pie Chart with X = Category, Y = Amount (£).',
            xpValue: 25,
            bonusXp: 10,
          },
        },
        {
          id: 'charts-3-6',
          order: 6,
          type: 'chart',
          title: 'Chart Challenge: App Downloads',
          instruction:
            'A developer is tracking how many times their app was downloaded each week.\n\n' +
            '**Challenge:** Look at the data and decide for yourself:\n' +
            '- What is the best chart type to **show how downloads changed over the weeks**?\n' +
            '- Which column should go on each axis?\n\n' +
            'There\'s no instruction this time — use what you\'ve learnt! Set up the Chart Builder and click **Check**.',
          whyItMatters: 'In the real world, nobody tells you which chart to use — you need to figure it out from the data.',
          chartConfig: {
            type: 'area',
            dataSource: 'sheet',
            xKey: 'Week',
            yKey: 'Downloads',
            title: 'Weekly App Downloads',
          },
          chartTask: {
            expectedChartType: 'area',
            expectedXKey: 'Week',
            expectedYKey: 'Downloads',
          },
          initialSheetState: {
            name: 'Sheet1',
            row: 9,
            column: 3,
            celldata: [
              { r: 0, c: 0, v: { v: 'Week', m: 'Week', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Downloads', m: 'Downloads', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 'Week 1', m: 'Week 1' } },
              { r: 1, c: 1, v: { v: 120, m: '120' } },
              { r: 2, c: 0, v: { v: 'Week 2', m: 'Week 2' } },
              { r: 2, c: 1, v: { v: 340, m: '340' } },
              { r: 3, c: 0, v: { v: 'Week 3', m: 'Week 3' } },
              { r: 3, c: 1, v: { v: 580, m: '580' } },
              { r: 4, c: 0, v: { v: 'Week 4', m: 'Week 4' } },
              { r: 4, c: 1, v: { v: 890, m: '890' } },
              { r: 5, c: 0, v: { v: 'Week 5', m: 'Week 5' } },
              { r: 5, c: 1, v: { v: 1250, m: '1250' } },
              { r: 6, c: 0, v: { v: 'Week 6', m: 'Week 6' } },
              { r: 6, c: 1, v: { v: 1580, m: '1580' } },
              { r: 7, c: 0, v: { v: 'Week 7', m: 'Week 7' } },
              { r: 7, c: 1, v: { v: 2100, m: '2100' } },
            ],
          },
          task: {
            id: 'task-charts-3-6',
            expectations: [],
            editableCells: [],
            hints: [
              'The data shows growth over time — and the volume of downloads matters.',
              'An area chart is like a line chart but emphasises the volume underneath.',
              'X-Axis = Week, Y-Axis = Downloads.',
            ],
            successMessage: '🎉 An area chart perfectly shows the growing volume of downloads over time! You\'ve mastered chart building.',
            incorrectMessage: 'This data shows growing volume over time. Try an Area Chart with X = Week, Y = Downloads.',
            xpValue: 35,
            bonusXp: 15,
          },
        },
      ],
    },

    // ──────────────────────────────────────────────
    // LESSON 4: Data Summary Tables (4 steps)
    // ──────────────────────────────────────────────
    {
      id: 'charts-lesson-4',
      order: 4,
      title: 'Data Summary Tables',
      description: 'Learn to create summary tables that group and summarise raw data — the concept behind pivot tables.',
      steps: [
        {
          id: 'charts-4-1',
          order: 1,
          type: 'instruction',
          title: 'What Is a Summary Table?',
          instruction:
            'A **summary table** (or **pivot table**) takes raw data and **groups** it to show patterns.\n\n' +
            'For example, if you have individual sales records:\n' +
            '| Salesperson | Amount |\n|---|---|\n| Ava | 50 |\n| Liam | 30 |\n| Ava | 40 |\n| Liam | 60 |\n\n' +
            'A summary table would show:\n' +
            '| Salesperson | Total |\n|---|---|\n| Ava | 90 |\n| Liam | 90 |\n\n' +
            'We\'ll use **SUMIF** to build summary tables. SUMIF adds values only when a condition is met:\n' +
            '`=SUMIF(range, criteria, sum_range)`',
          whyItMatters: 'Summary tables are the foundation of data analysis. They turn hundreds of rows into meaningful insights.',
        },
        {
          id: 'charts-4-2',
          order: 2,
          type: 'task',
          title: 'Your First SUMIF',
          instruction:
            'This table shows sales by different salespeople. Create a summary using SUMIF.\n\n' +
            '1. In **E2**, calculate Ava\'s total: **=SUMIF(A2:A7,"Ava",B2:B7)**\n' +
            '2. In **E3**, calculate Liam\'s total: **=SUMIF(A2:A7,"Liam",B2:B7)**\n' +
            '3. In **E4**, calculate Zoe\'s total: **=SUMIF(A2:A7,"Zoe",B2:B7)**\n' +
            '4. Click **Check**.',
          whyItMatters: 'SUMIF is one of the most powerful functions for creating summaries from raw data.',
          initialSheetState: {
            name: 'Sheet1',
            row: 9,
            column: 6,
            celldata: [
              { r: 0, c: 0, v: { v: 'Salesperson', m: 'Salesperson', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Amount', m: 'Amount', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 'Ava', m: 'Ava' } },
              { r: 1, c: 1, v: { v: 50, m: '50' } },
              { r: 2, c: 0, v: { v: 'Liam', m: 'Liam' } },
              { r: 2, c: 1, v: { v: 30, m: '30' } },
              { r: 3, c: 0, v: { v: 'Zoe', m: 'Zoe' } },
              { r: 3, c: 1, v: { v: 45, m: '45' } },
              { r: 4, c: 0, v: { v: 'Ava', m: 'Ava' } },
              { r: 4, c: 1, v: { v: 40, m: '40' } },
              { r: 5, c: 0, v: { v: 'Liam', m: 'Liam' } },
              { r: 5, c: 1, v: { v: 60, m: '60' } },
              { r: 6, c: 0, v: { v: 'Zoe', m: 'Zoe' } },
              { r: 6, c: 1, v: { v: 35, m: '35' } },
              // Summary table
              { r: 0, c: 3, v: { v: '', m: '' } },
              { r: 0, c: 4, v: { v: 'Summary', m: 'Summary', bl: 1, bg: '#d4edda' } },
              { r: 1, c: 3, v: { v: 'Ava', m: 'Ava', bl: 1 } },
              { r: 2, c: 3, v: { v: 'Liam', m: 'Liam', bl: 1 } },
              { r: 3, c: 3, v: { v: 'Zoe', m: 'Zoe', bl: 1 } },
              { r: 0, c: 4, v: { v: 'Total', m: 'Total', bl: 1, bg: '#fff3cd' } },
            ],
          },
          task: {
            id: 'task-charts-4-2',
            expectations: [
              { cellRef: 'E2', expectedValue: 90, expectedFormula: '=SUMIF(A2:A7,"Ava",B2:B7)', checkFormula: true },
              { cellRef: 'E3', expectedValue: 90, expectedFormula: '=SUMIF(A2:A7,"Liam",B2:B7)', checkFormula: true },
              { cellRef: 'E4', expectedValue: 80, expectedFormula: '=SUMIF(A2:A7,"Zoe",B2:B7)', checkFormula: true },
            ],
            editableCells: ['E2', 'E3', 'E4'],
            hints: [
              'SUMIF(range, criteria, sum_range) — range is where the names are, criteria is the name, sum_range is the amounts.',
              'For Ava: =SUMIF(A2:A7,"Ava",B2:B7)',
              'Change "Ava" to "Liam" or "Zoe" for the other rows.',
            ],
            successMessage: 'Ava: 90, Liam: 90, Zoe: 80 — your first summary table is complete!',
            almostCorrectMessage: 'Values look right but make sure you used SUMIF formulas.',
            incorrectMessage: 'Use =SUMIF(A2:A7,"Name",B2:B7) for each salesperson.',
            xpValue: 25,
            bonusXp: 10,
          },
        },

        // Quiz — SUMIF vocabulary
        {
          id: 'charts-4-1q',
          order: 2,
          type: 'quiz',
          title: 'Quick Check: Conditional Functions',
          instruction: 'Which function adds values only when a specific condition is met?',
          quiz: {
            type: 'multiple-choice',
            options: ['SUM', 'AVERAGE', 'SUMIF', 'COUNT'],
            correctAnswer: 'SUMIF',
            explanation: 'SUMIF adds up values only for rows that match a condition — e.g. =SUMIF(A:A,"Ava",B:B) totals only Ava\'s amounts.',
          },
          task: {
            id: 'task-charts-4-1q',
            expectations: [],
            editableCells: [],
            hints: [
              'It combines "SUM" with a condition (an "IF").',
              'The function name literally says what it does: SUM + IF.',
            ],
            successMessage: 'Correct! SUMIF adds values conditionally.',
            incorrectMessage: 'Not quite — look for a function that combines adding with a condition.',
            xpValue: 5,
          },
        },

        {
          id: 'charts-4-3',
          order: 3,
          type: 'task',
          title: 'COUNTIF for Counts',
          instruction:
            'Now let\'s count how many sales each person made using **COUNTIF**.\n\n' +
            'COUNTIF counts cells matching a criterion:\n' +
            '`=COUNTIF(range, criteria)`\n\n' +
            '1. In **F2**, count Ava\'s sales: **=COUNTIF(A2:A7,"Ava")**\n' +
            '2. In **F3**, count Liam\'s sales: **=COUNTIF(A2:A7,"Liam")**\n' +
            '3. In **F4**, count Zoe\'s sales: **=COUNTIF(A2:A7,"Zoe")**\n' +
            '4. Click **Check**.',
          whyItMatters: 'COUNTIF lets you count how many times something appears — essential for grouping data.',
          initialSheetState: {
            name: 'Sheet1',
            row: 9,
            column: 7,
            celldata: [
              { r: 0, c: 0, v: { v: 'Salesperson', m: 'Salesperson', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Amount', m: 'Amount', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 'Ava', m: 'Ava' } },
              { r: 1, c: 1, v: { v: 50, m: '50' } },
              { r: 2, c: 0, v: { v: 'Liam', m: 'Liam' } },
              { r: 2, c: 1, v: { v: 30, m: '30' } },
              { r: 3, c: 0, v: { v: 'Zoe', m: 'Zoe' } },
              { r: 3, c: 1, v: { v: 45, m: '45' } },
              { r: 4, c: 0, v: { v: 'Ava', m: 'Ava' } },
              { r: 4, c: 1, v: { v: 40, m: '40' } },
              { r: 5, c: 0, v: { v: 'Liam', m: 'Liam' } },
              { r: 5, c: 1, v: { v: 60, m: '60' } },
              { r: 6, c: 0, v: { v: 'Zoe', m: 'Zoe' } },
              { r: 6, c: 1, v: { v: 35, m: '35' } },
              // Summary table (pre-filled totals)
              { r: 0, c: 4, v: { v: 'Total', m: 'Total', bl: 1, bg: '#d4edda' } },
              { r: 0, c: 5, v: { v: 'Count', m: 'Count', bl: 1, bg: '#fff3cd' } },
              { r: 1, c: 3, v: { v: 'Ava', m: 'Ava', bl: 1 } },
              { r: 1, c: 4, v: { v: 90, m: '90', f: '=SUMIF(A2:A7,"Ava",B2:B7)' } },
              { r: 2, c: 3, v: { v: 'Liam', m: 'Liam', bl: 1 } },
              { r: 2, c: 4, v: { v: 90, m: '90', f: '=SUMIF(A2:A7,"Liam",B2:B7)' } },
              { r: 3, c: 3, v: { v: 'Zoe', m: 'Zoe', bl: 1 } },
              { r: 3, c: 4, v: { v: 80, m: '80', f: '=SUMIF(A2:A7,"Zoe",B2:B7)' } },
            ],
          },
          task: {
            id: 'task-charts-4-3',
            expectations: [
              { cellRef: 'F2', expectedValue: 2, expectedFormula: '=COUNTIF(A2:A7,"Ava")', checkFormula: true },
              { cellRef: 'F3', expectedValue: 2, expectedFormula: '=COUNTIF(A2:A7,"Liam")', checkFormula: true },
              { cellRef: 'F4', expectedValue: 2, expectedFormula: '=COUNTIF(A2:A7,"Zoe")', checkFormula: true },
            ],
            editableCells: ['F2', 'F3', 'F4'],
            hints: [
              'COUNTIF counts how many cells match a criterion.',
              'For Ava: =COUNTIF(A2:A7,"Ava")',
              'Each person made 2 sales in this dataset.',
            ],
            successMessage: 'Each person made 2 sales. Your summary table now has totals AND counts!',
            almostCorrectMessage: 'Values correct but make sure you used COUNTIF formulas.',
            incorrectMessage: 'Use =COUNTIF(A2:A7,"Name") for each salesperson.',
            xpValue: 20,
            bonusXp: 10,
          },
        },
        {
          id: 'charts-4-4',
          order: 4,
          type: 'challenge',
          title: 'Full Summary Challenge',
          instruction:
            'A school recorded test results by class. Build a complete summary table!\n\n' +
            '1. In **E2**, total marks for **8A**: =SUMIF(A2:A9,"8A",B2:B9)\n' +
            '2. In **E3**, total marks for **8B**: =SUMIF(A2:A9,"8B",B2:B9)\n' +
            '3. In **F2**, count students in **8A**: =COUNTIF(A2:A9,"8A")\n' +
            '4. In **F3**, count students in **8B**: =COUNTIF(A2:A9,"8B")\n' +
            '5. In **G2**, average for 8A: =E2/F2\n' +
            '6. In **G3**, average for 8B: =E3/F3\n' +
            '7. Click **Check**.\n\n' +
            '💡 This is exactly what a pivot table does automatically!',
          whyItMatters: 'Building a summary table manually teaches you the logic that pivot tables automate.',
          initialSheetState: {
            name: 'Sheet1',
            row: 11,
            column: 8,
            celldata: [
              { r: 0, c: 0, v: { v: 'Class', m: 'Class', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Mark', m: 'Mark', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: '8A', m: '8A' } },
              { r: 1, c: 1, v: { v: 72, m: '72' } },
              { r: 2, c: 0, v: { v: '8B', m: '8B' } },
              { r: 2, c: 1, v: { v: 68, m: '68' } },
              { r: 3, c: 0, v: { v: '8A', m: '8A' } },
              { r: 3, c: 1, v: { v: 85, m: '85' } },
              { r: 4, c: 0, v: { v: '8B', m: '8B' } },
              { r: 4, c: 1, v: { v: 79, m: '79' } },
              { r: 5, c: 0, v: { v: '8A', m: '8A' } },
              { r: 5, c: 1, v: { v: 91, m: '91' } },
              { r: 6, c: 0, v: { v: '8B', m: '8B' } },
              { r: 6, c: 1, v: { v: 74, m: '74' } },
              { r: 7, c: 0, v: { v: '8A', m: '8A' } },
              { r: 7, c: 1, v: { v: 66, m: '66' } },
              { r: 8, c: 0, v: { v: '8B', m: '8B' } },
              { r: 8, c: 1, v: { v: 82, m: '82' } },
              // Summary table headers
              { r: 0, c: 3, v: { v: 'Class', m: 'Class', bl: 1, bg: '#d4edda' } },
              { r: 0, c: 4, v: { v: 'Total', m: 'Total', bl: 1, bg: '#fff3cd' } },
              { r: 0, c: 5, v: { v: 'Count', m: 'Count', bl: 1, bg: '#fff3cd' } },
              { r: 0, c: 6, v: { v: 'Average', m: 'Average', bl: 1, bg: '#fff3cd' } },
              { r: 1, c: 3, v: { v: '8A', m: '8A', bl: 1 } },
              { r: 2, c: 3, v: { v: '8B', m: '8B', bl: 1 } },
            ],
          },
          task: {
            id: 'task-charts-4-4',
            expectations: [
              { cellRef: 'E2', expectedValue: 314, expectedFormula: '=SUMIF(A2:A9,"8A",B2:B9)', checkFormula: true },
              { cellRef: 'E3', expectedValue: 303, expectedFormula: '=SUMIF(A2:A9,"8B",B2:B9)', checkFormula: true },
              { cellRef: 'F2', expectedValue: 4, expectedFormula: '=COUNTIF(A2:A9,"8A")', checkFormula: true },
              { cellRef: 'F3', expectedValue: 4, expectedFormula: '=COUNTIF(A2:A9,"8B")', checkFormula: true },
              { cellRef: 'G2', expectedValue: 78.5, expectedFormula: '=E2/F2', checkFormula: true },
              { cellRef: 'G3', expectedValue: 75.75, expectedFormula: '=E3/F3', checkFormula: true },
            ],
            editableCells: ['E2', 'E3', 'F2', 'F3', 'G2', 'G3'],
            hints: [
              'Use SUMIF to total marks by class, COUNTIF to count students.',
              'Average = Total / Count, so G2 = =E2/F2.',
              '8A total: 72+85+91+66 = 314. 8B total: 68+79+74+82 = 303.',
            ],
            successMessage: '🎉 Summary table complete! 8A averages 78.5 vs 8B\'s 75.75. This is exactly what a pivot table does!',
            almostCorrectMessage: 'Values look right — check that all formulas use SUMIF, COUNTIF, and division.',
            incorrectMessage: 'SUMIF for totals, COUNTIF for counts, =E/F for averages.',
            xpValue: 40,
            bonusXp: 20,
          },
        },
      ],
    },
  ],
};
