import type { Module } from '@/types/lesson';

export const scientificMethodModule: Module = {
  id: 'scientific-method-101',
  title: 'The Scientific Method: Digital Lab Book',
  description:
    'Learn how real scientists plan experiments, record tidy data, calculate averages and ranges, build proper scientific charts, and draw evidence-based conclusions.',
  estimatedMinutes: 60,
  bannerUrl:
    'https://ribpzkdzvpqyheftxblz.supabase.co/storage/v1/object/public/module-banners/data-modelling-banner.jpg',
  lessons: [
    // ═══════════════════════════════════════════════════
    // LESSON 1: Planning an Experiment
    // ═══════════════════════════════════════════════════
    {
      id: 'sm-lesson-1',
      order: 1,
      title: 'Planning an Experiment',
      description:
        'Learn the steps of the scientific method and how to identify independent, dependent, and controlled variables.',
      steps: [
        {
          id: 'sm-1-1',
          order: 1,
          type: 'instruction',
          title: 'What Is the Scientific Method?',
          instruction:
            'Scientists do not just guess. They follow a process called the **scientific method** to test ideas and discover how the world works.\n\n' +
            'The steps are:\n' +
            '1. **Ask a question**: What do you want to find out?\n' +
            '2. **Research**: What is already known?\n' +
            '3. **Form a hypothesis**: Make a testable prediction\n' +
            '4. **Test with an experiment**: Collect data carefully\n' +
            '5. **Analyse the results**: Look for patterns\n' +
            '6. **Draw a conclusion**: Was your hypothesis right?\n\n' +
            'In this module, you will learn how to use a **digital lab book**: a spreadsheet, to plan, record, and analyse experiments just like real scientists do.',
          whyItMatters:
            'Following a structured method makes your results reliable and believable. It also helps other people repeat your work.',
        },
        {
          id: 'sm-1-2',
          order: 2,
          type: 'instruction',
          title: 'Variables Everywhere',
          instruction:
            'Every experiment has **variables**: things that can change.\n\n' +
            'There are three types you must know:\n\n' +
            '- **Independent variable**: the thing YOU deliberately change (e.g. amount of fertiliser)\n' +
            '- **Dependent variable**: the thing YOU measure or observe (e.g. plant height)\n' +
            '- **Controlled variables**: the things you KEEP THE SAME so the test is fair (e.g. type of plant, amount of water, amount of light)\n\n' +
            '**Example:**\n' +
            'If you test whether music volume affects test scores:\n' +
            '- Independent = music volume\n' +
            '- Dependent = test score\n' +
            '- Controlled = same test, same room, same time of day\n\n' +
            'If you change too many things at once, you will not know which one caused the result.',
          whyItMatters:
            'Identifying variables correctly is the foundation of every fair experiment. Get this wrong and your whole experiment is unreliable.',
        },
        {
          id: 'sm-1-3',
          order: 3,
          type: 'quiz',
          title: 'Spot the Variables',
          instruction:
            'An experiment tests whether the amount of sleep affects reaction time. What is the dependent variable?',
          quiz: {
            type: 'multiple-choice',
            options: [
              'Amount of sleep',
              'Reaction time',
              'Type of test used',
              'Room temperature',
            ],
            correctAnswer: 'Reaction time',
            explanation:
              'The dependent variable is what you measure. Here, reaction time is being measured to see if it changes when sleep changes.',
          },
          task: {
            id: 'task-sm-1-3',
            expectations: [],
            editableCells: [],
            hints: [
              'The dependent variable is the outcome you measure.',
              'Ask yourself: what is the scientist recording at the end?',
            ],
            successMessage:
              'Correct! Reaction time is the dependent variable because it is what gets measured.',
            incorrectMessage:
              'The dependent variable is what you measure, not what you change.',
            xpValue: 5,
          },
        },
        {
          id: 'sm-1-4',
          order: 4,
          type: 'task',
          title: 'Build a Variables Table',
          instruction:
            'Below are three experiment ideas. For each one, fill in the independent variable, dependent variable, and two controlled variables.\n\n' +
            '1. **Does music volume affect test scores?**\n' +
            '2. **Does ice thickness affect melting time?**\n' +
            '3. **Does ramp height affect toy car distance?**\n\n' +
            'Type your answers in the yellow cells.',
          whyItMatters:
            'Being able to break an experiment into its variables is the first skill every scientist masters.',
          initialSheetState: {
            name: 'Sheet1',
            row: 6,
            column: 6,
            celldata: [
              {
                r: 0,
                c: 0,
                v: {
                  v: 'Experiment',
                  m: 'Experiment',
                  bl: 1,
                  bg: '#e8f0fe',
                },
              },
              {
                r: 0,
                c: 1,
                v: {
                  v: 'Independent',
                  m: 'Independent',
                  bl: 1,
                  bg: '#e8f0fe',
                },
              },
              {
                r: 0,
                c: 2,
                v: {
                  v: 'Dependent',
                  m: 'Dependent',
                  bl: 1,
                  bg: '#e8f0fe',
                },
              },
              {
                r: 0,
                c: 3,
                v: {
                  v: 'Controlled 1',
                  m: 'Controlled 1',
                  bl: 1,
                  bg: '#e8f0fe',
                },
              },
              {
                r: 0,
                c: 4,
                v: {
                  v: 'Controlled 2',
                  m: 'Controlled 2',
                  bl: 1,
                  bg: '#e8f0fe',
                },
              },
              {
                r: 1,
                c: 0,
                v: {
                  v: 'Music volume vs test scores',
                  m: 'Music volume vs test scores',
                },
              },
              { r: 1, c: 1, v: { bg: '#fff3cd' } },
              { r: 1, c: 2, v: { bg: '#fff3cd' } },
              { r: 1, c: 3, v: { bg: '#fff3cd' } },
              { r: 1, c: 4, v: { bg: '#fff3cd' } },
              {
                r: 2,
                c: 0,
                v: {
                  v: 'Ice thickness vs melting time',
                  m: 'Ice thickness vs melting time',
                },
              },
              { r: 2, c: 1, v: { bg: '#fff3cd' } },
              { r: 2, c: 2, v: { bg: '#fff3cd' } },
              { r: 2, c: 3, v: { bg: '#fff3cd' } },
              { r: 2, c: 4, v: { bg: '#fff3cd' } },
              {
                r: 3,
                c: 0,
                v: {
                  v: 'Ramp height vs car distance',
                  m: 'Ramp height vs car distance',
                },
              },
              { r: 3, c: 1, v: { bg: '#fff3cd' } },
              { r: 3, c: 2, v: { bg: '#fff3cd' } },
              { r: 3, c: 3, v: { bg: '#fff3cd' } },
              { r: 3, c: 4, v: { bg: '#fff3cd' } },
            ],
          },
          task: {
            id: 'task-sm-1-4',
            expectations: [
              { cellRef: 'B2' },
              { cellRef: 'C2' },
              { cellRef: 'D2' },
              { cellRef: 'E2' },
              { cellRef: 'B3' },
              { cellRef: 'C3' },
              { cellRef: 'D3' },
              { cellRef: 'E3' },
              { cellRef: 'B4' },
              { cellRef: 'C4' },
              { cellRef: 'D4' },
              { cellRef: 'E4' },
            ],
            editableCells: [
              'B2',
              'C2',
              'D2',
              'E2',
              'B3',
              'C3',
              'D3',
              'E3',
              'B4',
              'C4',
              'D4',
              'E4',
            ],
            hints: [
              'Independent = what you change. Dependent = what you measure. Controlled = what stays the same.',
              'For music volume: you change the volume, you measure the test score. Keep the test and room the same.',
            ],
            successMessage:
              'Identifying variables is the first step to any fair experiment.',
            incorrectMessage:
              'Make sure every yellow cell has an answer. Remember: Independent = what you change, Dependent = what you measure.',
            xpValue: 15,
            bonusXp: 5,
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 2: Recording Data Like a Scientist
    // ═══════════════════════════════════════════════════
    {
      id: 'sm-lesson-2',
      order: 2,
      title: 'Recording Data Like a Scientist',
      description:
        'Enter repeated trial data into a clean table and calculate averages with formulas.',
      steps: [
        {
          id: 'sm-2-1',
          order: 1,
          type: 'instruction',
          title: 'Why Repeated Trials?',
          instruction:
            'Scientists never trust a single measurement. Why? Because accidents happen.\n\n' +
            '- A gust of wind might push your ruler\n' +
            '- You might misread a stopwatch by a split second\n' +
            '- A plant might have been unhealthy before you started\n\n' +
            'By repeating each test **at least three times**, you can spot odd results and calculate an **average** that is much more reliable than any single reading.\n\n' +
            '**Tidy data rules:**\n' +
            '- One row per observation\n' +
            '- One column per variable\n' +
            '- Headers in the first row\n' +
            '- Consistent units throughout',
          whyItMatters:
            'Messy data leads to wrong conclusions. Tidy data makes analysis fast and trustworthy.',
        },
        {
          id: 'sm-2-2',
          order: 2,
          type: 'task',
          title: 'Fix the Lab Book',
          instruction:
            'This lab book has several problems. Fix them so the data is tidy and ready for analysis.\n\n' +
            '1. Cell **A1** is missing a header. Type **Week**.\n' +
            '2. Cell **B1** is missing units. Type **Height (cm)**.\n' +
            '3. Cell **B3** is in the wrong unit (millimetres instead of centimetres). Change it to **15**.\n' +
            '4. Cell **B5** contains text (**12cm**). Change it to the number **12**.\n\n' +
            'Click **Check** when done.',
          whyItMatters:
            'Mixed units and text where numbers should be will break formulas and charts later.',
          initialSheetState: {
            name: 'Sheet1',
            row: 7,
            column: 4,
            celldata: [
              {
                r: 0,
                c: 0,
                v: { v: '', m: '', bg: '#fff3cd' },
              },
              {
                r: 0,
                c: 1,
                v: { v: 'Height', m: 'Height', bl: 1, bg: '#fff3cd' },
              },
              { r: 1, c: 0, v: { v: 'Week 1', m: 'Week 1' } },
              { r: 1, c: 1, v: { v: 8, m: '8' } },
              { r: 2, c: 0, v: { v: 'Week 2', m: 'Week 2' } },
              {
                r: 2,
                c: 1,
                v: { v: 150, m: '150', bg: '#fff3cd' },
              },
              { r: 3, c: 0, v: { v: 'Week 3', m: 'Week 3' } },
              { r: 3, c: 1, v: { v: 10, m: '10' } },
              { r: 4, c: 0, v: { v: 'Week 4', m: 'Week 4' } },
              {
                r: 4,
                c: 1,
                v: { v: '12cm', m: '12cm', bg: '#fff3cd' },
              },
            ],
          },
          task: {
            id: 'task-sm-2-2',
            expectations: [
              { cellRef: 'A1', expectedValue: 'Week' },
              { cellRef: 'B1', expectedValue: 'Height (cm)' },
              { cellRef: 'B3', expectedValue: 15 },
              { cellRef: 'B5', expectedValue: 12 },
            ],
            editableCells: ['A1', 'B1', 'B3', 'B5'],
            hints: [
              'A1 needs the label for the first column: Week.',
              'B1 should say Height (cm) to show the units.',
              'B3 is 150 mm. Divide by 10 to get centimetres.',
              'B5 says 12cm as text. Remove the letters so it is just the number 12.',
            ],
            successMessage:
              'Lab book cleaned! Consistent units and proper headers make everything easier.',
            incorrectMessage:
              'Check all four fixes: A1 = Week, B1 = Height (cm), B3 = 15, B5 = 12.',
            xpValue: 15,
            bonusXp: 5,
          },
        },
        {
          id: 'sm-2-3',
          order: 3,
          type: 'instruction',
          title: 'Calculate the Mean',
          instruction:
            'The **mean** (or average) smooths out random errors and gives you the best estimate of the true value.\n\n' +
            'In a spreadsheet, use the formula:\n' +
            '`=AVERAGE(range)`\n\n' +
            'For example, if you have three trials in cells B2, C2, and D2:\n' +
            '`=AVERAGE(B2:D2)`\n\n' +
            'The spreadsheet adds the values, divides by the count, and puts the result in the cell.\n\n' +
            '**Why this matters:**\n' +
            'If your three plant height readings are 8 cm, 9 cm, and 7 cm, the average is 8 cm. That single number is more reliable than any one reading on its own.',
          whyItMatters:
            'Averages are the standard way scientists summarise repeated measurements.',
        },
        {
          id: 'sm-2-4',
          order: 4,
          type: 'task',
          title: 'Averages for Plant Growth',
          instruction:
            'A student measured the height of the same plant over four weeks. Each week, they took three trials.\n\n' +
            'Calculate the average height for each week:\n' +
            '1. In **E2**, type **=AVERAGE(B2:D2)**\n' +
            '2. In **E3**, type **=AVERAGE(B3:D3)**\n' +
            '3. In **E4**, type **=AVERAGE(B4:D4)**\n' +
            '4. In **E5**, type **=AVERAGE(B5:D5)**\n\n' +
            'Click **Check**.',
          whyItMatters:
            'Calculating averages turns a wall of numbers into a clear trend you can actually interpret.',
          initialSheetState: {
            name: 'Sheet1',
            row: 7,
            column: 6,
            celldata: [
              {
                r: 0,
                c: 0,
                v: { v: 'Week', m: 'Week', bl: 1, bg: '#e8f0fe' },
              },
              {
                r: 0,
                c: 1,
                v: { v: 'Trial 1', m: 'Trial 1', bl: 1, bg: '#e8f0fe' },
              },
              {
                r: 0,
                c: 2,
                v: { v: 'Trial 2', m: 'Trial 2', bl: 1, bg: '#e8f0fe' },
              },
              {
                r: 0,
                c: 3,
                v: { v: 'Trial 3', m: 'Trial 3', bl: 1, bg: '#e8f0fe' },
              },
              {
                r: 0,
                c: 4,
                v: { v: 'Average', m: 'Average', bl: 1, bg: '#fff3cd' },
              },
              { r: 1, c: 0, v: { v: 'Week 1', m: 'Week 1' } },
              { r: 1, c: 1, v: { v: 5, m: '5' } },
              { r: 1, c: 2, v: { v: 6, m: '6' } },
              { r: 1, c: 3, v: { v: 7, m: '7' } },
              { r: 2, c: 0, v: { v: 'Week 2', m: 'Week 2' } },
              { r: 2, c: 1, v: { v: 8, m: '8' } },
              { r: 2, c: 2, v: { v: 9, m: '9' } },
              { r: 2, c: 3, v: { v: 10, m: '10' } },
              { r: 3, c: 0, v: { v: 'Week 3', m: 'Week 3' } },
              { r: 3, c: 1, v: { v: 11, m: '11' } },
              { r: 3, c: 2, v: { v: 12, m: '12' } },
              { r: 3, c: 3, v: { v: 13, m: '13' } },
              { r: 4, c: 0, v: { v: 'Week 4', m: 'Week 4' } },
              { r: 4, c: 1, v: { v: 15, m: '15' } },
              { r: 4, c: 2, v: { v: 16, m: '16' } },
              { r: 4, c: 3, v: { v: 17, m: '17' } },
            ],
          },
          task: {
            id: 'task-sm-2-4',
            expectations: [
              {
                cellRef: 'E2',
                expectedValue: 6,
                expectedFormula: '=AVERAGE(B2:D2)',
                checkFormula: true,
              },
              {
                cellRef: 'E3',
                expectedValue: 9,
                expectedFormula: '=AVERAGE(B3:D3)',
                checkFormula: true,
              },
              {
                cellRef: 'E4',
                expectedValue: 12,
                expectedFormula: '=AVERAGE(B4:D4)',
                checkFormula: true,
              },
              {
                cellRef: 'E5',
                expectedValue: 16,
                expectedFormula: '=AVERAGE(B5:D5)',
                checkFormula: true,
              },
            ],
            editableCells: ['E2', 'E3', 'E4', 'E5'],
            hints: [
              'Use =AVERAGE(B2:D2) in E2 to average the three Week 1 readings.',
              'For each row, change the row number in the formula.',
            ],
            successMessage:
              'Averages calculated! The plant is growing steadily from 6 cm to 16 cm.',
            almostCorrectMessage:
              'Values look right but make sure you used AVERAGE formulas, not typed numbers.',
            incorrectMessage:
              'Use =AVERAGE(B2:D2) in E2, =AVERAGE(B3:D3) in E3, and so on.',
            xpValue: 15,
            bonusXp: 5,
          },
        },
        {
          id: 'sm-2-5',
          order: 5,
          type: 'challenge',
          title: 'Complete the Lab Table',
          instruction:
            'A student tested how temperature affects dissolving time. They ran three trials at each temperature.\n\n' +
            '1. Calculate the **average time** for each temperature in column E:\n' +
            '   - **E2**: =AVERAGE(B2:D2)\n' +
            '   - **E3**: =AVERAGE(B3:D3)\n' +
            '   - **E4**: =AVERAGE(B4:D4)\n' +
            '   - **E5**: =AVERAGE(B5:D5)\n' +
            '   - **E6**: =AVERAGE(B6:D6)\n' +
            '2. Calculate the **overall average** of all five averages in **E7**:\n' +
            '   - **E7**: =AVERAGE(E2:E6)\n\n' +
            'Click **Check**.',
          whyItMatters:
            'An overall average helps you see the central tendency across all conditions.',
          initialSheetState: {
            name: 'Sheet1',
            row: 9,
            column: 6,
            celldata: [
              {
                r: 0,
                c: 0,
                v: {
                  v: 'Temperature (C)',
                  m: 'Temperature (C)',
                  bl: 1,
                  bg: '#e8f0fe',
                },
              },
              {
                r: 0,
                c: 1,
                v: { v: 'Trial 1 (s)', m: 'Trial 1 (s)', bl: 1, bg: '#e8f0fe' },
              },
              {
                r: 0,
                c: 2,
                v: { v: 'Trial 2 (s)', m: 'Trial 2 (s)', bl: 1, bg: '#e8f0fe' },
              },
              {
                r: 0,
                c: 3,
                v: { v: 'Trial 3 (s)', m: 'Trial 3 (s)', bl: 1, bg: '#e8f0fe' },
              },
              {
                r: 0,
                c: 4,
                v: { v: 'Average (s)', m: 'Average (s)', bl: 1, bg: '#fff3cd' },
              },
              { r: 1, c: 0, v: { v: 0, m: '0' } },
              { r: 1, c: 1, v: { v: 45, m: '45' } },
              { r: 1, c: 2, v: { v: 48, m: '48' } },
              { r: 1, c: 3, v: { v: 42, m: '42' } },
              { r: 2, c: 0, v: { v: 20, m: '20' } },
              { r: 2, c: 1, v: { v: 32, m: '32' } },
              { r: 2, c: 2, v: { v: 30, m: '30' } },
              { r: 2, c: 3, v: { v: 31, m: '31' } },
              { r: 3, c: 0, v: { v: 40, m: '40' } },
              { r: 3, c: 1, v: { v: 18, m: '18' } },
              { r: 3, c: 2, v: { v: 20, m: '20' } },
              { r: 3, c: 3, v: { v: 19, m: '19' } },
              { r: 4, c: 0, v: { v: 60, m: '60' } },
              { r: 4, c: 1, v: { v: 10, m: '10' } },
              { r: 4, c: 2, v: { v: 11, m: '11' } },
              { r: 4, c: 3, v: { v: 9, m: '9' } },
              { r: 5, c: 0, v: { v: 80, m: '80' } },
              { r: 5, c: 1, v: { v: 5, m: '5' } },
              { r: 5, c: 2, v: { v: 6, m: '6' } },
              { r: 5, c: 3, v: { v: 4, m: '4' } },
              {
                r: 6,
                c: 0,
                v: {
                  v: 'Overall average',
                  m: 'Overall average',
                  bl: 1,
                  bg: '#fff3cd',
                },
              },
            ],
          },
          task: {
            id: 'task-sm-2-5',
            expectations: [
              {
                cellRef: 'E2',
                expectedValue: 45,
                expectedFormula: '=AVERAGE(B2:D2)',
                checkFormula: true,
              },
              {
                cellRef: 'E3',
                expectedValue: 31,
                expectedFormula: '=AVERAGE(B3:D3)',
                checkFormula: true,
              },
              {
                cellRef: 'E4',
                expectedValue: 19,
                expectedFormula: '=AVERAGE(B4:D4)',
                checkFormula: true,
              },
              {
                cellRef: 'E5',
                expectedValue: 10,
                expectedFormula: '=AVERAGE(B5:D5)',
                checkFormula: true,
              },
              {
                cellRef: 'E6',
                expectedValue: 5,
                expectedFormula: '=AVERAGE(B6:D6)',
                checkFormula: true,
              },
              {
                cellRef: 'E7',
                expectedValue: 22,
                expectedFormula: '=AVERAGE(E2:E6)',
                checkFormula: true,
              },
            ],
            editableCells: ['E2', 'E3', 'E4', 'E5', 'E6', 'E7'],
            hints: [
              'Use =AVERAGE(B2:D2) for the first row, then change the row number for each temperature.',
              'For the overall average, use =AVERAGE(E2:E6) to average all five averages.',
            ],
            successMessage:
              'Excellent! Higher temperatures clearly speed up dissolving. The overall average is 22 seconds.',
            almostCorrectMessage:
              'Values look right but check you used AVERAGE formulas for every cell.',
            incorrectMessage:
              'Use =AVERAGE(B2:D2) through =AVERAGE(B6:D6) for the rows, then =AVERAGE(E2:E6) for the overall.',
            xpValue: 20,
            bonusXp: 5,
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 3: Spotting Patterns & Outliers
    // ═══════════════════════════════════════════════════
    {
      id: 'sm-lesson-3',
      order: 3,
      title: 'Spotting Patterns & Outliers',
      description:
        'Calculate range, identify outliers visually and numerically, and understand when to question data.',
      steps: [
        {
          id: 'sm-3-1',
          order: 1,
          type: 'instruction',
          title: 'What Is Range?',
          instruction:
            'The **range** tells you how spread out your data is.\n\n' +
            '**Range = Maximum value - Minimum value**\n\n' +
            'In a spreadsheet:\n' +
            '`=MAX(range) - MIN(range)`\n\n' +
            '**Example:**\n' +
            'If your three readings are 12, 15, and 11:\n' +
            '- MAX = 15\n' +
            '- MIN = 11\n' +
            '- Range = 4\n\n' +
            'A **small range** means your measurements are consistent and reliable. A **large range** means there is more uncertainty.\n\n' +
            'If one reading is very different from the others, it might be an **outlier**: a value caused by a mistake or unusual event.',
          whyItMatters:
            'Range helps you judge how much you can trust your average. Two experiments can have the same mean but very different reliability.',
        },
        {
          id: 'sm-3-2',
          order: 2,
          type: 'task',
          title: 'Calculate the Range',
          instruction:
            'A student tested how well different materials conduct heat. They ran three trials for each material.\n\n' +
            '1. Calculate the **average** conductivity for each material in column F:\n' +
            '   - **F2**: =AVERAGE(B2:D2)\n' +
            '   - Continue for F3 through F6\n' +
            '2. Calculate the **range** for each material in column G:\n' +
            '   - **G2**: =MAX(B2:D2)-MIN(B2:D2)\n' +
            '   - Continue for G3 through G6\n\n' +
            'Click **Check**.',
          whyItMatters:
            'Average tells you the typical value. Range tells you how trustworthy that average is.',
          initialSheetState: {
            name: 'Sheet1',
            row: 8,
            column: 8,
            celldata: [
              {
                r: 0,
                c: 0,
                v: { v: 'Material', m: 'Material', bl: 1, bg: '#e8f0fe' },
              },
              {
                r: 0,
                c: 1,
                v: { v: 'Trial 1', m: 'Trial 1', bl: 1, bg: '#e8f0fe' },
              },
              {
                r: 0,
                c: 2,
                v: { v: 'Trial 2', m: 'Trial 2', bl: 1, bg: '#e8f0fe' },
              },
              {
                r: 0,
                c: 3,
                v: { v: 'Trial 3', m: 'Trial 3', bl: 1, bg: '#e8f0fe' },
              },
              {
                r: 0,
                c: 5,
                v: { v: 'Average', m: 'Average', bl: 1, bg: '#fff3cd' },
              },
              {
                r: 0,
                c: 6,
                v: { v: 'Range', m: 'Range', bl: 1, bg: '#fff3cd' },
              },
              { r: 1, c: 0, v: { v: 'Copper', m: 'Copper' } },
              { r: 1, c: 1, v: { v: 95, m: '95' } },
              { r: 1, c: 2, v: { v: 97, m: '97' } },
              { r: 1, c: 3, v: { v: 96, m: '96' } },
              { r: 2, c: 0, v: { v: 'Aluminium', m: 'Aluminium' } },
              { r: 2, c: 1, v: { v: 70, m: '70' } },
              { r: 2, c: 2, v: { v: 74, m: '74' } },
              { r: 2, c: 3, v: { v: 72, m: '72' } },
              { r: 3, c: 0, v: { v: 'Plastic', m: 'Plastic' } },
              { r: 3, c: 1, v: { v: 2, m: '2' } },
              { r: 3, c: 2, v: { v: 4, m: '4' } },
              { r: 3, c: 3, v: { v: 6, m: '6' } },
              { r: 4, c: 0, v: { v: 'Wood', m: 'Wood' } },
              { r: 4, c: 1, v: { v: 1, m: '1' } },
              { r: 4, c: 2, v: { v: 3, m: '3' } },
              { r: 4, c: 3, v: { v: 5, m: '5' } },
              { r: 5, c: 0, v: { v: 'Glass', m: 'Glass' } },
              { r: 5, c: 1, v: { v: 8, m: '8' } },
              { r: 5, c: 2, v: { v: 10, m: '10' } },
              { r: 5, c: 3, v: { v: 12, m: '12' } },
            ],
          },
          task: {
            id: 'task-sm-3-2',
            expectations: [
              {
                cellRef: 'F2',
                expectedValue: 96,
                expectedFormula: '=AVERAGE(B2:D2)',
                checkFormula: true,
              },
              {
                cellRef: 'F3',
                expectedValue: 72,
                expectedFormula: '=AVERAGE(B3:D3)',
                checkFormula: true,
              },
              {
                cellRef: 'F4',
                expectedValue: 4,
                expectedFormula: '=AVERAGE(B4:D4)',
                checkFormula: true,
              },
              {
                cellRef: 'F5',
                expectedValue: 3,
                expectedFormula: '=AVERAGE(B5:D5)',
                checkFormula: true,
              },
              {
                cellRef: 'F6',
                expectedValue: 10,
                expectedFormula: '=AVERAGE(B6:D6)',
                checkFormula: true,
              },
              {
                cellRef: 'G2',
                expectedValue: 2,
                expectedFormula: '=MAX(B2:D2)-MIN(B2:D2)',
                checkFormula: true,
              },
              {
                cellRef: 'G3',
                expectedValue: 4,
                expectedFormula: '=MAX(B3:D3)-MIN(B3:D3)',
                checkFormula: true,
              },
              {
                cellRef: 'G4',
                expectedValue: 4,
                expectedFormula: '=MAX(B4:D4)-MIN(B4:D4)',
                checkFormula: true,
              },
              {
                cellRef: 'G5',
                expectedValue: 4,
                expectedFormula: '=MAX(B5:D5)-MIN(B5:D5)',
                checkFormula: true,
              },
              {
                cellRef: 'G6',
                expectedValue: 4,
                expectedFormula: '=MAX(B6:D6)-MIN(B6:D6)',
                checkFormula: true,
              },
            ],
            editableCells: [
              'F2',
              'F3',
              'F4',
              'F5',
              'F6',
              'G2',
              'G3',
              'G4',
              'G5',
              'G6',
            ],
            hints: [
              'Use =AVERAGE(B2:D2) in F2, then change the row number for each material.',
              'Use =MAX(B2:D2)-MIN(B2:D2) in G2. This subtracts the smallest reading from the largest.',
            ],
            successMessage:
              'Copper has the highest conductivity AND the smallest range. That is a reliable result!',
            almostCorrectMessage:
              'Values look right but check you used formulas, not typed numbers.',
            incorrectMessage:
              'Use AVERAGE in column F and =MAX(...)-MIN(...) in column G for each row.',
            xpValue: 20,
            bonusXp: 5,
          },
        },
        {
          id: 'sm-3-3',
          order: 3,
          type: 'quiz',
          title: 'Spot the Outlier',
          instruction:
            'A student measured the bounce height of a ball three times: 45 cm, 12 cm, and 47 cm. Which statement is the BEST response?',
          quiz: {
            type: 'multiple-choice',
            options: [
              'Delete 12 cm immediately and keep the other two.',
              'Keep all three values because every measurement matters.',
              'Check if 12 cm was caused by a mistake, then decide.',
              'Replace 12 cm with the average of 45 and 47.',
            ],
            correctAnswer: 'Check if 12 cm was caused by a mistake, then decide.',
            explanation:
              'Good scientists do not blindly delete odd data, but they do not ignore obvious errors either. Check your notes, repeat the trial if possible, and explain your decision.',
          },
          task: {
            id: 'task-sm-3-3',
            expectations: [],
            editableCells: [],
            hints: [
              'Think about what a scientist would do in a real lab.',
              'Deleting data without checking why is dishonest. Keeping an obvious error is unscientific.',
            ],
            successMessage:
              'Correct! Always investigate outliers before deciding what to do with them.',
            incorrectMessage:
              'The best approach is to investigate first, then decide based on evidence.',
            xpValue: 5,
          },
        },
        {
          id: 'sm-3-4',
          order: 4,
          type: 'challenge',
          title: 'Clean the Dataset',
          instruction:
            'A student dropped a ball from three heights and measured how high it bounced. Look at the data carefully.\n\n' +
            '1. In **F3**, type the **corrected average** for the 100 cm drop (exclude the obvious error).\n' +
            '2. In **G3**, type a note explaining what happened: **outlier**.\n\n' +
            'Click **Check**.',
          whyItMatters:
            'Being able to spot and flag bad data is one of the most important skills in experimental science.',
          initialSheetState: {
            name: 'Sheet1',
            row: 6,
            column: 8,
            celldata: [
              {
                r: 0,
                c: 0,
                v: { v: 'Drop height', m: 'Drop height', bl: 1, bg: '#e8f0fe' },
              },
              {
                r: 0,
                c: 1,
                v: { v: 'Trial 1', m: 'Trial 1', bl: 1, bg: '#e8f0fe' },
              },
              {
                r: 0,
                c: 2,
                v: { v: 'Trial 2', m: 'Trial 2', bl: 1, bg: '#e8f0fe' },
              },
              {
                r: 0,
                c: 3,
                v: { v: 'Trial 3', m: 'Trial 3', bl: 1, bg: '#e8f0fe' },
              },
              {
                r: 0,
                c: 5,
                v: { v: 'Average', m: 'Average', bl: 1, bg: '#fff3cd' },
              },
              {
                r: 0,
                c: 6,
                v: { v: 'Notes', m: 'Notes', bl: 1, bg: '#fff3cd' },
              },
              { r: 1, c: 0, v: { v: '50 cm', m: '50 cm' } },
              { r: 1, c: 1, v: { v: 22, m: '22' } },
              { r: 1, c: 2, v: { v: 23, m: '23' } },
              { r: 1, c: 3, v: { v: 21, m: '21' } },
              { r: 2, c: 0, v: { v: '100 cm', m: '100 cm' } },
              { r: 2, c: 1, v: { v: 45, m: '45' } },
              { r: 2, c: 2, v: { v: 999, m: '999' } },
              { r: 2, c: 3, v: { v: 47, m: '47' } },
              { r: 3, c: 0, v: { v: '150 cm', m: '150 cm' } },
              { r: 3, c: 1, v: { v: 68, m: '68' } },
              { r: 3, c: 2, v: { v: 67, m: '67' } },
              { r: 3, c: 3, v: { v: 69, m: '69' } },
            ],
          },
          task: {
            id: 'task-sm-3-4',
            expectations: [
              { cellRef: 'F3', expectedValue: 46 },
              { cellRef: 'G3', expectedValue: 'outlier' },
            ],
            editableCells: ['F3', 'G3'],
            hints: [
              'One trial at 100 cm is obviously wrong. A ball cannot bounce 999 cm from a 100 cm drop.',
              'The corrected average of the two valid trials is (45 + 47) / 2 = 46.',
            ],
            successMessage:
              'Well spotted! 999 cm is impossible. The corrected average is 46 cm.',
            incorrectMessage:
              'Type 46 in F3 (the corrected average) and outlier in G3.',
            xpValue: 15,
            bonusXp: 5,
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 4: Graphing Experimental Results
    // ═══════════════════════════════════════════════════
    {
      id: 'sm-lesson-4',
      order: 4,
      title: 'Graphing Experimental Results',
      description:
        'Choose and build the right chart type for scientific data, and read trends from charts.',
      steps: [
        {
          id: 'sm-4-1',
          order: 1,
          type: 'instruction',
          title: 'Charts in Science',
          instruction:
            'Scientists use charts to make patterns visible. Choosing the wrong chart can hide the story your data is trying to tell.\n\n' +
            '**Bar charts**: best for **comparing categories**\n' +
            '- Example: average plant height for different fertilisers\n\n' +
            '**Line charts**: best for **trends over a continuous variable**\n' +
            '- Example: solubility as temperature increases\n\n' +
            '**Pie charts**: best for **parts of a whole**\n' +
            '- Example: proportions of different gases in air\n\n' +
            '**In science, line charts are especially useful** because they show how one continuous variable affects another. The slope of the line tells you how strong the relationship is.',
          whyItMatters:
            'A good chart makes your conclusion obvious. A bad chart makes it invisible.',
        },
        {
          id: 'sm-4-2',
          order: 2,
          type: 'chart',
          title: 'Build a Bar Chart',
          instruction:
            'This data shows average plant height after four weeks using different fertilisers.\n\n' +
            'Build a **bar chart** using the chart builder on the right.\n\n' +
            '1. Select **Bar** as the chart type\n' +
            '2. Set the X-axis to **Fertiliser**\n' +
            '3. Set the Y-axis to **Average Height (cm)**\n\n' +
            'Then click **Check**.',
          whyItMatters:
            'Bar charts make it easy to compare categories at a glance.',
          chartConfig: {
            type: 'bar',
            dataSource: 'sheet',
            xKey: 'Fertiliser',
            yKey: 'Average Height (cm)',
            title: 'Plant Height by Fertiliser',
          },
          chartTask: {
            expectedChartType: 'bar',
            expectedXKey: 'Fertiliser',
            expectedYKey: 'Average Height (cm)',
          },
          initialSheetState: {
            name: 'Sheet1',
            row: 6,
            column: 3,
            celldata: [
              {
                r: 0,
                c: 0,
                v: { v: 'Fertiliser', m: 'Fertiliser', bl: 1, bg: '#e8f0fe' },
              },
              {
                r: 0,
                c: 1,
                v: {
                  v: 'Average Height (cm)',
                  m: 'Average Height (cm)',
                  bl: 1,
                  bg: '#e8f0fe',
                },
              },
              { r: 1, c: 0, v: { v: 'None', m: 'None' } },
              { r: 1, c: 1, v: { v: 8, m: '8' } },
              { r: 2, c: 0, v: { v: 'Basic', m: 'Basic' } },
              { r: 2, c: 1, v: { v: 12, m: '12' } },
              { r: 3, c: 0, v: { v: 'Premium', m: 'Premium' } },
              { r: 3, c: 1, v: { v: 18, m: '18' } },
              { r: 4, c: 0, v: { v: 'Organic', m: 'Organic' } },
              { r: 4, c: 1, v: { v: 15, m: '15' } },
            ],
          },
          task: {
            id: 'task-sm-4-2',
            expectations: [],
            editableCells: [],
            hints: [
              'Choose Bar as the chart type.',
              'Set X-axis to Fertiliser and Y-axis to Average Height (cm).',
            ],
            successMessage:
              'Perfect bar chart! Premium fertiliser produced the tallest plants.',
            incorrectMessage:
              'Select Bar chart type, X-axis = Fertiliser, Y-axis = Average Height (cm).',
            xpValue: 15,
            bonusXp: 5,
          },
        },
        {
          id: 'sm-4-3',
          order: 3,
          type: 'chart',
          title: 'Build a Line Chart',
          instruction:
            'This data shows how the solubility of salt changes with temperature.\n\n' +
            'Build a **line chart** using the chart builder.\n\n' +
            '1. Select **Line** as the chart type\n' +
            '2. Set the X-axis to **Temperature (C)**\n' +
            '3. Set the Y-axis to **Solubility (g/100mL)**\n\n' +
            'Then click **Check**.',
          whyItMatters:
            'Line charts reveal trends and help you predict values between your measured points.',
          chartConfig: {
            type: 'line',
            dataSource: 'sheet',
            xKey: 'Temperature (C)',
            yKey: 'Solubility (g/100mL)',
            title: 'Salt Solubility vs Temperature',
          },
          chartTask: {
            expectedChartType: 'line',
            expectedXKey: 'Temperature (C)',
            expectedYKey: 'Solubility (g/100mL)',
          },
          initialSheetState: {
            name: 'Sheet1',
            row: 7,
            column: 3,
            celldata: [
              {
                r: 0,
                c: 0,
                v: { v: 'Temperature (C)', m: 'Temperature (C)', bl: 1, bg: '#e8f0fe' },
              },
              {
                r: 0,
                c: 1,
                v: {
                  v: 'Solubility (g/100mL)',
                  m: 'Solubility (g/100mL)',
                  bl: 1,
                  bg: '#e8f0fe',
                },
              },
              { r: 1, c: 0, v: { v: 0, m: '0' } },
              { r: 1, c: 1, v: { v: 15, m: '15' } },
              { r: 2, c: 0, v: { v: 20, m: '20' } },
              { r: 2, c: 1, v: { v: 22, m: '22' } },
              { r: 3, c: 0, v: { v: 40, m: '40' } },
              { r: 3, c: 1, v: { v: 28, m: '28' } },
              { r: 4, c: 0, v: { v: 60, m: '60' } },
              { r: 4, c: 1, v: { v: 42, m: '42' } },
              { r: 5, c: 0, v: { v: 80, m: '80' } },
              { r: 5, c: 1, v: { v: 58, m: '58' } },
            ],
          },
          task: {
            id: 'task-sm-4-3',
            expectations: [],
            editableCells: [],
            hints: [
              'Choose Line as the chart type.',
              'Set X-axis to Temperature (C) and Y-axis to Solubility (g/100mL).',
            ],
            successMessage:
              'Great line chart! Solubility rises steeply as temperature increases.',
            incorrectMessage:
              'Select Line chart type, X-axis = Temperature (C), Y-axis = Solubility (g/100mL).',
            xpValue: 15,
            bonusXp: 5,
          },
        },
        {
          id: 'sm-4-4',
          order: 4,
          type: 'quiz',
          title: 'Choose the Right Chart',
          instruction:
            'A scientist wants to show what percentage of the atmosphere is nitrogen, oxygen, and other gases. Which chart is best?',
          quiz: {
            type: 'multiple-choice',
            options: ['Bar chart', 'Line chart', 'Pie chart', 'Area chart'],
            correctAnswer: 'Pie chart',
            explanation:
              'A pie chart is designed to show parts of a whole. Bar and line charts are for comparing values or showing trends, not proportions.',
          },
          task: {
            id: 'task-sm-4-4',
            expectations: [],
            editableCells: [],
            hints: [
              'Think about what the scientist is showing: percentages that add up to 100%.',
              'Which chart type divides a circle into slices?',
            ],
            successMessage: 'Correct! Pie charts show parts of a whole.',
            incorrectMessage:
              'When showing proportions that add to 100%, a pie chart is the clearest choice.',
            xpValue: 5,
          },
        },
        {
          id: 'sm-4-5',
          order: 5,
          type: 'task',
          title: 'Read Your Own Chart',
          instruction:
            'Use the solubility data from the previous step to answer these questions.\n\n' +
            '1. In **B8**, type the solubility at **60 C**.\n' +
            '2. In **B9**, type the trend direction: either **increasing** or **decreasing**.\n\n' +
            'Click **Check**.',
          whyItMatters:
            'Building a chart is only half the skill. You must also extract specific values and describe the overall trend.',
          initialSheetState: {
            name: 'Sheet1',
            row: 11,
            column: 3,
            celldata: [
              {
                r: 0,
                c: 0,
                v: { v: 'Temperature (C)', m: 'Temperature (C)', bl: 1, bg: '#e8f0fe' },
              },
              {
                r: 0,
                c: 1,
                v: {
                  v: 'Solubility (g/100mL)',
                  m: 'Solubility (g/100mL)',
                  bl: 1,
                  bg: '#e8f0fe',
                },
              },
              { r: 1, c: 0, v: { v: 0, m: '0' } },
              { r: 1, c: 1, v: { v: 15, m: '15' } },
              { r: 2, c: 0, v: { v: 20, m: '20' } },
              { r: 2, c: 1, v: { v: 22, m: '22' } },
              { r: 3, c: 0, v: { v: 40, m: '40' } },
              { r: 3, c: 1, v: { v: 28, m: '28' } },
              { r: 4, c: 0, v: { v: 60, m: '60' } },
              { r: 4, c: 1, v: { v: 42, m: '42' } },
              { r: 5, c: 0, v: { v: 80, m: '80' } },
              { r: 5, c: 1, v: { v: 58, m: '58' } },
              {
                r: 7,
                c: 0,
                v: { v: 'Questions', m: 'Questions', bl: 1, bg: '#e8f0fe' },
              },
              {
                r: 8,
                c: 0,
                v: { v: 'Solubility at 60 C?', m: 'Solubility at 60 C?', bl: 1, bg: '#fff3cd' },
              },
              { r: 8, c: 1, v: { bg: '#fff3cd' } },
              {
                r: 9,
                c: 0,
                v: {
                  v: 'Trend direction?',
                  m: 'Trend direction?',
                  bl: 1,
                  bg: '#fff3cd',
                },
              },
              { r: 9, c: 1, v: { bg: '#fff3cd' } },
            ],
          },
          task: {
            id: 'task-sm-4-5',
            expectations: [
              { cellRef: 'B9', expectedValue: 42 },
              { cellRef: 'B10', expectedValue: 'increasing' },
            ],
            editableCells: ['B9', 'B10'],
            hints: [
              'Look at the row where Temperature is 60. The solubility value is in the next column.',
              'As temperature goes up, does solubility go up or down?',
            ],
            successMessage:
              'Correct! At 60 C the solubility is 42 g/100mL, and the trend is clearly increasing.',
            incorrectMessage:
              'B9 should be 42 (solubility at 60 C). B10 should be increasing.',
            xpValue: 10,
            bonusXp: 5,
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // LESSON 5: Drawing Conclusions
    // ═══════════════════════════════════════════════════
    {
      id: 'sm-lesson-5',
      order: 5,
      title: 'Drawing Conclusions',
      description:
        'Relate results back to your hypothesis and understand the difference between correlation and causation.',
      steps: [
        {
          id: 'sm-5-1',
          order: 1,
          type: 'instruction',
          title: 'From Data to Conclusion',
          instruction:
            'A conclusion is not just a guess. It is a statement backed by the numbers you collected.\n\n' +
            'A good conclusion has two parts:\n' +
            '1. **What the data shows**: state the trend or comparison clearly\n' +
            '2. **Whether the hypothesis is supported**: did the results match your prediction?\n\n' +
            '**Example:**\n' +
            '"The data shows that plants under high light grew to an average of 18 cm, while plants under low light only reached 8 cm. This supports the hypothesis that more light leads to taller plants."\n\n' +
            '**Warning: Correlation is not causation!**\n' +
            'Just because two things change together does not mean one caused the other. Always check for controlled variables before claiming cause and effect.',
          whyItMatters:
            'Science progresses because conclusions are evidence-based. A weak conclusion wastes good data.',
        },
        {
          id: 'sm-5-2',
          order: 2,
          type: 'task',
          title: 'Write a Conclusion',
          instruction:
            'Use the hypothesis and results below to write a conclusion.\n\n' +
            '1. In **B5**, type whether the hypothesis is **supported** or **not supported**.\n' +
            '2. In **B6**, write one sentence explaining your choice.\n\n' +
            'Click **Check**.',
          whyItMatters:
            'Practising conclusions with simple examples builds confidence for writing your own later.',
          initialSheetState: {
            name: 'Sheet1',
            row: 8,
            column: 4,
            celldata: [
              {
                r: 0,
                c: 0,
                v: {
                  v: 'Hypothesis: Plants given more light will grow taller.',
                  m: 'Hypothesis: Plants given more light will grow taller.',
                  bl: 1,
                },
              },
              {
                r: 2,
                c: 0,
                v: {
                  v: 'Results: Low light averaged 8 cm. High light averaged 18 cm.',
                  m: 'Results: Low light averaged 8 cm. High light averaged 18 cm.',
                  bl: 1,
                },
              },
              {
                r: 4,
                c: 0,
                v: {
                  v: 'Conclusion: The hypothesis is',
                  m: 'Conclusion: The hypothesis is',
                  bl: 1,
                  bg: '#fff3cd',
                },
              },
              { r: 4, c: 1, v: { bg: '#fff3cd' } },
              {
                r: 5,
                c: 0,
                v: { v: 'Reason:', m: 'Reason:', bl: 1, bg: '#fff3cd' },
              },
              { r: 5, c: 1, v: { bg: '#fff3cd' } },
            ],
          },
          task: {
            id: 'task-sm-5-2',
            expectations: [
              { cellRef: 'B5', expectedValue: 'supported' },
              { cellRef: 'B6' },
            ],
            editableCells: ['B5', 'B6'],
            hints: [
              'The high-light plants grew more than twice as tall. Does that match the hypothesis?',
              'Write one sentence explaining why the results support or reject the prediction.',
            ],
            successMessage:
              'Strong conclusion! The data clearly supports the hypothesis.',
            incorrectMessage:
              'Type supported in B5 (the high-light plants grew taller). Write a one-sentence reason in B6.',
            xpValue: 10,
            bonusXp: 5,
          },
        },
        {
          id: 'sm-5-3',
          order: 3,
          type: 'quiz',
          title: 'Correlation or Causation?',
          instruction:
            'Ice cream sales and drowning incidents both rise in summer. A news headline claims "Ice cream causes drowning." What is wrong with this claim?',
          quiz: {
            type: 'multiple-choice',
            options: [
              'The data is probably fake.',
              'Both are caused by a third factor: hot weather.',
              'Ice cream actually prevents drowning.',
              'Drowning causes people to buy ice cream.',
            ],
            correctAnswer: 'Both are caused by a third factor: hot weather.',
            explanation:
              'This is a classic example of correlation vs causation. Both ice cream sales and swimming (which leads to drowning) increase in hot weather. The heat is the lurking variable.',
          },
          task: {
            id: 'task-sm-5-3',
            expectations: [],
            editableCells: [],
            hints: [
              'Think about what happens in summer that could affect BOTH ice cream sales and swimming.',
              'Is there a hidden factor that causes both things to increase?',
            ],
            successMessage:
              'Exactly! Hot weather is the real cause. Never assume causation from correlation alone.',
            incorrectMessage:
              'The key insight is that a third factor (hot weather) influences both variables.',
            xpValue: 5,
          },
        },
        {
          id: 'sm-5-4',
          order: 4,
          type: 'challenge',
          title: 'The Full Lab Report',
          instruction:
            'Complete this digital lab report for an experiment about surface texture and sliding distance.\n\n' +
            '1. In **B5**, type the **dependent variable** for this experiment.\n' +
            '2. In **E11:E13**, calculate the **average** sliding distance for each surface.\n' +
            '3. In **B16**, type whether the hypothesis is **supported** or **not supported**.\n' +
            '4. In **B17**, write one sentence explaining your conclusion.\n\n' +
            'Click **Check** to submit your assessment.',
          whyItMatters:
            'This combines every skill from the module: identifying variables, calculating averages, and writing evidence-based conclusions.',
          initialSheetState: {
            name: 'Sheet1',
            row: 19,
            column: 6,
            celldata: [
              {
                r: 0,
                c: 0,
                v: {
                  v: 'Experiment: Does surface texture affect sliding distance?',
                  m: 'Experiment: Does surface texture affect sliding distance?',
                  bl: 1,
                },
              },
              {
                r: 2,
                c: 0,
                v: { v: 'Variables', m: 'Variables', bl: 1, bg: '#e8f0fe' },
              },
              {
                r: 3,
                c: 0,
                v: { v: 'Independent:', m: 'Independent:', bl: 1 },
              },
              {
                r: 3,
                c: 1,
                v: { v: 'Surface texture', m: 'Surface texture' },
              },
              {
                r: 4,
                c: 0,
                v: { v: 'Dependent:', m: 'Dependent:', bl: 1, bg: '#fff3cd' },
              },
              { r: 4, c: 1, v: { bg: '#fff3cd' } },
              {
                r: 5,
                c: 0,
                v: { v: 'Controlled 1:', m: 'Controlled 1:', bl: 1 },
              },
              {
                r: 5,
                c: 1,
                v: { v: 'Ramp height', m: 'Ramp height' },
              },
              {
                r: 6,
                c: 0,
                v: { v: 'Controlled 2:', m: 'Controlled 2:', bl: 1 },
              },
              {
                r: 6,
                c: 1,
                v: { v: 'Ball type', m: 'Ball type' },
              },
              {
                r: 8,
                c: 0,
                v: { v: 'Data', m: 'Data', bl: 1, bg: '#e8f0fe' },
              },
              {
                r: 9,
                c: 0,
                v: { v: 'Surface', m: 'Surface', bl: 1, bg: '#e8f0fe' },
              },
              {
                r: 9,
                c: 1,
                v: { v: 'Trial 1', m: 'Trial 1', bl: 1, bg: '#e8f0fe' },
              },
              {
                r: 9,
                c: 2,
                v: { v: 'Trial 2', m: 'Trial 2', bl: 1, bg: '#e8f0fe' },
              },
              {
                r: 9,
                c: 3,
                v: { v: 'Trial 3', m: 'Trial 3', bl: 1, bg: '#e8f0fe' },
              },
              {
                r: 9,
                c: 4,
                v: { v: 'Average', m: 'Average', bl: 1, bg: '#fff3cd' },
              },
              { r: 10, c: 0, v: { v: 'Wood', m: 'Wood' } },
              { r: 10, c: 1, v: { v: 45, m: '45' } },
              { r: 10, c: 2, v: { v: 47, m: '47' } },
              { r: 10, c: 3, v: { v: 46, m: '46' } },
              { r: 11, c: 0, v: { v: 'Carpet', m: 'Carpet' } },
              { r: 11, c: 1, v: { v: 22, m: '22' } },
              { r: 11, c: 2, v: { v: 24, m: '24' } },
              { r: 11, c: 3, v: { v: 23, m: '23' } },
              { r: 12, c: 0, v: { v: 'Ice', m: 'Ice' } },
              { r: 12, c: 1, v: { v: 85, m: '85' } },
              { r: 12, c: 2, v: { v: 83, m: '83' } },
              { r: 12, c: 3, v: { v: 84, m: '84' } },
              {
                r: 14,
                c: 0,
                v: { v: 'Conclusion', m: 'Conclusion', bl: 1, bg: '#e8f0fe' },
              },
              {
                r: 15,
                c: 0,
                v: {
                  v: 'The hypothesis is',
                  m: 'The hypothesis is',
                  bl: 1,
                  bg: '#fff3cd',
                },
              },
              { r: 15, c: 1, v: { bg: '#fff3cd' } },
              {
                r: 16,
                c: 0,
                v: { v: 'Reason:', m: 'Reason:', bl: 1, bg: '#fff3cd' },
              },
              { r: 16, c: 1, v: { bg: '#fff3cd' } },
            ],
          },
          task: {
            id: 'task-sm-5-4',
            expectations: [
              { cellRef: 'B5', expectedValue: 'Sliding distance' },
              {
                cellRef: 'E11',
                expectedValue: 46,
                expectedFormula: '=AVERAGE(B11:D11)',
                checkFormula: true,
              },
              {
                cellRef: 'E12',
                expectedValue: 23,
                expectedFormula: '=AVERAGE(B12:D12)',
                checkFormula: true,
              },
              {
                cellRef: 'E13',
                expectedValue: 84,
                expectedFormula: '=AVERAGE(B13:D13)',
                checkFormula: true,
              },
              { cellRef: 'B16', expectedValue: 'supported' },
              { cellRef: 'B17' },
            ],
            editableCells: [
              'B5',
              'E11',
              'E12',
              'E13',
              'B16',
              'B17',
            ],
            hints: [],
            successMessage:
              'Assessment complete! You have planned an experiment, processed data, and drawn a valid conclusion.',
            incorrectMessage:
              'Check: B5 = Sliding distance, E11:E13 use AVERAGE formulas, B16 = supported, B17 has a reason.',
            xpValue: 25,
          },
          isAssessment: true,
        },
      ],
    },
  ],
};
