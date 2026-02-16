import type { Module } from '@/types/lesson';

export const excelBasicsModule: Module = {
  id: 'excel-basics',
  title: 'Introduction to Excel',
  description: 'Learn how spreadsheets are structured, enter and edit data, use built-in functions, format numbers, use IF logic, and sort and filter data.',
  estimatedMinutes: 75,
  bannerUrl: 'https://ctfxhxqhvszadozamqkg.supabase.co/storage/v1/object/public/module-banners/excel-basics-banner.png',
  lessons: [
    // ──────────────────────────────────────────────
    // LESSON 1: Navigating a Spreadsheet (7 steps)
    // ──────────────────────────────────────────────
    {
      id: 'lesson-1',
      order: 1,
      title: 'Navigating a Spreadsheet',
      description: 'Learn how spreadsheets are structured, enter data, write basic formulas, and use the fill handle.',
      steps: [
        // Step 1 — Instruction: What Is a Spreadsheet?
        {
          id: 'step-1-1',
          order: 1,
          type: 'instruction',
          title: 'What Is a Spreadsheet?',
          instruction:
            'A spreadsheet is a grid made up of **rows** and **columns**.\n\n' +
            '- **Columns** are labelled with letters: A, B, C…\n' +
            '- **Rows** are labelled with numbers: 1, 2, 3…\n' +
            '- Each box is called a **cell**.\n' +
            '- Every cell has an address (e.g. **A1**, **B3**, **C7**).\n\n' +
            'Spreadsheets are used to **organise data**, **perform calculations**, and **analyse patterns**.\n\n' +
            'Look at the example table below. Cell **B2** contains the value **75**.',
          whyItMatters: 'Understanding the grid is essential — every piece of data lives in a cell, and every formula references cells by their address.',
          initialSheetState: {
            name: 'Sheet1',
            row: 5,
            column: 4,
            celldata: [
              { r: 0, c: 0, v: { v: 'Name', m: 'Name', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Maths', m: 'Maths', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 2, v: { v: 'English', m: 'English', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 'Ava', m: 'Ava' } },
              { r: 1, c: 1, v: { v: 75, m: '75' } },
              { r: 1, c: 2, v: { v: 82, m: '82' } },
              { r: 2, c: 0, v: { v: 'Liam', m: 'Liam' } },
              { r: 2, c: 1, v: { v: 68, m: '68' } },
              { r: 2, c: 2, v: { v: 74, m: '74' } },
              { r: 3, c: 0, v: { v: 'Zoe', m: 'Zoe' } },
              { r: 3, c: 1, v: { v: 91, m: '91' } },
              { r: 3, c: 2, v: { v: 88, m: '88' } },
            ],
          },
        },

        // Quiz — Vocabulary check
        {
          id: 'step-1-1q',
          order: 2,
          type: 'quiz',
          title: 'Quick Check: Columns',
          instruction: 'What is the name given to a group of cells that run vertically?',
          quiz: {
            type: 'short-answer',
            correctAnswer: 'Column',
            acceptableAnswers: ['Columns', 'a column'],
            explanation: 'A column is a vertical group of cells, labelled with letters (A, B, C…).',
          },
          task: {
            id: 'task-1-1q',
            expectations: [],
            editableCells: [],
            hints: [
              'Think about the vertical lines in a spreadsheet.',
              'They are labelled with letters: A, B, C…',
            ],
            successMessage: 'Correct! Columns run vertically and are labelled with letters.',
            incorrectMessage: 'Not quite — think about what runs vertically in a spreadsheet.',
            xpValue: 5,
          },
        },

        // Step 2 — Task: Resizing Rows and Columns
        {
          id: 'step-1-2',
          order: 2,
          type: 'task',
          title: 'Resizing Rows and Columns',
          instruction:
            'Sometimes data in a cell is too long to see. You can **resize columns** to make the data easier to read.\n\n' +
            'To widen a column, hover your mouse over the **border between two column letters** (e.g. between A and B) at the top. Your cursor will change to a resize arrow. Then **click and drag** to the right.\n\n' +
            'You can do the same for rows by dragging the border between row numbers.\n\n' +
            'Column A below is too narrow to read the full message. Widen it, then type the hidden message into cell **B2**.',
          whyItMatters: 'Being able to adjust column widths helps you view and work with data of all sizes — a skill you\'ll use constantly.',
          initialSheetState: {
            name: 'Sheet1',
            row: 4,
            column: 3,
            config: { columnlen: { '0': 40 } },
            celldata: [
              { r: 0, c: 0, v: { v: 'Hidden Message', m: 'Hidden Message', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Type the message here', m: 'Type the message here', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 'Spreadsheets are awesome', m: 'Spreadsheets are awesome' } },
            ],
          },
          task: {
            id: 'task-1-2',
            expectations: [
              { cellRef: 'B2', expectedValue: 'Spreadsheets are awesome' },
            ],
            editableCells: ['B2'],
            hints: [
              'Hover your mouse over the border between the A and B column headers at the top of the sheet.',
              'When the cursor changes to a resize arrow (↔), click and drag to the right to widen column A.',
              'The hidden message is: Spreadsheets are awesome',
            ],
            successMessage: 'You found the hidden message! Now you know how to resize columns.',
            incorrectMessage: 'Widen column A to read the full message, then type it exactly into B2.',
            xpValue: 10,
            bonusXp: 5,
          },
        },

        // Step 3 — Task: Identifying Cells
        {
          id: 'step-1-3',
          order: 3,
          type: 'task',
          title: 'Identifying Cells',
          instruction:
            'Let\'s practise selecting and editing cells.\n\n' +
            '1. Click on cell **B2** and type **80**. Press Enter.\n' +
            '2. Click on cell **C3** and type **77**. Press Enter.\n' +
            '3. Click **Check**.',
          whyItMatters: 'Selecting and entering data is the foundation of everything in a spreadsheet.',
          initialSheetState: {
            name: 'Sheet1',
            row: 5,
            column: 4,
            celldata: [
              { r: 0, c: 0, v: { v: 'Name', m: 'Name', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Maths', m: 'Maths', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 2, v: { v: 'English', m: 'English', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 'Ava', m: 'Ava' } },
              { r: 1, c: 1, v: { v: 75, m: '75' } },
              { r: 1, c: 2, v: { v: 82, m: '82' } },
              { r: 2, c: 0, v: { v: 'Liam', m: 'Liam' } },
              { r: 2, c: 1, v: { v: 68, m: '68' } },
              { r: 2, c: 2, v: { v: 74, m: '74' } },
              { r: 3, c: 0, v: { v: 'Zoe', m: 'Zoe' } },
              { r: 3, c: 1, v: { v: 91, m: '91' } },
              { r: 3, c: 2, v: { v: 88, m: '88' } },
            ],
          },
          task: {
            id: 'task-1-3',
            expectations: [
              { cellRef: 'B2', expectedValue: 80 },
              { cellRef: 'C3', expectedValue: 77 },
            ],
            editableCells: ['B2', 'C3'],
            hints: [
              'Click on cell B2 (column B, row 2) and type 80.',
              'Cell C3 is column C, row 3 — type 77 there.',
            ],
            successMessage: 'Well done! You edited two cells correctly.',
            incorrectMessage: 'Make sure B2 contains 80 and C3 contains 77.',
            xpValue: 10,
            bonusXp: 5,
          },
        },

        // Step 4 — Instruction: How Excel Calculates
        {
          id: 'step-1-4',
          order: 4,
          type: 'instruction',
          title: 'How Excel Calculates',
          instruction:
            'If you type a plain number like `42`, the spreadsheet just stores it.\n\n' +
            'But if you start with an **equals sign** (`=`), it becomes a **formula** and the spreadsheet calculates the result automatically.\n\n' +
            'You can use these operators:\n' +
            '- **+** Addition\n' +
            '- **-** Subtraction\n' +
            '- **\\*** Multiplication\n' +
            '- **/** Division\n\n' +
            'Example: if A1 = 4 and B1 = 5, then **=A1+B1** shows **9**.',
          whyItMatters: 'Formulas are what make spreadsheets powerful — they calculate results automatically and update when the data changes.',
          initialSheetState: {
            name: 'Sheet1',
            row: 4,
            column: 4,
            celldata: [
              { r: 0, c: 0, v: { v: 'A', m: 'A', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'B', m: 'B', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 2, v: { v: 'Result', m: 'Result', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 4, m: '4' } },
              { r: 1, c: 1, v: { v: 5, m: '5' } },
              { r: 1, c: 2, v: { v: 9, m: '9', f: '=A2+B2' } },
            ],
          },
        },

        // Step 5 — Task: Your First Formula
        {
          id: 'step-1-5',
          order: 5,
          type: 'task',
          title: 'Your First Formula',
          instruction:
            'This table shows items with a **Qty** (quantity) and **Price**.\n\n' +
            'Calculate the **Total** for each item by multiplying Qty × Price:\n' +
            '1. In **D2**, type **=B2*C2** and press Enter.\n' +
            '2. In **D3**, type **=B3*C3** and press Enter.\n' +
            '3. In **D4**, type **=B4*C4** and press Enter.\n' +
            '4. Click **Check**.',
          whyItMatters: 'Writing formulas that reference other cells is a core spreadsheet skill.',
          initialSheetState: {
            name: 'Sheet1',
            row: 6,
            column: 5,
            celldata: [
              { r: 0, c: 0, v: { v: 'Item', m: 'Item', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Qty', m: 'Qty', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 2, v: { v: 'Price', m: 'Price', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 3, v: { v: 'Total', m: 'Total', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 'Pens', m: 'Pens' } },
              { r: 1, c: 1, v: { v: 4, m: '4' } },
              { r: 1, c: 2, v: { v: 2, m: '2' } },
              { r: 2, c: 0, v: { v: 'Books', m: 'Books' } },
              { r: 2, c: 1, v: { v: 3, m: '3' } },
              { r: 2, c: 2, v: { v: 5, m: '5' } },
              { r: 3, c: 0, v: { v: 'Rulers', m: 'Rulers' } },
              { r: 3, c: 1, v: { v: 6, m: '6' } },
              { r: 3, c: 2, v: { v: 1, m: '1' } },
            ],
          },
          task: {
            id: 'task-1-5',
            expectations: [
              { cellRef: 'D2', expectedValue: 8, expectedFormula: '=B2*C2', checkFormula: true },
              { cellRef: 'D3', expectedValue: 15, expectedFormula: '=B3*C3', checkFormula: true },
              { cellRef: 'D4', expectedValue: 6, expectedFormula: '=B4*C4', checkFormula: true },
            ],
            editableCells: ['D2', 'D3', 'D4'],
            hints: [
              'Start each formula with = (e.g. =B2*C2).',
              'Make sure you use the * symbol for multiplication.',
              'D2 should be =B2*C2, D3 should be =B3*C3, D4 should be =B4*C4.',
            ],
            successMessage: 'Excellent! You wrote three formulas that calculate automatically.',
            almostCorrectMessage: 'The values look right but make sure you used formulas, not typed numbers.',
            incorrectMessage: 'Use =B2*C2 in D2, =B3*C3 in D3, and =B4*C4 in D4.',
            xpValue: 20,
            bonusXp: 10,
          },
        },

        // Step 6 — Instruction: Using the Fill Handle
        {
          id: 'step-1-6',
          order: 6,
          type: 'instruction',
          title: 'Using the Fill Handle',
          instruction:
            'Instead of rewriting the same formula for every row, you can **drag to copy** it.\n\n' +
            '1. Click on a cell that already has a formula.\n' +
            '2. Look for the small **square** in the bottom-right corner of the cell.\n' +
            '3. **Click and drag** it down to fill the cells below.\n\n' +
            'The spreadsheet automatically **adjusts the cell references**. For example, if D2 contains `=B2*C2`, dragging down to D3 creates `=B3*C3`.',
          whyItMatters: 'The fill handle saves huge amounts of time — imagine a dataset with 1,000 rows!',
        },

        // Step 7 — Task: Use Fill Down
        {
          id: 'step-1-7',
          order: 7,
          type: 'task',
          title: 'Use Fill Down',
          instruction:
            'Cell **D2** already has the formula `=B2*C2`.\n\n' +
            '1. Click on **D2**.\n' +
            '2. Grab the fill handle (small square at the bottom-right) and **drag down** to **D4**.\n' +
            '3. Click **Check** to verify the formulas were copied correctly.',
          whyItMatters: 'Using fill down is one of the most essential spreadsheet shortcuts.',
          initialSheetState: {
            name: 'Sheet1',
            row: 6,
            column: 5,
            celldata: [
              { r: 0, c: 0, v: { v: 'Item', m: 'Item', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Qty', m: 'Qty', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 2, v: { v: 'Price', m: 'Price', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 3, v: { v: 'Total', m: 'Total', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 'Pens', m: 'Pens' } },
              { r: 1, c: 1, v: { v: 4, m: '4' } },
              { r: 1, c: 2, v: { v: 2, m: '2' } },
              { r: 1, c: 3, v: { v: 8, m: '8', f: '=B2*C2' } },
              { r: 2, c: 0, v: { v: 'Books', m: 'Books' } },
              { r: 2, c: 1, v: { v: 3, m: '3' } },
              { r: 2, c: 2, v: { v: 5, m: '5' } },
              { r: 3, c: 0, v: { v: 'Rulers', m: 'Rulers' } },
              { r: 3, c: 1, v: { v: 6, m: '6' } },
              { r: 3, c: 2, v: { v: 1, m: '1' } },
            ],
          },
          task: {
            id: 'task-1-7',
            expectations: [
              { cellRef: 'D2', expectedValue: 8, expectedFormula: '=B2*C2', checkFormula: true },
              { cellRef: 'D3', expectedValue: 15, expectedFormula: '=B3*C3', checkFormula: true },
              { cellRef: 'D4', expectedValue: 6, expectedFormula: '=B4*C4', checkFormula: true },
            ],
            editableCells: ['D2', 'D3', 'D4'],
            hints: [
              'Click on D2 first, then look for the small square at the bottom-right corner.',
              'Drag the fill handle down from D2 to D4.',
              'If dragging doesn\'t work, you can type =B3*C3 in D3 and =B4*C4 in D4 manually.',
            ],
            successMessage: 'Great work! The fill handle copied and adjusted the formulas automatically.',
            almostCorrectMessage: 'Values are correct but check the formulas — they should reference the correct rows.',
            incorrectMessage: 'D3 should contain =B3*C3 (value 15) and D4 should contain =B4*C4 (value 6).',
            xpValue: 15,
            bonusXp: 5,
          },
        },
      ],
    },

    // ──────────────────────────────────────────────
    // LESSON 2: Built-in Functions (5 steps) — MOVED BEFORE FORMATTING
    // ──────────────────────────────────────────────
    {
      id: 'lesson-2',
      order: 2,
      title: 'Built-in Functions',
      description: 'Use SUM, AVERAGE, MIN, MAX, and COUNT to analyse data.',
      steps: [
        // Step 1 — Instruction: SUM and AVERAGE
        {
          id: 'step-2-1',
          order: 1,
          type: 'instruction',
          title: 'SUM and AVERAGE',
          instruction:
            'Functions are built-in shortcuts for common calculations.\n\n' +
            '**SUM** adds up all the numbers in a range:\n' +
            '`=SUM(B2:B5)` adds B2 + B3 + B4 + B5.\n\n' +
            '**AVERAGE** calculates the mean:\n' +
            '`=AVERAGE(B2:B5)` adds them up and divides by 4.\n\n' +
            'The **colon** (`:`) means "from this cell **to** that cell".',
          whyItMatters: 'SUM and AVERAGE are the two most-used functions in the world. They save time and reduce errors.',
        },

        // Quiz — Formula symbol
        {
          id: 'step-2-1q',
          order: 2,
          type: 'quiz',
          title: 'Quick Check: Formulas',
          instruction: 'What symbol must every formula in a spreadsheet start with?',
          quiz: {
            type: 'short-answer',
            correctAnswer: '=',
            acceptableAnswers: ['equals', 'equals sign', 'equal sign', 'equal'],
            explanation: 'The equals sign (=) tells the spreadsheet that you\'re entering a formula, not plain text.',
          },
          task: {
            id: 'task-2-1q',
            expectations: [],
            editableCells: [],
            hints: [
              'It\'s a single character you type before any function name.',
              'You\'ve seen it in formulas like =SUM(B2:B5).',
            ],
            successMessage: 'Correct! Every formula starts with = (equals sign).',
            incorrectMessage: 'Not quite — look at the start of any formula like =SUM(...).',
            xpValue: 5,
          },
        },

        // Step 2 — Task: Sports Day Totals (replaces "Total Sales")
        {
          id: 'step-2-2',
          order: 2,
          type: 'task',
          title: 'Sports Day Totals',
          instruction:
            'This table shows points scored by your house team in four Sports Day events.\n\n' +
            '1. In **B6**, calculate the **total** points using SUM.\n' +
            '2. In **B7**, calculate the **average** points per event using AVERAGE.\n' +
            '3. Click **Check**.',
          whyItMatters: 'Totals and averages are the foundation of data analysis.',
          initialSheetState: {
            name: 'Sheet1',
            row: 9,
            column: 3,
            celldata: [
              { r: 0, c: 0, v: { v: 'Event', m: 'Event', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Points', m: 'Points', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: '100m Sprint', m: '100m Sprint' } },
              { r: 1, c: 1, v: { v: 45, m: '45' } },
              { r: 2, c: 0, v: { v: 'Long Jump', m: 'Long Jump' } },
              { r: 2, c: 1, v: { v: 38, m: '38' } },
              { r: 3, c: 0, v: { v: 'Relay Race', m: 'Relay Race' } },
              { r: 3, c: 1, v: { v: 52, m: '52' } },
              { r: 4, c: 0, v: { v: 'Shot Put', m: 'Shot Put' } },
              { r: 4, c: 1, v: { v: 29, m: '29' } },
              { r: 5, c: 0, v: { v: 'Total', m: 'Total', bl: 1, bg: '#fff3cd' } },
              { r: 6, c: 0, v: { v: 'Average', m: 'Average', bl: 1, bg: '#fff3cd' } },
            ],
          },
          task: {
            id: 'task-2-2',
            expectations: [
              { cellRef: 'B6', expectedValue: 164, expectedFormula: '=SUM(B2:B5)', checkFormula: true },
              { cellRef: 'B7', expectedValue: 41, expectedFormula: '=AVERAGE(B2:B5)', checkFormula: true },
            ],
            editableCells: ['B6', 'B7'],
            hints: [
              'In B6, type =SUM(B2:B5) to add all four event scores.',
              'In B7, type =AVERAGE(B2:B5) to calculate the mean.',
              'Make sure you include the colon : between B2 and B5.',
            ],
            successMessage: 'Total is 164 and average is 41 points per event — nice work!',
            almostCorrectMessage: 'Values look right but check you used the SUM and AVERAGE functions.',
            incorrectMessage: 'Use =SUM(B2:B5) in B6 and =AVERAGE(B2:B5) in B7.',
            xpValue: 20,
            bonusXp: 10,
          },
        },

        // Step 3 — Instruction: MIN, MAX, and COUNT
        {
          id: 'step-2-3',
          order: 3,
          type: 'instruction',
          title: 'MIN, MAX and COUNT',
          instruction:
            'Three more useful functions:\n\n' +
            '**MIN** finds the **smallest** number in a range:\n' +
            '`=MIN(B2:B5)` → the lowest value.\n\n' +
            '**MAX** finds the **largest** number:\n' +
            '`=MAX(B2:B5)` → the highest value.\n\n' +
            '**COUNT** counts how many **numbers** are in a range:\n' +
            '`=COUNT(B2:B5)` → 4 (there are 4 numbers).',
          whyItMatters: 'MIN, MAX, and COUNT help you quickly understand the shape of your data without scrolling through it.',
        },

        // Step 4 — Task: Sports Day Extremes (replaces "Find the Extremes")
        {
          id: 'step-2-4',
          order: 4,
          type: 'task',
          title: 'Sports Day Extremes',
          instruction:
            'Using the same Sports Day scores:\n\n' +
            '1. In **B8**, find the **highest** event score using MAX.\n' +
            '2. In **B9**, find the **lowest** event score using MIN.\n' +
            '3. In **B10**, **count** how many events there are using COUNT.\n' +
            '4. Click **Check**.',
          whyItMatters: 'Identifying highs, lows, and counts is the first step in any data analysis.',
          initialSheetState: {
            name: 'Sheet1',
            row: 12,
            column: 3,
            celldata: [
              { r: 0, c: 0, v: { v: 'Event', m: 'Event', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Points', m: 'Points', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: '100m Sprint', m: '100m Sprint' } },
              { r: 1, c: 1, v: { v: 45, m: '45' } },
              { r: 2, c: 0, v: { v: 'Long Jump', m: 'Long Jump' } },
              { r: 2, c: 1, v: { v: 38, m: '38' } },
              { r: 3, c: 0, v: { v: 'Relay Race', m: 'Relay Race' } },
              { r: 3, c: 1, v: { v: 52, m: '52' } },
              { r: 4, c: 0, v: { v: 'Shot Put', m: 'Shot Put' } },
              { r: 4, c: 1, v: { v: 29, m: '29' } },
              // Pre-filled from previous task
              { r: 5, c: 0, v: { v: 'Total', m: 'Total', bl: 1, bg: '#d4edda' } },
              { r: 5, c: 1, v: { v: 164, m: '164', f: '=SUM(B2:B5)' } },
              { r: 6, c: 0, v: { v: 'Average', m: 'Average', bl: 1, bg: '#d4edda' } },
              { r: 6, c: 1, v: { v: 41, m: '41', f: '=AVERAGE(B2:B5)' } },
              // Labels for new answer cells
              { r: 7, c: 0, v: { v: 'Highest', m: 'Highest', bl: 1, bg: '#fff3cd' } },
              { r: 8, c: 0, v: { v: 'Lowest', m: 'Lowest', bl: 1, bg: '#fff3cd' } },
              { r: 9, c: 0, v: { v: 'Count', m: 'Count', bl: 1, bg: '#fff3cd' } },
            ],
          },
          task: {
            id: 'task-2-4',
            expectations: [
              { cellRef: 'B8', expectedValue: 52, expectedFormula: '=MAX(B2:B5)', checkFormula: true },
              { cellRef: 'B9', expectedValue: 29, expectedFormula: '=MIN(B2:B5)', checkFormula: true },
              { cellRef: 'B10', expectedValue: 4, expectedFormula: '=COUNT(B2:B5)', checkFormula: true },
            ],
            editableCells: ['B8', 'B9', 'B10'],
            hints: [
              'B8 should use =MAX(B2:B5) to find the highest score.',
              'B9 should use =MIN(B2:B5) to find the lowest score.',
              'B10 should use =COUNT(B2:B5) to count how many events there are.',
            ],
            successMessage: 'Highest is 52 (Relay Race), lowest is 29 (Shot Put), and there are 4 events — well done!',
            almostCorrectMessage: 'Values are correct but make sure you used the MAX, MIN, and COUNT functions.',
            incorrectMessage: 'Use =MAX(B2:B5) in B8, =MIN(B2:B5) in B9, and =COUNT(B2:B5) in B10.',
            xpValue: 20,
            bonusXp: 10,
          },
        },

        // Step 5 — Challenge: Gaming High Scores Analysis (replaces "School Canteen Analysis")
        {
          id: 'step-2-5',
          order: 5,
          type: 'challenge',
          title: 'Gaming High Scores',
          instruction:
            'Your friend group tracked their high scores across four games this week. Analyse the data!\n\n' +
            '1. Calculate the **Total Score** for each person (sum of all games):\n' +
            '   - **E2**: `=SUM(B2:D2)`\n' +
            '   - **E3**: `=SUM(B3:D3)`\n' +
            '   - **E4**: `=SUM(B4:D4)`\n' +
            '   - **E5**: `=SUM(B5:D5)`\n\n' +
            '2. In **B7**, find the **highest** score in Game 1 using MAX.\n' +
            '3. In **E7**, calculate the **average** total score using AVERAGE.\n\n' +
            '💡 **Reflection:** Who is the best all-round gamer?',
          whyItMatters: 'Combining formulas and functions to answer real questions is what makes spreadsheets so powerful.',
          initialSheetState: {
            name: 'Sheet1',
            row: 9,
            column: 6,
            celldata: [
              // Headers
              { r: 0, c: 0, v: { v: 'Player', m: 'Player', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Game 1', m: 'Game 1', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 2, v: { v: 'Game 2', m: 'Game 2', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 3, v: { v: 'Game 3', m: 'Game 3', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 4, v: { v: 'Total', m: 'Total', bl: 1, bg: '#e8f0fe' } },
              // Data
              { r: 1, c: 0, v: { v: 'Ava', m: 'Ava' } },
              { r: 1, c: 1, v: { v: 1200, m: '1200' } },
              { r: 1, c: 2, v: { v: 980, m: '980' } },
              { r: 1, c: 3, v: { v: 1450, m: '1450' } },
              { r: 2, c: 0, v: { v: 'Liam', m: 'Liam' } },
              { r: 2, c: 1, v: { v: 850, m: '850' } },
              { r: 2, c: 2, v: { v: 1100, m: '1100' } },
              { r: 2, c: 3, v: { v: 920, m: '920' } },
              { r: 3, c: 0, v: { v: 'Zoe', m: 'Zoe' } },
              { r: 3, c: 1, v: { v: 1500, m: '1500' } },
              { r: 3, c: 2, v: { v: 1300, m: '1300' } },
              { r: 3, c: 3, v: { v: 1100, m: '1100' } },
              { r: 4, c: 0, v: { v: 'Noah', m: 'Noah' } },
              { r: 4, c: 1, v: { v: 990, m: '990' } },
              { r: 4, c: 2, v: { v: 1050, m: '1050' } },
              { r: 4, c: 3, v: { v: 1200, m: '1200' } },
              // Summary labels
              { r: 6, c: 0, v: { v: 'Best Game 1', m: 'Best Game 1', bl: 1, bg: '#fff3cd' } },
              { r: 6, c: 4, v: { v: 'Avg Total', m: 'Avg Total', bl: 1, bg: '#fff3cd' } },
            ],
          },
          task: {
            id: 'task-2-5',
            expectations: [
              { cellRef: 'E2', expectedValue: 3630, expectedFormula: '=SUM(B2:D2)', checkFormula: true },
              { cellRef: 'E3', expectedValue: 2870, expectedFormula: '=SUM(B3:D3)', checkFormula: true },
              { cellRef: 'E4', expectedValue: 3900, expectedFormula: '=SUM(B4:D4)', checkFormula: true },
              { cellRef: 'E5', expectedValue: 3240, expectedFormula: '=SUM(B5:D5)', checkFormula: true },
              { cellRef: 'B7', expectedValue: 1500, expectedFormula: '=MAX(B2:B5)', checkFormula: true },
              { cellRef: 'E7', expectedValue: 3410, expectedFormula: '=AVERAGE(E2:E5)', checkFormula: true },
            ],
            editableCells: ['E2', 'E3', 'E4', 'E5', 'B7', 'E7'],
            hints: [
              'Total = sum of all three games. In E2, type =SUM(B2:D2).',
              'For best Game 1 score, use =MAX(B2:B5) in B7.',
              'Average total uses =AVERAGE(E2:E5) in E7.',
            ],
            successMessage: '🎉 Analysis complete! Zoe has the highest total (3,900) — she\'s the best all-round gamer!',
            almostCorrectMessage: 'Values look right — double-check that you used formulas and functions, not typed numbers.',
            incorrectMessage: 'Calculate each total with =SUM(B:D), best Game 1 with =MAX(B2:B5), and avg total with =AVERAGE(E2:E5).',
            xpValue: 40,
            bonusXp: 20,
          },
        },
      ],
    },

    // ──────────────────────────────────────────────
    // LESSON 3: Cell Formatting & Number Types (6 steps) — MOVED AFTER FUNCTIONS
    // ──────────────────────────────────────────────
    {
      id: 'lesson-formatting',
      order: 3,
      title: 'Cell Formatting & Number Types',
      description: 'Learn how to format numbers as currency, percentages, and decimals — and understand date formats.',
      steps: [
        // Step 1 — Instruction: Why Formatting Matters
        {
          id: 'step-fmt-1',
          order: 1,
          type: 'instruction',
          title: 'Why Formatting Matters',
          instruction:
            'Numbers in a spreadsheet can mean different things:\n\n' +
            '- **3.5** could be a price (£3.50), a percentage (3.5%), or just a number.\n' +
            '- **0.85** could mean 85% on a test.\n' +
            '- **45000** could be a date!\n\n' +
            'Formatting tells Excel **how to display** a number — the stored value stays the same, but it *looks* different.\n\n' +
            'Common formats include:\n' +
            '- **Currency** — £3.50, $12.00\n' +
            '- **Percentage** — 85%, 42.5%\n' +
            '- **Number** — controlling decimal places (3.1 vs 3.14 vs 3.142)\n' +
            '- **Date** — 14/02/2026, Feb 14, 2026',
          whyItMatters: 'Without formatting, your data can be confusing or misleading. A well-formatted spreadsheet is easier to read and less likely to cause mistakes.',
          initialSheetState: {
            name: 'Sheet1',
            row: 6,
            column: 4,
            celldata: [
              { r: 0, c: 0, v: { v: 'Raw Value', m: 'Raw Value', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'As Currency', m: 'As Currency', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 2, v: { v: 'As Percentage', m: 'As Percentage', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 3, v: { v: 'As Decimal (1dp)', m: 'As Decimal (1dp)', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 3.5, m: '3.5' } },
              { r: 1, c: 1, v: { v: '£3.50', m: '£3.50' } },
              { r: 1, c: 2, v: { v: '350%', m: '350%' } },
              { r: 1, c: 3, v: { v: '3.5', m: '3.5' } },
              { r: 2, c: 0, v: { v: 0.85, m: '0.85' } },
              { r: 2, c: 1, v: { v: '£0.85', m: '£0.85' } },
              { r: 2, c: 2, v: { v: '85%', m: '85%' } },
              { r: 2, c: 3, v: { v: '0.9', m: '0.9' } },
              { r: 3, c: 0, v: { v: 12, m: '12' } },
              { r: 3, c: 1, v: { v: '£12.00', m: '£12.00' } },
              { r: 3, c: 2, v: { v: '1200%', m: '1200%' } },
              { r: 3, c: 3, v: { v: '12.0', m: '12.0' } },
            ],
          },
        },

        // Step 2 — Quiz: Percentage conversion
        {
          id: 'step-fmt-2',
          order: 2,
          type: 'quiz',
          title: 'Quick Check: Percentages',
          instruction: 'A student scored 17 out of 20 on a test. What is their score as a percentage?',
          quiz: {
            type: 'short-answer',
            correctAnswer: '85%',
            acceptableAnswers: ['85', '85.0%', '85.0', '0.85'],
            explanation: '17 ÷ 20 = 0.85, which is 85%. To convert a fraction to a percentage, divide and multiply by 100.',
          },
          task: {
            id: 'task-fmt-2',
            expectations: [],
            editableCells: [],
            hints: [
              'Divide the score by the total: 17 ÷ 20.',
              'Multiply by 100 to get a percentage.',
            ],
            successMessage: 'Correct! 17 ÷ 20 = 0.85 = 85%.',
            incorrectMessage: 'Try dividing 17 by 20 and multiplying by 100.',
            xpValue: 5,
          },
        },

        // Step 3 — Task: Canteen Price List (Currency)
        {
          id: 'step-fmt-3',
          order: 3,
          type: 'task',
          title: 'Canteen Price List',
          instruction:
            'The school canteen needs a price list. The prices are stored as plain numbers.\n\n' +
            'Your job is to calculate the **total cost** if a student buys one of each item.\n\n' +
            '1. In **B6**, use `=SUM(B2:B5)` to calculate the total.\n' +
            '2. In **C6**, type the total as a currency value with **£** and **two decimal places** (e.g. £6.50).\n' +
            '3. Click **Check**.',
          whyItMatters: 'Currency values should always show two decimal places so £3 displays as £3.00 — this avoids confusion.',
          initialSheetState: {
            name: 'Sheet1',
            row: 8,
            column: 4,
            celldata: [
              { r: 0, c: 0, v: { v: 'Item', m: 'Item', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Price', m: 'Price', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 2, v: { v: 'Formatted', m: 'Formatted', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 'Sandwich', m: 'Sandwich' } },
              { r: 1, c: 1, v: { v: 2.5, m: '2.5' } },
              { r: 1, c: 2, v: { v: '£2.50', m: '£2.50' } },
              { r: 2, c: 0, v: { v: 'Juice', m: 'Juice' } },
              { r: 2, c: 1, v: { v: 1.2, m: '1.2' } },
              { r: 2, c: 2, v: { v: '£1.20', m: '£1.20' } },
              { r: 3, c: 0, v: { v: 'Cookie', m: 'Cookie' } },
              { r: 3, c: 1, v: { v: 0.8, m: '0.8' } },
              { r: 3, c: 2, v: { v: '£0.80', m: '£0.80' } },
              { r: 4, c: 0, v: { v: 'Fruit', m: 'Fruit' } },
              { r: 4, c: 1, v: { v: 0.5, m: '0.5' } },
              { r: 4, c: 2, v: { v: '£0.50', m: '£0.50' } },
              { r: 5, c: 0, v: { v: 'Total', m: 'Total', bl: 1, bg: '#fff3cd' } },
            ],
          },
          task: {
            id: 'task-fmt-3',
            expectations: [
              { cellRef: 'B6', expectedValue: 5, expectedFormula: '=SUM(B2:B5)', checkFormula: true },
              { cellRef: 'C6', expectedValue: '£5.00' },
            ],
            editableCells: ['B6', 'C6'],
            hints: [
              'In B6, type =SUM(B2:B5) to add the prices.',
              'In C6, type the total with a £ sign and two decimal places: £5.00.',
              'The total of 2.5 + 1.2 + 0.8 + 0.5 = 5.00.',
            ],
            successMessage: 'Well done! The total is £5.00. Notice how "5" and "£5.00" mean the same thing but the formatted version is much clearer.',
            almostCorrectMessage: 'Check that C6 has the £ sign and two decimal places (e.g. £5.00).',
            incorrectMessage: 'Use =SUM(B2:B5) in B6. In C6, type £5.00 (with the pound sign and two decimal places).',
            xpValue: 15,
            bonusXp: 5,
          },
        },

        // Step 4 — Task: Test Score Percentages
        {
          id: 'step-fmt-4',
          order: 4,
          type: 'task',
          title: 'Test Score Percentages',
          instruction:
            'These students took a maths test out of **40 marks**.\n\n' +
            'Calculate each student\'s **percentage** by dividing their score by 40 and multiplying by 100:\n\n' +
            '1. In **C2**, type `=B2/40*100`\n' +
            '2. In **C3**, type `=B3/40*100`\n' +
            '3. In **C4**, type `=B4/40*100`\n' +
            '4. In **C5**, type `=B5/40*100`\n' +
            '5. Click **Check**.',
          whyItMatters: 'Converting raw scores to percentages lets you compare results fairly — even when tests have different totals.',
          initialSheetState: {
            name: 'Sheet1',
            row: 7,
            column: 4,
            celldata: [
              { r: 0, c: 0, v: { v: 'Student', m: 'Student', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Score (/40)', m: 'Score (/40)', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 2, v: { v: 'Percentage', m: 'Percentage', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 'Ava', m: 'Ava' } },
              { r: 1, c: 1, v: { v: 34, m: '34' } },
              { r: 2, c: 0, v: { v: 'Liam', m: 'Liam' } },
              { r: 2, c: 1, v: { v: 28, m: '28' } },
              { r: 3, c: 0, v: { v: 'Zoe', m: 'Zoe' } },
              { r: 3, c: 1, v: { v: 37, m: '37' } },
              { r: 4, c: 0, v: { v: 'Noah', m: 'Noah' } },
              { r: 4, c: 1, v: { v: 22, m: '22' } },
            ],
          },
          task: {
            id: 'task-fmt-4',
            expectations: [
              { cellRef: 'C2', expectedValue: 85, expectedFormula: '=B2/40*100', checkFormula: true },
              { cellRef: 'C3', expectedValue: 70, expectedFormula: '=B3/40*100', checkFormula: true },
              { cellRef: 'C4', expectedValue: 92.5, expectedFormula: '=B4/40*100', checkFormula: true },
              { cellRef: 'C5', expectedValue: 55, expectedFormula: '=B5/40*100', checkFormula: true },
            ],
            editableCells: ['C2', 'C3', 'C4', 'C5'],
            hints: [
              'The formula is =B2/40*100 — divide the score by the total, then multiply by 100.',
              'Ava scored 34/40 = 85%.',
              'C2 = 85, C3 = 70, C4 = 92.5, C5 = 55.',
            ],
            successMessage: '🎉 Great work! Ava got 85%, Liam 70%, Zoe 92.5%, and Noah 55%. Percentages make comparison easy!',
            almostCorrectMessage: 'Values look right — make sure you used formulas (=B2/40*100) not typed numbers.',
            incorrectMessage: 'Use =B2/40*100 in C2, =B3/40*100 in C3, and so on for each student.',
            xpValue: 20,
            bonusXp: 10,
          },
        },

        // Step 5 — Instruction: Decimal Places & ROUND
        {
          id: 'step-fmt-5',
          order: 5,
          type: 'instruction',
          title: 'Controlling Decimal Places',
          instruction:
            'Sometimes calculations give you long decimal numbers like **3.333333**.\n\n' +
            'You can use the **ROUND** function to control how many decimal places are shown:\n\n' +
            '`=ROUND(value, decimal_places)`\n\n' +
            'Examples:\n' +
            '- `=ROUND(3.333, 1)` → **3.3** (1 decimal place)\n' +
            '- `=ROUND(3.333, 2)` → **3.33** (2 decimal places)\n' +
            '- `=ROUND(3.333, 0)` → **3** (no decimal places)\n\n' +
            'You can also **nest** formulas:\n' +
            '`=ROUND(B2/3, 2)` calculates B2 ÷ 3 and rounds to 2 decimal places.',
          whyItMatters: 'Rounding makes numbers easier to read and more appropriate — you wouldn\'t say a sandwich costs £2.333333!',
          initialSheetState: {
            name: 'Sheet1',
            row: 4,
            column: 4,
            celldata: [
              { r: 0, c: 0, v: { v: 'Value', m: 'Value', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'ROUND(x, 0)', m: 'ROUND(x, 0)', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 2, v: { v: 'ROUND(x, 1)', m: 'ROUND(x, 1)', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 3, v: { v: 'ROUND(x, 2)', m: 'ROUND(x, 2)', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 3.14159, m: '3.14159' } },
              { r: 1, c: 1, v: { v: 3, m: '3' } },
              { r: 1, c: 2, v: { v: 3.1, m: '3.1' } },
              { r: 1, c: 3, v: { v: 3.14, m: '3.14' } },
              { r: 2, c: 0, v: { v: 7.666, m: '7.666' } },
              { r: 2, c: 1, v: { v: 8, m: '8' } },
              { r: 2, c: 2, v: { v: 7.7, m: '7.7' } },
              { r: 2, c: 3, v: { v: 7.67, m: '7.67' } },
            ],
          },
        },

        // Step 6 — Challenge: Splitting a Bill
        {
          id: 'step-fmt-6',
          order: 6,
          type: 'challenge',
          title: 'Splitting the Canteen Bill',
          instruction:
            'Three friends bought lunch together. The prices are listed below.\n\n' +
            '1. In **B5**, calculate the **total** using `=SUM(B2:B4)`.\n' +
            '2. In **B6**, calculate each person\'s share by dividing the total by 3.\n' +
            '   Use `=B5/3`.\n' +
            '3. In **B7**, round each person\'s share to **2 decimal places** using ROUND.\n' +
            '   Use `=ROUND(B5/3, 2)`.\n\n' +
            '💡 **Reflection:** Why is the rounded answer better for money than the unrounded one?',
          whyItMatters: 'When dealing with money, you must round to 2 decimal places — you can\'t pay £2.833333!',
          initialSheetState: {
            name: 'Sheet1',
            row: 9,
            column: 3,
            celldata: [
              { r: 0, c: 0, v: { v: 'Item', m: 'Item', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Price', m: 'Price', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 'Pizza', m: 'Pizza' } },
              { r: 1, c: 1, v: { v: 3.5, m: '3.5' } },
              { r: 2, c: 0, v: { v: 'Chips', m: 'Chips' } },
              { r: 2, c: 1, v: { v: 2, m: '2' } },
              { r: 3, c: 0, v: { v: 'Drinks', m: 'Drinks' } },
              { r: 3, c: 1, v: { v: 3, m: '3' } },
              { r: 4, c: 0, v: { v: 'Total', m: 'Total', bl: 1, bg: '#fff3cd' } },
              { r: 5, c: 0, v: { v: 'Each (÷3)', m: 'Each (÷3)', bl: 1, bg: '#fff3cd' } },
              { r: 6, c: 0, v: { v: 'Each (rounded)', m: 'Each (rounded)', bl: 1, bg: '#fff3cd' } },
            ],
          },
          task: {
            id: 'task-fmt-6',
            expectations: [
              { cellRef: 'B5', expectedValue: 8.5, expectedFormula: '=SUM(B2:B4)', checkFormula: true },
              { cellRef: 'B6', expectedFormula: '=B5/3', checkFormula: true, tolerancePercent: 1 },
              { cellRef: 'B7', expectedValue: 2.83, expectedFormula: '=ROUND(B5/3,2)', checkFormula: true },
            ],
            editableCells: ['B5', 'B6', 'B7'],
            hints: [
              'Start with =SUM(B2:B4) in B5 to get the total.',
              'In B6, type =B5/3 to divide the total by 3 friends.',
              'In B7, use =ROUND(B5/3, 2) to round to 2 decimal places.',
            ],
            successMessage: '🎉 Each person pays £2.83! The ROUND function makes it a proper money amount instead of £2.8333…',
            almostCorrectMessage: 'Check that B7 uses ROUND with 2 decimal places.',
            incorrectMessage: 'B5 = =SUM(B2:B4), B6 = =B5/3, B7 = =ROUND(B5/3, 2).',
            xpValue: 30,
            bonusXp: 15,
          },
        },
      ],
    },

    // ──────────────────────────────────────────────
    // LESSON 4: IF Functions (5 steps) — NEW LESSON
    // ──────────────────────────────────────────────
    {
      id: 'lesson-if',
      order: 4,
      title: 'IF Functions & Logic',
      description: 'Use the IF function to make decisions in your spreadsheet — from simple pass/fail to grade boundaries.',
      steps: [
        // Step 1 — Instruction: What is IF?
        {
          id: 'step-if-1',
          order: 1,
          type: 'instruction',
          title: 'What Does IF Do?',
          instruction:
            'The **IF** function lets your spreadsheet **make decisions**.\n\n' +
            'It checks whether something is true or false, and gives a different answer for each:\n\n' +
            '`=IF(condition, value_if_true, value_if_false)`\n\n' +
            'For example:\n' +
            '`=IF(B2>=50, "Pass", "Fail")`\n\n' +
            'This checks if B2 is 50 or more:\n' +
            '- If **yes** → shows **"Pass"**\n' +
            '- If **no** → shows **"Fail"**\n\n' +
            'The condition can use: **>** (greater than), **<** (less than), **>=** (greater than or equal), **<=** (less than or equal), **=** (equals).',
          whyItMatters: 'IF is one of the most powerful functions in any spreadsheet. It lets you automate decisions instead of doing them manually.',
          initialSheetState: {
            name: 'Sheet1',
            row: 5,
            column: 3,
            celldata: [
              { r: 0, c: 0, v: { v: 'Student', m: 'Student', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Score', m: 'Score', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 2, v: { v: 'Result', m: 'Result', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 'Ava', m: 'Ava' } },
              { r: 1, c: 1, v: { v: 72, m: '72' } },
              { r: 1, c: 2, v: { v: 'Pass', m: 'Pass' } },
              { r: 2, c: 0, v: { v: 'Liam', m: 'Liam' } },
              { r: 2, c: 1, v: { v: 38, m: '38' } },
              { r: 2, c: 2, v: { v: 'Fail', m: 'Fail' } },
              { r: 3, c: 0, v: { v: 'Zoe', m: 'Zoe' } },
              { r: 3, c: 1, v: { v: 50, m: '50' } },
              { r: 3, c: 2, v: { v: 'Pass', m: 'Pass' } },
            ],
          },
        },

        // Step 2 — Task: Pass or Fail
        {
          id: 'step-if-2',
          order: 2,
          type: 'task',
          title: 'Pass or Fail',
          instruction:
            'These students took a science test. The pass mark is **50**.\n\n' +
            'Use the IF function to show "Pass" or "Fail" for each student:\n\n' +
            '1. In **C2**, type `=IF(B2>=50,"Pass","Fail")`\n' +
            '2. In **C3**, type `=IF(B3>=50,"Pass","Fail")`\n' +
            '3. In **C4**, type `=IF(B4>=50,"Pass","Fail")`\n' +
            '4. In **C5**, type `=IF(B5>=50,"Pass","Fail")`\n' +
            '5. Click **Check**.',
          whyItMatters: 'Automating pass/fail decisions saves time and avoids human error — imagine marking 200 students!',
          initialSheetState: {
            name: 'Sheet1',
            row: 7,
            column: 4,
            celldata: [
              { r: 0, c: 0, v: { v: 'Student', m: 'Student', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Score', m: 'Score', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 2, v: { v: 'Result', m: 'Result', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 'Ava', m: 'Ava' } },
              { r: 1, c: 1, v: { v: 65, m: '65' } },
              { r: 2, c: 0, v: { v: 'Liam', m: 'Liam' } },
              { r: 2, c: 1, v: { v: 42, m: '42' } },
              { r: 3, c: 0, v: { v: 'Zoe', m: 'Zoe' } },
              { r: 3, c: 1, v: { v: 78, m: '78' } },
              { r: 4, c: 0, v: { v: 'Noah', m: 'Noah' } },
              { r: 4, c: 1, v: { v: 49, m: '49' } },
            ],
          },
          task: {
            id: 'task-if-2',
            expectations: [
              { cellRef: 'C2', expectedValue: 'Pass', expectedFormula: '=IF(B2>=50,"Pass","Fail")', checkFormula: true },
              { cellRef: 'C3', expectedValue: 'Fail', expectedFormula: '=IF(B3>=50,"Pass","Fail")', checkFormula: true },
              { cellRef: 'C4', expectedValue: 'Pass', expectedFormula: '=IF(B4>=50,"Pass","Fail")', checkFormula: true },
              { cellRef: 'C5', expectedValue: 'Fail', expectedFormula: '=IF(B5>=50,"Pass","Fail")', checkFormula: true },
            ],
            editableCells: ['C2', 'C3', 'C4', 'C5'],
            hints: [
              'The formula is =IF(B2>=50,"Pass","Fail") — make sure to include the quote marks around Pass and Fail.',
              'Ava scored 65 which is ≥ 50, so she passes.',
              'Noah scored 49 which is < 50, so he fails.',
            ],
            successMessage: '🎉 Well done! Ava and Zoe pass, Liam and Noah fail. The IF function checked each score automatically.',
            almostCorrectMessage: 'The results look right — make sure you used the IF formula, not typed text.',
            incorrectMessage: 'Use =IF(B2>=50,"Pass","Fail") in C2 and the same pattern for each row.',
            xpValue: 20,
            bonusXp: 10,
          },
        },

        // Step 3 — Instruction: Nested IF
        {
          id: 'step-if-3',
          order: 3,
          type: 'instruction',
          title: 'Nested IF: Multiple Outcomes',
          instruction:
            'Sometimes you need **more than two outcomes**. You can put an IF inside another IF — this is called **nesting**.\n\n' +
            'Example — grade boundaries:\n' +
            '`=IF(B2>=70, "Distinction", IF(B2>=50, "Merit", "Fail"))`\n\n' +
            'How it works:\n' +
            '1. Is the score **70 or more**? → "Distinction"\n' +
            '2. Otherwise, is it **50 or more**? → "Merit"\n' +
            '3. Otherwise → "Fail"\n\n' +
            '⚠️ **Important:** Always check the **highest boundary first** and work downwards. Each IF has its own set of brackets.',
          whyItMatters: 'Nested IFs let you create grade scales, pricing tiers, and any multi-level decision — a skill used in schools, businesses, and beyond.',
          initialSheetState: {
            name: 'Sheet1',
            row: 5,
            column: 3,
            celldata: [
              { r: 0, c: 0, v: { v: 'Score', m: 'Score', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Grade', m: 'Grade', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 85, m: '85' } },
              { r: 1, c: 1, v: { v: 'Distinction', m: 'Distinction' } },
              { r: 2, c: 0, v: { v: 60, m: '60' } },
              { r: 2, c: 1, v: { v: 'Merit', m: 'Merit' } },
              { r: 3, c: 0, v: { v: 35, m: '35' } },
              { r: 3, c: 1, v: { v: 'Fail', m: 'Fail' } },
            ],
          },
        },

        // Step 4 — Challenge: Grade Boundaries
        {
          id: 'step-if-4',
          order: 4,
          type: 'challenge',
          title: 'Grade Boundaries',
          instruction:
            'Use a **nested IF** to assign grades based on these boundaries:\n\n' +
            '| Score | Grade |\n|---|---|\n| 70+ | Distinction |\n| 50–69 | Merit |\n| 40–49 | Pass |\n| Below 40 | Fail |\n\n' +
            'The formula for each cell is:\n' +
            '`=IF(B2>=70,"Distinction",IF(B2>=50,"Merit",IF(B2>=40,"Pass","Fail")))`\n\n' +
            'Enter this formula in **C2**, **C3**, **C4**, and **C5**.',
          whyItMatters: 'Grade boundaries are used in every school and exam board. Automating them removes human error.',
          initialSheetState: {
            name: 'Sheet1',
            row: 7,
            column: 4,
            celldata: [
              { r: 0, c: 0, v: { v: 'Student', m: 'Student', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Score', m: 'Score', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 2, v: { v: 'Grade', m: 'Grade', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 'Ava', m: 'Ava' } },
              { r: 1, c: 1, v: { v: 82, m: '82' } },
              { r: 2, c: 0, v: { v: 'Liam', m: 'Liam' } },
              { r: 2, c: 1, v: { v: 55, m: '55' } },
              { r: 3, c: 0, v: { v: 'Zoe', m: 'Zoe' } },
              { r: 3, c: 1, v: { v: 44, m: '44' } },
              { r: 4, c: 0, v: { v: 'Noah', m: 'Noah' } },
              { r: 4, c: 1, v: { v: 31, m: '31' } },
            ],
          },
          task: {
            id: 'task-if-4',
            expectations: [
              { cellRef: 'C2', expectedValue: 'Distinction', expectedFormula: '=IF(B2>=70,"Distinction",IF(B2>=50,"Merit",IF(B2>=40,"Pass","Fail")))', checkFormula: true },
              { cellRef: 'C3', expectedValue: 'Merit', expectedFormula: '=IF(B3>=70,"Distinction",IF(B3>=50,"Merit",IF(B3>=40,"Pass","Fail")))', checkFormula: true },
              { cellRef: 'C4', expectedValue: 'Pass', expectedFormula: '=IF(B4>=70,"Distinction",IF(B4>=50,"Merit",IF(B4>=40,"Pass","Fail")))', checkFormula: true },
              { cellRef: 'C5', expectedValue: 'Fail', expectedFormula: '=IF(B5>=70,"Distinction",IF(B5>=50,"Merit",IF(B5>=40,"Pass","Fail")))', checkFormula: true },
            ],
            editableCells: ['C2', 'C3', 'C4', 'C5'],
            hints: [
              'Start with the highest boundary: =IF(B2>=70,"Distinction", ...)',
              'Inside the first IF\'s false branch, add another IF for Merit: IF(B2>=50,"Merit", ...)',
              'The full formula is: =IF(B2>=70,"Distinction",IF(B2>=50,"Merit",IF(B2>=40,"Pass","Fail")))',
            ],
            successMessage: '🎉 Excellent! Ava gets Distinction, Liam gets Merit, Zoe gets Pass, Noah gets Fail. You\'ve mastered nested IFs!',
            almostCorrectMessage: 'The grades look right — make sure you used the nested IF formula, not typed text.',
            incorrectMessage: 'Use =IF(B2>=70,"Distinction",IF(B2>=50,"Merit",IF(B2>=40,"Pass","Fail"))) in each cell.',
            xpValue: 35,
            bonusXp: 15,
          },
        },

        // Step 5 — Quiz: IF concepts
        {
          id: 'step-if-5',
          order: 5,
          type: 'quiz',
          title: 'IF Function Check',
          instruction: 'In the formula =IF(B2>=50,"Pass","Fail"), what does the spreadsheet show if B2 contains 50?',
          quiz: {
            type: 'multiple-choice',
            options: ['Pass', 'Fail', 'Error', '50'],
            correctAnswer: 'Pass',
            explanation: 'The condition is B2>=50, which means "greater than or equal to 50". Since B2 is exactly 50, the condition is TRUE, so it shows "Pass".',
          },
          task: {
            id: 'task-if-5',
            expectations: [],
            editableCells: [],
            hints: [
              'Pay attention to the >= symbol — it means "greater than or equal to".',
              '50 is equal to 50, so >= is TRUE.',
            ],
            successMessage: 'Correct! >= means "greater than or equal to", so 50 meets the condition.',
            incorrectMessage: 'Remember: >= means "greater than OR equal to". 50 is equal to 50, so the condition is true.',
            xpValue: 5,
          },
        },
      ],
    },

    // ──────────────────────────────────────────────
    // LESSON 5: Sorting and Filtering (8 steps) — EXPANDED
    // ──────────────────────────────────────────────
    {
      id: 'lesson-3',
      order: 5,
      title: 'Sorting and Filtering',
      description: 'Learn how to sort data in order and filter to show only what you need.',
      steps: [
        // Step 1 — Instruction: Sorting Data
        {
          id: 'step-3-1',
          order: 1,
          type: 'instruction',
          title: 'Sorting Data',
          instruction:
            '**Sorting** rearranges your data into a specific order:\n\n' +
            '- **Smallest to largest** (ascending) — e.g. 1, 2, 3\n' +
            '- **Largest to smallest** (descending) — e.g. 3, 2, 1\n' +
            '- **A–Z** or **Z–A** for text\n\n' +
            'Sorting helps you spot patterns quickly — like who scored highest or which product sold the most.\n\n' +
            '**Before sorting:**\n' +
            '| Student | Score |\n|---|---|\n| Ava | 75 |\n| Liam | 68 |\n| Zoe | 91 |\n| Noah | 82 |\n\n' +
            '**After sorting (highest to lowest):**\n' +
            '| Student | Score |\n|---|---|\n| Zoe | 91 |\n| Noah | 82 |\n| Ava | 75 |\n| Liam | 68 |',
          whyItMatters: 'Sorting is one of the most common things you do with data — it turns messy lists into useful information.',
          initialSheetState: {
            name: 'Sheet1',
            row: 6,
            column: 3,
            celldata: [
              { r: 0, c: 0, v: { v: 'Student', m: 'Student', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Score', m: 'Score', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 'Ava', m: 'Ava' } },
              { r: 1, c: 1, v: { v: 75, m: '75' } },
              { r: 2, c: 0, v: { v: 'Liam', m: 'Liam' } },
              { r: 2, c: 1, v: { v: 68, m: '68' } },
              { r: 3, c: 0, v: { v: 'Zoe', m: 'Zoe' } },
              { r: 3, c: 1, v: { v: 91, m: '91' } },
              { r: 4, c: 0, v: { v: 'Noah', m: 'Noah' } },
              { r: 4, c: 1, v: { v: 82, m: '82' } },
            ],
          },
        },

        // Quiz — Sorting vocabulary
        {
          id: 'step-3-1q',
          order: 2,
          type: 'quiz',
          title: 'Quick Check: Sorting',
          instruction: 'If data is sorted from largest to smallest, what is this order called?',
          quiz: {
            type: 'multiple-choice',
            options: ['Ascending', 'Descending', 'Alphabetical', 'Random'],
            correctAnswer: 'Descending',
            explanation: 'Descending order goes from largest to smallest (e.g. 100, 75, 50, 25). Ascending is the opposite.',
          },
          task: {
            id: 'task-3-1q',
            expectations: [],
            editableCells: [],
            hints: [
              'Think about going "down" from the top.',
              '"Descend" means to go down — from high to low.',
            ],
            successMessage: 'Correct! Descending = largest to smallest.',
            incorrectMessage: 'Not quite — "descending" means going down, from high to low.',
            xpValue: 5,
          },
        },

        // Step 2 — Table Task: Sort by Age, find the oldest
        {
          id: 'step-3-2',
          order: 2,
          type: 'table-task',
          title: 'Sort by Age',
          instruction:
            'Here is a table of students with their age and height.\n\n' +
            'Click the **Age** column header to sort the table from **highest to lowest** (descending), then answer the question below.',
          whyItMatters: 'Sorting helps you quickly find the highest or lowest values in a dataset.',
          tableTask: {
            columns: [
              { key: 'name', label: 'Name', type: 'text' },
              { key: 'age', label: 'Age', type: 'number' },
              { key: 'height', label: 'Height (cm)', type: 'number' },
            ],
            data: [
              { name: 'Ava', age: 14, height: 158 },
              { name: 'Liam', age: 16, height: 172 },
              { name: 'Zoe', age: 13, height: 149 },
              { name: 'Noah', age: 15, height: 165 },
              { name: 'Mia', age: 14, height: 161 },
              { name: 'Ethan', age: 17, height: 178 },
              { name: 'Olivia', age: 13, height: 152 },
              { name: 'James', age: 16, height: 168 },
            ],
            question: 'Who is the oldest student?',
            correctAnswer: 'Ethan',
            acceptableAnswers: ['ethan'],
            explanation: 'Ethan is 17, the highest age in the table.',
            enableSort: true,
            enableFilter: false,
          },
          task: {
            id: 'task-3-2',
            expectations: [],
            editableCells: [],
            hints: [
              'Click the Age column header to sort.',
              'Click it again to switch between ascending and descending.',
              'Look at the top of the list when sorted from highest to lowest.',
            ],
            successMessage: '🎉 Correct! Ethan is the oldest at 17.',
            incorrectMessage: 'Try sorting the Age column from highest to lowest — who appears at the top?',
            xpValue: 10,
            bonusXp: 5,
          },
        },

        // Step 3 — Instruction: Filtering Data
        {
          id: 'step-3-3',
          order: 3,
          type: 'instruction',
          title: 'What is Filtering?',
          instruction:
            '**Filtering** lets you see only the rows that match a condition — everything else is hidden, not deleted.\n\n' +
            'For example, you could filter a student list to show only students aged 14, or only those taller than 170 cm.\n\n' +
            'In spreadsheets and databases, filtering is one of the most common operations. Next, you\'ll practise sorting and filtering on the same table.',
          whyItMatters: 'Filtering helps you focus on exactly the data you need, without being distracted by irrelevant rows.',
        },

        // Step 4 — Table Task: Sort by Height, find the shortest
        {
          id: 'step-3-4',
          order: 4,
          type: 'table-task',
          title: 'Sort by Height',
          instruction:
            'Click the **Height (cm)** column header to sort from **lowest to highest** (ascending), then answer the question below.',
          whyItMatters: 'Sorting in ascending order puts the smallest values first.',
          tableTask: {
            columns: [
              { key: 'name', label: 'Name', type: 'text' },
              { key: 'age', label: 'Age', type: 'number' },
              { key: 'height', label: 'Height (cm)', type: 'number' },
            ],
            data: [
              { name: 'Ava', age: 14, height: 158 },
              { name: 'Liam', age: 16, height: 172 },
              { name: 'Zoe', age: 13, height: 149 },
              { name: 'Noah', age: 15, height: 165 },
              { name: 'Mia', age: 14, height: 161 },
              { name: 'Ethan', age: 17, height: 178 },
              { name: 'Olivia', age: 13, height: 152 },
              { name: 'James', age: 16, height: 168 },
            ],
            question: 'Who is the shortest student?',
            correctAnswer: 'Zoe',
            acceptableAnswers: ['zoe'],
            explanation: 'Zoe is 149 cm, the shortest in the table.',
            enableSort: true,
            enableFilter: false,
          },
          task: {
            id: 'task-3-4',
            expectations: [],
            editableCells: [],
            hints: [
              'Click the Height (cm) header to sort.',
              'Sort from lowest to highest (ascending).',
              'The student at the top of the ascending list is the shortest.',
            ],
            successMessage: '🎉 Correct! Zoe is the shortest at 149 cm.',
            incorrectMessage: 'Try sorting the Height column from lowest to highest — who appears first?',
            xpValue: 10,
            bonusXp: 5,
          },
        },

        // Step 5 — Table Task: Filter by age 14
        {
          id: 'step-3-5',
          order: 5,
          type: 'table-task',
          title: 'Filter by Age',
          instruction:
            'Now try **filtering**! Use the filter controls above the table to show only students who are **14 years old**.\n\n' +
            'Click the **Age** filter button and type **14**, then answer the question below.',
          whyItMatters: 'Filtering narrows your data to just the rows that match — a fundamental skill for working with any dataset.',
          tableTask: {
            columns: [
              { key: 'name', label: 'Name', type: 'text' },
              { key: 'age', label: 'Age', type: 'number' },
              { key: 'height', label: 'Height (cm)', type: 'number' },
            ],
            data: [
              { name: 'Ava', age: 14, height: 158 },
              { name: 'Liam', age: 16, height: 172 },
              { name: 'Zoe', age: 13, height: 149 },
              { name: 'Noah', age: 15, height: 165 },
              { name: 'Mia', age: 14, height: 161 },
              { name: 'Ethan', age: 17, height: 178 },
              { name: 'Olivia', age: 13, height: 152 },
              { name: 'James', age: 16, height: 168 },
            ],
            question: 'How many students are 14 years old?',
            correctAnswer: '2',
            acceptableAnswers: ['two', '2'],
            explanation: 'Ava and Mia are both 14 years old.',
            enableSort: true,
            enableFilter: true,
          },
          task: {
            id: 'task-3-5',
            expectations: [],
            editableCells: [],
            hints: [
              'Click the Age filter button and type 14.',
              'Count how many rows remain after filtering.',
              'Ava and Mia are both 14.',
            ],
            successMessage: '🎉 Correct! Ava and Mia are both 14 — filtering made it easy to see!',
            incorrectMessage: 'Try filtering the Age column to 14 and count the remaining rows.',
            xpValue: 10,
            bonusXp: 5,
          },
        },

        // Step 6 — Table Task: Combined Sort + Filter Challenge (NEW)
        {
          id: 'step-3-6-combo',
          order: 6,
          type: 'table-task',
          title: 'Sort & Filter Together',
          instruction:
            'Here is a school trip sign-up list. Use **both** sorting and filtering to answer the question.\n\n' +
            '1. **Filter** the Year Group column to show only **Year 9** students.\n' +
            '2. Then **sort** the Score column from **highest to lowest**.\n' +
            '3. Who scored the highest among Year 9 students?',
          whyItMatters: 'In real life you often need to combine sorting and filtering — for example, finding the top performer in a specific group.',
          tableTask: {
            columns: [
              { key: 'name', label: 'Name', type: 'text' },
              { key: 'year', label: 'Year Group', type: 'number' },
              { key: 'score', label: 'Score', type: 'number' },
              { key: 'diet', label: 'Dietary Req.', type: 'text' },
            ],
            data: [
              { name: 'Ava', year: 9, score: 72, diet: 'None' },
              { name: 'Liam', year: 10, score: 88, diet: 'Vegetarian' },
              { name: 'Zoe', year: 9, score: 91, diet: 'None' },
              { name: 'Noah', year: 10, score: 65, diet: 'None' },
              { name: 'Mia', year: 9, score: 84, diet: 'Gluten-free' },
              { name: 'Ethan', year: 11, score: 79, diet: 'None' },
              { name: 'Olivia', year: 9, score: 68, diet: 'Halal' },
              { name: 'James', year: 10, score: 77, diet: 'None' },
              { name: 'Sophie', year: 11, score: 93, diet: 'Vegan' },
              { name: 'Ryan', year: 9, score: 56, diet: 'None' },
            ],
            question: 'Who scored the highest among Year 9 students?',
            correctAnswer: 'Zoe',
            acceptableAnswers: ['zoe'],
            explanation: 'After filtering to Year 9 only, Zoe has the highest score at 91.',
            enableSort: true,
            enableFilter: true,
          },
          task: {
            id: 'task-3-6-combo',
            expectations: [],
            editableCells: [],
            hints: [
              'First, filter the Year Group column to show only 9.',
              'Then sort the Score column from highest to lowest.',
              'The student at the top after filtering and sorting is the answer.',
            ],
            successMessage: '🎉 Correct! Zoe scored 91, the highest among Year 9 students. Great use of filter + sort!',
            incorrectMessage: 'Filter to Year 9 first, then sort Score from highest to lowest — who\'s at the top?',
            xpValue: 15,
            bonusXp: 10,
          },
        },

        // Step 7 — Table Task: Dietary Requirements Filter (NEW)
        {
          id: 'step-3-7-diet',
          order: 7,
          type: 'table-task',
          title: 'School Trip Catering',
          instruction:
            'The school trip organiser needs to know how many students have **special dietary requirements** (anything other than "None").\n\n' +
            'Use the **Dietary Req.** filter to explore the data, then answer the question.',
          whyItMatters: 'Filtering text columns is just as useful as filtering numbers — it helps you find specific groups quickly.',
          tableTask: {
            columns: [
              { key: 'name', label: 'Name', type: 'text' },
              { key: 'year', label: 'Year Group', type: 'number' },
              { key: 'diet', label: 'Dietary Req.', type: 'text' },
              { key: 'bus', label: 'Bus', type: 'text' },
            ],
            data: [
              { name: 'Ava', year: 9, diet: 'None', bus: 'Bus A' },
              { name: 'Liam', year: 10, diet: 'Vegetarian', bus: 'Bus A' },
              { name: 'Zoe', year: 9, diet: 'None', bus: 'Bus B' },
              { name: 'Noah', year: 10, diet: 'None', bus: 'Bus A' },
              { name: 'Mia', year: 9, diet: 'Gluten-free', bus: 'Bus B' },
              { name: 'Ethan', year: 11, diet: 'None', bus: 'Bus A' },
              { name: 'Olivia', year: 9, diet: 'Halal', bus: 'Bus B' },
              { name: 'James', year: 10, diet: 'None', bus: 'Bus A' },
              { name: 'Sophie', year: 11, diet: 'Vegan', bus: 'Bus B' },
              { name: 'Ryan', year: 9, diet: 'None', bus: 'Bus A' },
            ],
            question: 'How many students have a special dietary requirement (not "None")?',
            correctAnswer: '4',
            acceptableAnswers: ['four', '4'],
            explanation: 'Liam (Vegetarian), Mia (Gluten-free), Olivia (Halal), and Sophie (Vegan) — 4 students have special dietary needs.',
            enableSort: true,
            enableFilter: true,
          },
          task: {
            id: 'task-3-7-diet',
            expectations: [],
            editableCells: [],
            hints: [
              'Try filtering the Dietary Req. column to different values.',
              'Count all students whose dietary requirement is NOT "None".',
              'Liam, Mia, Olivia, and Sophie each have a different dietary need.',
            ],
            successMessage: '🎉 Correct! 4 students need special meals. Filtering makes trip planning much easier!',
            incorrectMessage: 'Look through the Dietary Req. column — count everyone who isn\'t "None".',
            xpValue: 10,
            bonusXp: 5,
          },
        },

        // Step 8 — Quiz: Sort vs Filter (NEW)
        {
          id: 'step-3-8-reflection',
          order: 8,
          type: 'quiz',
          title: 'Sort vs Filter',
          instruction: 'What is the main difference between sorting and filtering?',
          quiz: {
            type: 'multiple-choice',
            options: [
              'Sorting changes the data; filtering doesn\'t',
              'Sorting rearranges all rows; filtering hides some rows',
              'Filtering is faster than sorting',
              'There is no difference',
            ],
            correctAnswer: 'Sorting rearranges all rows; filtering hides some rows',
            explanation: 'Sorting changes the order of all rows (nothing is hidden). Filtering hides rows that don\'t match your condition — the data is still there, just not visible.',
          },
          task: {
            id: 'task-3-8-reflection',
            expectations: [],
            editableCells: [],
            hints: [
              'Think about what happens to rows you can\'t see — are they rearranged or hidden?',
              'Sorting keeps all rows visible; filtering hides some.',
            ],
            successMessage: 'Correct! Sorting = rearrange, Filtering = hide. Both are non-destructive — your data is always safe.',
            incorrectMessage: 'Think carefully: sorting changes the order of ALL rows, while filtering HIDES rows that don\'t match.',
            xpValue: 5,
          },
        },

        // Step 9 — Quiz: Filtering Concept (original)
        {
          id: 'step-3-6',
          order: 9,
          type: 'quiz',
          title: 'Filtering Concept Check',
          instruction: 'What happens to data that doesn\'t match a filter?',
          quiz: {
            type: 'multiple-choice',
            options: ['It is deleted', 'It is hidden temporarily', 'It turns red', 'It moves to another sheet'],
            correctAnswer: 'It is hidden temporarily',
            explanation: 'Filtering only hides rows that don\'t match — the data is still there and reappears when you remove the filter.',
          },
          task: {
            id: 'task-3-6',
            expectations: [],
            editableCells: [],
            hints: [
              'Think about what happens when you remove a filter — does the data come back?',
              'Filters are non-destructive — they hide, not delete.',
            ],
            successMessage: 'Correct! Filtering hides data temporarily — nothing is deleted.',
            incorrectMessage: 'Not quite — filtering doesn\'t delete or move data, it just hides it temporarily.',
            xpValue: 5,
          },
        },
      ],
    },
  ],
};
