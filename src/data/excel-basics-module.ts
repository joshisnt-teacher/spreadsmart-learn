import type { Module } from '@/types/lesson';

export const excelBasicsModule: Module = {
  id: 'excel-basics',
  title: 'Introduction to Excel',
  description: 'Learn how spreadsheets are structured, enter and edit data, write formulas, use built-in functions, and sort and filter data.',
  estimatedMinutes: 45,
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
              // Header row
              { r: 0, c: 0, v: { v: 'Name', m: 'Name', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Maths', m: 'Maths', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 2, v: { v: 'English', m: 'English', bl: 1, bg: '#e8f0fe' } },
              // Data rows
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
    // LESSON 2: Built-in Functions (5 steps)
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

        // Step 2 — Task: Total Sales
        {
          id: 'step-2-2',
          order: 2,
          type: 'task',
          title: 'Total Sales',
          instruction:
            'This table shows daily sales from Monday to Thursday.\n\n' +
            '1. In **B6**, calculate the **total** sales using SUM.\n' +
            '2. In **B7**, calculate the **average** daily sales using AVERAGE.\n' +
            '3. Click **Check**.',
          whyItMatters: 'Totals and averages are the foundation of data analysis.',
          initialSheetState: {
            name: 'Sheet1',
            row: 9,
            column: 3,
            celldata: [
              { r: 0, c: 0, v: { v: 'Day', m: 'Day', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Sales', m: 'Sales', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 'Monday', m: 'Monday' } },
              { r: 1, c: 1, v: { v: 240, m: '240' } },
              { r: 2, c: 0, v: { v: 'Tuesday', m: 'Tuesday' } },
              { r: 2, c: 1, v: { v: 310, m: '310' } },
              { r: 3, c: 0, v: { v: 'Wednesday', m: 'Wednesday' } },
              { r: 3, c: 1, v: { v: 275, m: '275' } },
              { r: 4, c: 0, v: { v: 'Thursday', m: 'Thursday' } },
              { r: 4, c: 1, v: { v: 290, m: '290' } },
              // Labels for answer cells
              { r: 5, c: 0, v: { v: 'Total', m: 'Total', bl: 1, bg: '#fff3cd' } },
              { r: 6, c: 0, v: { v: 'Average', m: 'Average', bl: 1, bg: '#fff3cd' } },
            ],
          },
          task: {
            id: 'task-2-2',
            expectations: [
              { cellRef: 'B6', expectedValue: 1115, expectedFormula: '=SUM(B2:B5)', checkFormula: true },
              { cellRef: 'B7', expectedValue: 278.75, expectedFormula: '=AVERAGE(B2:B5)', checkFormula: true },
            ],
            editableCells: ['B6', 'B7'],
            hints: [
              'In B6, type =SUM(B2:B5) to add all four sales values.',
              'In B7, type =AVERAGE(B2:B5) to calculate the mean.',
              'Make sure you include the colon : between B2 and B5.',
            ],
            successMessage: 'Total is 1,115 and average is 278.75 — nice work!',
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

        // Step 4 — Task: Find the Extremes
        {
          id: 'step-2-4',
          order: 4,
          type: 'task',
          title: 'Find the Extremes',
          instruction:
            'Using the same sales data:\n\n' +
            '1. In **B8**, find the **highest** daily sales using MAX.\n' +
            '2. In **B9**, find the **lowest** daily sales using MIN.\n' +
            '3. In **B10**, **count** how many days are listed using COUNT.\n' +
            '4. Click **Check**.',
          whyItMatters: 'Identifying highs, lows, and counts is the first step in any data analysis.',
          initialSheetState: {
            name: 'Sheet1',
            row: 12,
            column: 3,
            celldata: [
              { r: 0, c: 0, v: { v: 'Day', m: 'Day', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Sales', m: 'Sales', bl: 1, bg: '#e8f0fe' } },
              { r: 1, c: 0, v: { v: 'Monday', m: 'Monday' } },
              { r: 1, c: 1, v: { v: 240, m: '240' } },
              { r: 2, c: 0, v: { v: 'Tuesday', m: 'Tuesday' } },
              { r: 2, c: 1, v: { v: 310, m: '310' } },
              { r: 3, c: 0, v: { v: 'Wednesday', m: 'Wednesday' } },
              { r: 3, c: 1, v: { v: 275, m: '275' } },
              { r: 4, c: 0, v: { v: 'Thursday', m: 'Thursday' } },
              { r: 4, c: 1, v: { v: 290, m: '290' } },
              // Pre-filled results from previous task
              { r: 5, c: 0, v: { v: 'Total', m: 'Total', bl: 1, bg: '#d4edda' } },
              { r: 5, c: 1, v: { v: 1115, m: '1115', f: '=SUM(B2:B5)' } },
              { r: 6, c: 0, v: { v: 'Average', m: 'Average', bl: 1, bg: '#d4edda' } },
              { r: 6, c: 1, v: { v: 278.75, m: '278.75', f: '=AVERAGE(B2:B5)' } },
              // Labels for new answer cells
              { r: 7, c: 0, v: { v: 'Highest', m: 'Highest', bl: 1, bg: '#fff3cd' } },
              { r: 8, c: 0, v: { v: 'Lowest', m: 'Lowest', bl: 1, bg: '#fff3cd' } },
              { r: 9, c: 0, v: { v: 'Count', m: 'Count', bl: 1, bg: '#fff3cd' } },
            ],
          },
          task: {
            id: 'task-2-4',
            expectations: [
              { cellRef: 'B8', expectedValue: 310, expectedFormula: '=MAX(B2:B5)', checkFormula: true },
              { cellRef: 'B9', expectedValue: 240, expectedFormula: '=MIN(B2:B5)', checkFormula: true },
              { cellRef: 'B10', expectedValue: 4, expectedFormula: '=COUNT(B2:B5)', checkFormula: true },
            ],
            editableCells: ['B8', 'B9', 'B10'],
            hints: [
              'B8 should use =MAX(B2:B5) to find the highest value.',
              'B9 should use =MIN(B2:B5) to find the lowest value.',
              'B10 should use =COUNT(B2:B5) to count how many numbers there are.',
            ],
            successMessage: 'Highest is 310, lowest is 240, and there are 4 days — well done!',
            almostCorrectMessage: 'Values are correct but make sure you used the MAX, MIN, and COUNT functions.',
            incorrectMessage: 'Use =MAX(B2:B5) in B8, =MIN(B2:B5) in B9, and =COUNT(B2:B5) in B10.',
            xpValue: 20,
            bonusXp: 10,
          },
        },

        // Step 5 — Challenge: School Canteen Analysis
        {
          id: 'step-2-5',
          order: 5,
          type: 'challenge',
          title: 'School Canteen Analysis',
          instruction:
            'The school canteen tracked sales today. Your job is to analyse the data!\n\n' +
            '1. Calculate **Revenue** for each item (Sold × Price):\n' +
            '   - **D2**: `=B2*C2`\n' +
            '   - **D3**: `=B3*C3`\n' +
            '   - **D4**: `=B4*C4`\n' +
            '   - **D5**: `=B5*C5`\n\n' +
            '2. In **D7**, calculate the **total revenue** using SUM.\n' +
            '3. In **B8**, find the **most sold** item using MAX.\n' +
            '4. In **B9**, find the **average** number sold using AVERAGE.\n\n' +
            '💡 **Reflection:** Which item makes the most money? Is it the same as the most popular item?',
          whyItMatters: 'Combining formulas and functions to answer real questions is what makes spreadsheets so powerful.',
          initialSheetState: {
            name: 'Sheet1',
            row: 11,
            column: 5,
            celldata: [
              // Headers
              { r: 0, c: 0, v: { v: 'Item', m: 'Item', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 1, v: { v: 'Sold', m: 'Sold', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 2, v: { v: 'Price', m: 'Price', bl: 1, bg: '#e8f0fe' } },
              { r: 0, c: 3, v: { v: 'Revenue', m: 'Revenue', bl: 1, bg: '#e8f0fe' } },
              // Data
              { r: 1, c: 0, v: { v: 'Burger', m: 'Burger' } },
              { r: 1, c: 1, v: { v: 25, m: '25' } },
              { r: 1, c: 2, v: { v: 6, m: '6' } },
              { r: 2, c: 0, v: { v: 'Wrap', m: 'Wrap' } },
              { r: 2, c: 1, v: { v: 18, m: '18' } },
              { r: 2, c: 2, v: { v: 7, m: '7' } },
              { r: 3, c: 0, v: { v: 'Juice', m: 'Juice' } },
              { r: 3, c: 1, v: { v: 40, m: '40' } },
              { r: 3, c: 2, v: { v: 3, m: '3' } },
              { r: 4, c: 0, v: { v: 'Chips', m: 'Chips' } },
              { r: 4, c: 1, v: { v: 32, m: '32' } },
              { r: 4, c: 2, v: { v: 4, m: '4' } },
              // Labels for summary
              { r: 6, c: 3, v: { v: 'Total Revenue', m: 'Total Revenue', bl: 1, bg: '#fff3cd' } },
              // Note: D7 label is on c:3 row 6, answer goes in D7 (r:6, but we label on c:2)
              { r: 6, c: 2, v: { v: 'Total Revenue →', m: 'Total Revenue →', bl: 1, bg: '#fff3cd' } },
              { r: 7, c: 0, v: { v: 'Most Sold', m: 'Most Sold', bl: 1, bg: '#fff3cd' } },
              { r: 8, c: 0, v: { v: 'Avg Sold', m: 'Avg Sold', bl: 1, bg: '#fff3cd' } },
            ],
          },
          task: {
            id: 'task-2-5',
            expectations: [
              { cellRef: 'D2', expectedValue: 150, expectedFormula: '=B2*C2', checkFormula: true },
              { cellRef: 'D3', expectedValue: 126, expectedFormula: '=B3*C3', checkFormula: true },
              { cellRef: 'D4', expectedValue: 120, expectedFormula: '=B4*C4', checkFormula: true },
              { cellRef: 'D5', expectedValue: 128, expectedFormula: '=B5*C5', checkFormula: true },
              { cellRef: 'D7', expectedValue: 524, expectedFormula: '=SUM(D2:D5)', checkFormula: true },
              { cellRef: 'B8', expectedValue: 40, expectedFormula: '=MAX(B2:B5)', checkFormula: true },
              { cellRef: 'B9', expectedValue: 28.75, expectedFormula: '=AVERAGE(B2:B5)', checkFormula: true },
            ],
            editableCells: ['D2', 'D3', 'D4', 'D5', 'D7', 'B8', 'B9'],
            hints: [
              'Revenue = Sold × Price. In D2, type =B2*C2.',
              'For total revenue, use =SUM(D2:D5) in D7.',
              'Most sold uses =MAX(B2:B5) in B8. Average sold uses =AVERAGE(B2:B5) in B9.',
            ],
            successMessage: '🎉 Canteen analysis complete! Burger makes the most money (£150) but Juice is the most popular (40 sold).',
            almostCorrectMessage: 'Values look right — double-check that you used formulas and functions, not typed numbers.',
            incorrectMessage: 'Calculate each revenue with =B*C, total with =SUM(D2:D5), most sold with =MAX(B2:B5), and average with =AVERAGE(B2:B5).',
            xpValue: 40,
            bonusXp: 20,
          },
        },
      ],
    },

    // ──────────────────────────────────────────────
    // LESSON 3: Sorting and Filtering (4 steps)
    // ──────────────────────────────────────────────
    {
      id: 'lesson-3',
      order: 3,
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

        // Step 2 — Task: Find Top and Bottom Scores (LARGE/SMALL)
        {
          id: 'step-3-2',
          order: 2,
          type: 'task',
          title: 'Find the Top and Bottom Scores',
          instruction:
            'Instead of manually sorting data, spreadsheets have functions that find the **k-th largest or smallest** value in a range.\n\n' +
            '- `=LARGE(range, k)` returns the k-th **largest** value\n' +
            '- `=SMALL(range, k)` returns the k-th **smallest** value\n\n' +
            'Use these formulas in column D:\n\n' +
            '1. In **D2**, type `=LARGE(B2:B5, 1)` — the highest score\n' +
            '2. In **D3**, type `=LARGE(B2:B5, 2)` — the second highest\n' +
            '3. In **D4**, type `=SMALL(B2:B5, 1)` — the lowest score\n' +
            '4. Click **Check**.',
          whyItMatters: 'LARGE and SMALL let you rank values without rearranging data — essential for dashboards and reports.',
          initialSheetState: {
            name: 'Sheet1',
            row: 7,
            column: 6,
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
              { r: 0, c: 3, v: { v: 'Result', m: 'Result', bl: 1, bg: '#fff3cd' } },
              { r: 1, c: 3, v: { v: '1st highest', m: '1st highest', fc: '#888888', fs: 9 } },
              { r: 2, c: 3, v: { v: '2nd highest', m: '2nd highest', fc: '#888888', fs: 9 } },
              { r: 3, c: 3, v: { v: 'Lowest', m: 'Lowest', fc: '#888888', fs: 9 } },
            ],
          },
          task: {
            id: 'task-3-2',
            expectations: [
              { cellRef: 'D2', expectedValue: 91, expectedFormula: '=LARGE(B2:B5,1)', checkFormula: true },
              { cellRef: 'D3', expectedValue: 82, expectedFormula: '=LARGE(B2:B5,2)', checkFormula: true },
              { cellRef: 'D4', expectedValue: 68, expectedFormula: '=SMALL(B2:B5,1)', checkFormula: true },
            ],
            editableCells: ['D2', 'D3', 'D4'],
            hints: [
              'LARGE(B2:B5, 1) finds the biggest value in B2:B5.',
              'Type =LARGE(B2:B5, 1) in D2, =LARGE(B2:B5, 2) in D3, and =SMALL(B2:B5, 1) in D4.',
              'Make sure each formula starts with = and uses the exact range B2:B5.',
            ],
            successMessage: '🎉 You used LARGE and SMALL to rank values without rearranging the data!',
            almostCorrectMessage: 'The values are right but check your formulas — use LARGE() and SMALL().',
            incorrectMessage: 'Try =LARGE(B2:B5, 1) in D2, =LARGE(B2:B5, 2) in D3, =SMALL(B2:B5, 1) in D4.',
            xpValue: 15,
            bonusXp: 5,
          },
        },

        // Step 3 — Instruction: Filtering Data
        {
          id: 'step-3-3',
          order: 3,
          type: 'instruction',
          title: 'Filtering Data',
          instruction:
            '**Filtering** lets you see only the rows that match a condition — everything else is hidden, not deleted.\n\n' +
            'For example, filtering scores to show **only values above 75**:\n\n' +
            '| Student | Score | Visible? |\n|---|---|---|\n| Ava | 75 | ❌ (not above 75) |\n| Liam | 68 | ❌ |\n| Zoe | 91 | ✅ |\n| Noah | 82 | ✅ |\n\n' +
            'Spreadsheets have built-in filter tools, but you can also use **formulas** to achieve the same result.\n\n' +
            'Next, you\'ll use `COUNTIF` and `IF` — two powerful functions for working with filtered data.',
          whyItMatters: 'Filtering is one of the most-used features in any spreadsheet — it helps you focus on exactly the data you need.',
        },

        // Step 4 — Task: Count the Matches (COUNTIF)
        {
          id: 'step-3-4',
          order: 4,
          type: 'task',
          title: 'Count the Matches',
          instruction:
            '`COUNTIF(range, criteria)` counts how many cells in a range meet a condition.\n\n' +
            'How many students scored **above 75**?\n\n' +
            '1. In **D2**, type `=COUNTIF(B2:B5, ">75")`\n' +
            '2. Click **Check**.\n\n' +
            '💡 The criteria `">75"` must be in quotes.',
          whyItMatters: 'COUNTIF is the building block for summary reports and dashboards.',
          initialSheetState: {
            name: 'Sheet1',
            row: 7,
            column: 6,
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
              { r: 0, c: 3, v: { v: 'Count >75', m: 'Count >75', bl: 1, bg: '#fff3cd' } },
            ],
          },
          task: {
            id: 'task-3-4',
            expectations: [
              { cellRef: 'D2', expectedValue: 2, expectedFormula: '=COUNTIF(B2:B5,">75")', checkFormula: true },
            ],
            editableCells: ['D2'],
            hints: [
              'COUNTIF counts cells matching a condition.',
              'Type =COUNTIF(B2:B5, ">75") — remember the quotes around >75.',
              'Only Zoe (91) and Noah (82) are strictly above 75, so the answer is 2.',
            ],
            successMessage: '🎉 Correct! 2 students scored above 75. COUNTIF is great for quick summaries.',
            almostCorrectMessage: 'Right value but use the COUNTIF formula instead of typing the number.',
            incorrectMessage: 'Try =COUNTIF(B2:B5, ">75") in cell D2.',
            xpValue: 10,
            bonusXp: 5,
          },
        },

        // Step 5 — Task: Filter with IF
        {
          id: 'step-3-5',
          order: 5,
          type: 'task',
          title: 'Filter with IF',
          instruction:
            '`IF(condition, value_if_true, value_if_false)` lets you show or hide values based on a condition.\n\n' +
            'Use IF to show only the names of students who scored **above 75**:\n\n' +
            '1. In **D2**, type `=IF(B2>75, A2, "")`\n' +
            '2. In **D3**, type `=IF(B3>75, A3, "")`\n' +
            '3. In **D4**, type `=IF(B4>75, A4, "")`\n' +
            '4. In **D5**, type `=IF(B5>75, A5, "")`\n' +
            '5. Click **Check**.\n\n' +
            '💡 Cells where the score is 75 or below will show blank.',
          whyItMatters: 'IF formulas let you build smart, dynamic filters directly in your spreadsheet.',
          initialSheetState: {
            name: 'Sheet1',
            row: 7,
            column: 6,
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
              { r: 0, c: 3, v: { v: 'Filtered Names', m: 'Filtered Names', bl: 1, bg: '#fff3cd' } },
            ],
          },
          task: {
            id: 'task-3-5',
            expectations: [
              { cellRef: 'D2', expectedFormula: '=IF(B2>75,A2,"")', checkFormula: true },
              { cellRef: 'D3', expectedFormula: '=IF(B3>75,A3,"")', checkFormula: true },
              { cellRef: 'D4', expectedFormula: '=IF(B4>75,A4,"")', checkFormula: true },
              { cellRef: 'D5', expectedFormula: '=IF(B5>75,A5,"")', checkFormula: true },
            ],
            editableCells: ['D2', 'D3', 'D4', 'D5'],
            hints: [
              'Each IF formula checks if the score in column B is above 75.',
              'Type =IF(B2>75, A2, "") in D2 — it shows the name only if the score exceeds 75.',
              'D2 and D3 will be blank (75 and 68 aren\'t above 75). D4 shows Zoe, D5 shows Noah.',
            ],
            successMessage: '🎉 You built a formula-based filter! Only Zoe and Noah appear because they scored above 75.',
            almostCorrectMessage: 'Close! Make sure each cell uses an IF formula, not a typed value.',
            incorrectMessage: 'Use =IF(B2>75, A2, "") in D2 and adjust the row number for D3–D5.',
            xpValue: 15,
            bonusXp: 5,
          },
        },

        // Step 6 — Quiz: Filtering Concept
        {
          id: 'step-3-6',
          order: 6,
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
