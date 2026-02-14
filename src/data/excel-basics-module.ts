import type { Module } from '@/types/lesson';

export const excelBasicsModule: Module = {
  id: 'excel-basics',
  title: 'Introduction to Excel',
  description: 'Learn how spreadsheets are structured, enter and edit data, format numbers, write formulas, use built-in functions, and sort and filter data.',
  estimatedMinutes: 60,
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
    // LESSON 2: Cell Formatting & Number Types (6 steps)
    // ──────────────────────────────────────────────
    {
      id: 'lesson-formatting',
      order: 2,
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
    // LESSON 3: Built-in Functions (5 steps)
    // ──────────────────────────────────────────────
    {
      id: 'lesson-2',
      order: 3,
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
    // LESSON 4: Sorting and Filtering (4 steps)
    // ──────────────────────────────────────────────
    {
      id: 'lesson-3',
      order: 4,
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
