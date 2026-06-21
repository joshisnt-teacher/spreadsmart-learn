import type { Module } from '@/types/lesson';

export const designThinkingModule: Module = {
  id: 'design-thinking-101',
  title: 'Design Thinking: Solve Problems Like an Engineer',
  description: 'Learn how engineers and designers solve practical problems by understanding people, brainstorming ideas, building prototypes, and testing their solutions.',
  estimatedMinutes: 30,
  bannerUrl: 'https://ribpzkdzvpqyheftxblz.supabase.co/storage/v1/object/public/module-banners/data-modelling-banner.jpg',
  lessons: [
    {
      id: 'lesson-understand',
      order: 1,
      title: 'Understanding People and Problems',
      description: 'Learn how to find problems worth solving and understand the people who have them.',
      steps: [
        // Step 1: Intro
        {
          id: 'dt-step-1',
          order: 1,
          type: 'instruction',
          title: 'What is Design Thinking?',
          instruction:
            'Have you ever used something that was annoying or did not work properly?\n\n' +
            'Maybe a water bottle that always leaks in your bag, a locker you can never find things in, or a chair that hurts your back after sitting for an hour.\n\n' +
            '**Design thinking** is how engineers and inventors fix problems like these. It is not about being artistic; it is about being curious and practical.\n\n' +
            'The process has 5 steps:\n' +
            '1. **Empathise** - Understand the person who has the problem\n' +
            '2. **Define** - Clearly state what the problem is\n' +
            '3. **Ideate** - Brainstorm lots of possible solutions\n' +
            '4. **Prototype** - Build a rough version to test\n' +
            '5. **Test** - Try it out, get feedback, and improve\n\n' +
            '**Note:** Some people swap steps 1 and 2, or use slightly different names. That is fine. The important thing is that you understand the person and the problem before you start building solutions.\n\n' +
            'In this module, you will design a **better reusable water bottle** for a student in your class. Let us get started.',
          whyItMatters: 'Design thinking is used by companies like Apple, Nike, and Tesla to create products people actually want to use.',
          mediaUrl: 'https://www.youtube.com/embed/_r0VX-aU_T8',
        },

        // Step 2: Define
        {
          id: 'dt-step-2',
          order: 2,
          type: 'instruction',
          title: 'Step 1: Define the Problem',
          instruction:
            'Before you can solve a problem, you need to **clearly say what the problem is**.\n\n' +
            'Engineers use a simple sentence format:\n\n' +
            '`[Who] needs [what] because [why].`\n\n' +
            '**Example:**\n' +
            '`A year 7 student needs a water bottle that does not leak because their books and laptop keep getting wet in their bag.`\n\n' +
            '**Your task:**\n' +
            'Think about your partner. What is wrong with their current water bottle?\n\n' +
            '- Does it leak when it tips over?\n' +
            '- Is it too big to fit in their bag?\n' +
            '- Does the water get warm by lunchtime?\n' +
            '- Is the lid hard to open one-handed?\n\n' +
            'A good definition might be:\n' +
            '`My partner needs a water bottle that stays sealed in their bag because they walk to school and it always tips over.`',
          whyItMatters: 'If you do not define the problem clearly, you might build something nobody actually needs.',
        },

        // Step 3: Quiz on Define
        {
          id: 'dt-step-3',
          order: 3,
          type: 'quiz',
          title: 'Quick Check: Define',
          instruction: 'Which of the following is the BEST problem definition?',
          quiz: {
            type: 'multiple-choice',
            options: [
              'My partner wants a water bottle that looks cool and matches their bag.',
              'My partner needs a bottle that does not leak because their books get wet.',
              'My partner needs a bottle with a locking lid because it tips over in their bag.',
              'My partner needs a water bottle because all of their friends already have one.',
            ],
            correctAnswer: 'My partner needs a bottle that does not leak because their books get wet.',
            explanation: 'This answer clearly states WHO (my partner), WHAT (a bottle that does not leak), and WHY (their books get wet). Option A focuses on wants instead of needs; Option C jumps to a specific solution; Option D has no meaningful reason.',
          },
          task: {
            id: 'task-dt-step-3',
            expectations: [],
            editableCells: [],
            hints: ['Look for the sentence that follows the "Who needs what because why" format.'],
            successMessage: 'Correct! A clear problem definition includes who, what, and why.',
            incorrectMessage: 'Not quite - the best answer explains who has the problem, what they need, and why it matters.',
            xpValue: 5,
          },
        },

        // Step 4: Empathize
        {
          id: 'dt-step-4',
          order: 4,
          type: 'instruction',
          title: 'Step 2: Empathise',
          instruction:
            '**Empathy** means understanding how someone else feels and what their life is really like.\n\n' +
            'You are NOT designing a water bottle for yourself. You are designing it for your partner. So you need to **ask questions** and **listen carefully**.\n\n' +
            'Good empathy questions:\n' +
            '- "What annoys you most about your current water bottle?"\n' +
            '- "How do you carry things to school? Bus, walk, or bike?"\n' +
            '- "Do you prefer cold water or room temperature?"\n' +
            '- "Where do you put your bottle during class?"\n' +
            '- "Have you ever lost a water bottle? How?"\n\n' +
            '**Important:** Do not just guess. The best designers talk to real people before they start building.',
          whyItMatters: 'The most famous product failures happen when designers assume they know what people want without actually asking them.',
        },

        // Step 5: Quiz on Empathize
        {
          id: 'dt-step-5',
          order: 5,
          type: 'quiz',
          title: 'Quick Check: Empathise',
          instruction: 'Why is the "Empathise" step important in design thinking?',
          quiz: {
            type: 'multiple-choice',
            options: [
              'So you can build a product you would want to use yourself.',
              'So you understand the person you are designing for.',
              'So you can list the features your product should have.',
              'So you can avoid doing research later in the project.',
            ],
            correctAnswer: 'So you understand the person you are designing for.',
            explanation: 'Empathy helps you understand the real needs, fears, and habits of the person you are designing for. Option A is designing for yourself; Option C confuses empathy with listing features; Option D treats empathy as a shortcut.',
          },
          task: {
            id: 'task-dt-step-5',
            expectations: [],
            editableCells: [],
            hints: ['Think about what the word "empathy" actually means.'],
            successMessage: 'Exactly! Empathy is all about understanding your partner\'s real needs.',
            incorrectMessage: 'Empathy is about understanding the other person; not making things easier for yourself.',
            xpValue: 5,
          },
        },

        // Step 6: Ideate
        {
          id: 'dt-step-6',
          order: 6,
          type: 'instruction',
          title: 'Step 3: Ideate',
          instruction:
            'Now it is time to **brainstorm**. This means coming up with as many ideas as possible; even wild ones.\n\n' +
            '**Rules for good brainstorming:**\n' +
            '- No idea is too silly\n' +
            '- Do not judge ideas while you are listing them\n' +
            '- Build on other people\'s ideas\n' +
            '- Aim for quantity first, quality second\n\n' +
            '**Example ideas for your partner\'s water bottle:**\n' +
            '- A bottle with a locking lid that clicks shut\n' +
            '- A bottle shaped to fit in a locker door\n' +
            '- A bottle with a built-in filter so you can refill from any tap\n' +
            '- A bottle that changes colour when the water gets warm\n' +
            '- A flat bottle that slides into a laptop bag like a book\n\n' +
            'The goal is to have **lots of options** before you pick one. The first idea is rarely the best.',
          whyItMatters: 'Research shows that teams that generate more ideas early on end up with much better final solutions.',
        },

        // Step 7: Quiz on Ideate
        {
          id: 'dt-step-7',
          order: 7,
          type: 'quiz',
          title: 'Quick Check: Ideate',
          instruction: 'During the Ideate step, what should you do?',
          quiz: {
            type: 'multiple-choice',
            options: [
              'Pick your favourite idea and start building it immediately.',
              'Come up with many ideas before you start judging them.',
              'Only keep ideas that you already know will definitely work.',
              'Let the most creative person in your group pick the idea.',
            ],
            correctAnswer: 'Come up with many ideas before you start judging them.',
            explanation: 'Brainstorming works best when you separate idea generation from idea judgement. Option A rushes to building; Option C filters too early; Option D defers to one person instead of collaborating.',
          },
          task: {
            id: 'task-dt-step-7',
            expectations: [],
            editableCells: [],
            hints: ['Think about the phrase "quantity first, quality second".'],
            successMessage: 'Correct! Brainstorming is about generating lots of ideas first, then choosing later.',
            incorrectMessage: 'During ideation, you should avoid judging ideas. Just list as many as you can.',
            xpValue: 5,
          },
        },
      ],
    },

    {
      id: 'lesson-build-test',
      order: 2,
      title: 'Building and Testing Your Idea',
      description: 'Turn your best idea into a rough prototype, test it, and make it better.',
      steps: [
        // Step 8: Prototype
        {
          id: 'dt-step-8',
          order: 1,
          type: 'instruction',
          title: 'Step 4: Prototype',
          instruction:
            'A **prototype** is a rough, early version of your idea. It is NOT perfect; and it is not supposed to be.\n\n' +
            'Prototypes can be:\n' +
            '- A drawing on paper\n' +
            '- A model made from cardboard or plastic bottles\n' +
            '- A storyboard showing how someone would use it\n' +
            '- A slide with labels explaining the features\n\n' +
            '**Example:** If your idea is a "flat water bottle for laptop bags," your prototype might be:\n' +
            '- A drawing showing the shape next to a laptop\n' +
            '- A cardboard cutout taped together so you can feel the size\n' +
            '- Labels showing where the locking lid and rubber seal go\n\n' +
            'The point is to make your idea **real enough that someone can react to it**.',
          whyItMatters: 'Prototypes are cheap to build and cheap to change. If you wait until the "final" version, mistakes become very expensive.',
        },

        // Step 9: Quiz on Prototype
        {
          id: 'dt-step-9',
          order: 2,
          type: 'quiz',
          title: 'Quick Check: Prototype',
          instruction: 'What is the main purpose of a prototype?',
          quiz: {
            type: 'multiple-choice',
            options: [
              'To show people exactly what the finished product will look like.',
              'To learn what works before building the real thing.',
              'To prove that your first idea was the right one from the start.',
              'To replace detailed sketches and planning so you can build faster.',
            ],
            correctAnswer: 'To learn what works before building the real thing.',
            explanation: 'Prototypes let you learn what works and what does not before you invest time in a final version. Option A confuses prototypes with final presentations; Option C assumes the first idea is correct; Option D treats prototyping as a way to skip planning.',
          },
          task: {
            id: 'task-dt-step-9',
            expectations: [],
            editableCells: [],
            hints: ['Think about why you would build something rough instead of perfect.'],
            successMessage: 'Exactly! Prototypes help you learn early and avoid big mistakes later.',
            incorrectMessage: 'A prototype is not the final product; it is a rough version you use to get feedback.',
            xpValue: 5,
          },
        },

        // Step 10: Test
        {
          id: 'dt-step-10',
          order: 3,
          type: 'instruction',
          title: 'Step 5: Test',
          instruction:
            'Testing means showing your prototype to your partner and watching their reaction.\n\n' +
            '**Good testing questions:**\n' +
            '- "What do you like about this bottle design?"\n' +
            '- "What confuses you?"\n' +
            '- "Would this actually fit in your bag? Show me."\n' +
            '- "What would you change? Be honest."\n\n' +
            '**Important:** Do not defend your idea. Just listen.\n\n' +
            'If your partner says "I do not like that the lid needs two hands to open," that is **great feedback**. Now you can go back and improve your design.\n\n' +
            'Design thinking is a **loop**, not a straight line. You might test, redesign, prototype again, and test again.',
          whyItMatters: 'Every product you love; your phone, your shoes, your favourite app; went through dozens of test-and-redesign loops before you ever saw it.',
        },

        // Step 11: Quiz on Test
        {
          id: 'dt-step-11',
          order: 4,
          type: 'quiz',
          title: 'Quick Check: Test',
          instruction: 'If your partner gives you negative feedback during testing, what should you do?',
          quiz: {
            type: 'multiple-choice',
            options: [
              'Explain why their feedback is wrong so they understand your design.',
              'Use the feedback to make your design better.',
              'Only keep the positive feedback and ignore the criticism.',
              'Ask a different person until you get the answer you want.',
            ],
            correctAnswer: 'Use the feedback to make your design better.',
            explanation: 'Negative feedback is not a failure; it is useful information that helps you make your design better. Option A defends instead of listening; Option C cherry-picks praise; Option D seeks confirmation rather than truth.',
          },
          task: {
            id: 'task-dt-step-11',
            expectations: [],
            editableCells: [],
            hints: ['Think about why testing exists in the first place.'],
            successMessage: 'Correct! Feedback, even negative feedback, is how great designs get better.',
            incorrectMessage: 'The whole point of testing is to learn what needs improving. Listen to the feedback.',
            xpValue: 5,
          },
        },

        // Step 12: Assessment
        {
          id: 'dt-step-12',
          order: 5,
          type: 'quiz',
          title: 'Design Thinking Assessment',
          instruction: 'Which of the following shows someone using the design thinking process properly?',
          quiz: {
            type: 'multiple-choice',
            options: [
              'They build the first idea they think of without talking to anyone.',
              'They ask their partner questions, sketch ideas, build a rough model, and then ask for feedback.',
              'They ignore negative feedback because they know their idea is the best.',
              'They spend weeks making their prototype perfect before showing it to anyone.',
            ],
            correctAnswer: 'They ask their partner questions, sketch ideas, build a rough model, and then ask for feedback.',
            explanation: 'This answer shows the full design thinking loop: empathise (ask questions), ideate (sketch ideas), prototype (rough model), and test (ask for feedback). Option A skips empathising; Option C ignores feedback; Option D waits too long to test.',
          },
          task: {
            id: 'task-dt-step-12',
            expectations: [],
            editableCells: [],
            hints: [
              'Think about the module: first we figured out the problem, then we understood the person, then we brainstormed, then we built something rough, then we tested it.',
            ],
            successMessage: 'Assessment passed! You understand the design thinking process.',
            incorrectMessage: 'Think back through the module: Define → Empathise → Ideate → Prototype → Test.',
            xpValue: 15,
            bonusXp: 10,
          },
          isAssessment: true,
        },
      ],
    },
  ],
};
