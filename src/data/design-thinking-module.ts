import type { Module } from '@/types/lesson';

export const designThinkingModule: Module = {
  id: 'design-thinking-101',
  title: 'Design Thinking: Solve Problems Like an Engineer',
  description: 'Learn how engineers and designers solve real-world problems by understanding people, brainstorming ideas, building prototypes, and testing their solutions.',
  estimatedMinutes: 30,
  bannerUrl: 'https://ctfxhxqhvszadozamqkg.supabase.co/storage/v1/object/public/module-banners/design-thinking-banner.png',
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
            'Have you ever used something that was annoying or didn\'t work properly?\n\n' +
            'Maybe a door handle that was tricky to open, or a school bag that hurt your shoulders.\n\n' +
            '**Design thinking** is a way that engineers and inventors solve problems like these. It\'s not about being "artistic" — it\'s about being **curious** and **practical**.\n\n' +
            'The process has 5 steps:\n' +
            '1. **Define** — What is the problem?\n' +
            '2. **Empathize** — Who has this problem?\n' +
            '3. **Ideate** — What ideas could fix it?\n' +
            '4. **Prototype** — Build a rough version\n' +
            '5. **Test** — Try it out and improve\n\n' +
            'In this module, you will design the **perfect pet** for a partner in your class. Let\'s get started!',
          whyItMatters: 'Design thinking is used by companies like Apple, Nike, and Tesla to create products people actually want to use.',
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
            '`A year 7 student needs a water bottle that doesn\'t leak because their books keep getting wet.`\n\n' +
            '**Your task:**\n' +
            'Think about your partner. What kind of pet would they actually want?\n' +
            'Are they allergic to fur? Do they live in a small flat? Are they scared of loud noises?\n\n' +
            'A good definition might be:\n' +
            '`My partner needs a calm, low-maintenance pet because they are busy after school and live in an apartment.`',
          whyItMatters: 'If you don\'t define the problem clearly, you might build something nobody actually needs.',
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
              'My partner wants a cool pet.',
              'My partner needs a pet that does not shed fur because they have allergies.',
              'My partner likes animals.',
              'Pets are fun to have.',
            ],
            correctAnswer: 'My partner needs a pet that does not shed fur because they have allergies.',
            explanation: 'This answer clearly states WHO (my partner), WHAT (a pet that does not shed fur), and WHY (they have allergies).',
          },
          task: {
            id: 'task-dt-step-3',
            expectations: [],
            editableCells: [],
            hints: ['Look for the sentence that follows the "Who needs what because why" format.'],
            successMessage: 'Correct! A clear problem definition includes who, what, and why.',
            incorrectMessage: 'Not quite — the best answer explains who has the problem, what they need, and why it matters.',
            xpValue: 5,
          },
        },

        // Step 4: Empathize
        {
          id: 'dt-step-4',
          order: 4,
          type: 'instruction',
          title: 'Step 2: Empathize',
          instruction:
            '**Empathy** means understanding how someone else feels and what their life is really like.\n\n' +
            'You are NOT designing a pet for yourself. You are designing it for your partner. So you need to **ask questions** and **listen carefully**.\n\n' +
            'Good empathy questions:\n' +
            '- "Have you ever had a pet before? What happened?"\n' +
            '- "How much time do you have after school?"\n' +
            '- "What scares you about owning a pet?"\n' +
            '- "What would make you really excited to come home?"\n\n' +
            '**Important:** Don\'t just guess. The best designers talk to real people before they start building.',
          whyItMatters: 'The most famous product failures happen when designers assume they know what people want without actually asking them.',
        },

        // Step 5: Quiz on Empathize
        {
          id: 'dt-step-5',
          order: 5,
          type: 'quiz',
          title: 'Quick Check: Empathize',
          instruction: 'Why is the "Empathize" step important in design thinking?',
          quiz: {
            type: 'multiple-choice',
            options: [
              'So you can build whatever you want',
              'So you understand the person you are designing for',
              'So you can skip the testing step',
              'So the project takes less time',
            ],
            correctAnswer: 'So you understand the person you are designing for',
            explanation: 'Empathy helps you understand the real needs, fears, and desires of the person you are designing for.',
          },
          task: {
            id: 'task-dt-step-5',
            expectations: [],
            editableCells: [],
            hints: ['Think about what the word "empathy" actually means.'],
            successMessage: 'Exactly! Empathy is all about understanding your partner\'s real needs.',
            incorrectMessage: 'Empathy is about understanding the other person — not making things easier for yourself.',
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
            'Now it\'s time to **brainstorm**. This means coming up with as many ideas as possible — even wild ones!\n\n' +
            '**Rules for good brainstorming:**\n' +
            '- No idea is too silly\n' +
            '- Don\'t judge ideas while you are listing them\n' +
            '- Build on other people\'s ideas\n' +
            '- Aim for quantity first, quality second\n\n' +
            '**Example ideas for your partner\'s pet:**\n' +
            '- A robot dog that does not shed\n' +
            '- A pet rock with a personality tracker app\n' +
            '- A small aquarium with glowing fish\n' +
            '- A virtual pet projected on the wall\n\n' +
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
              'Pick the first idea that comes to mind',
              'Judge every idea immediately so you only keep good ones',
              'Come up with many ideas without judging them',
              'Ask someone else to come up with all the ideas',
            ],
            correctAnswer: 'Come up with many ideas without judging them',
            explanation: 'Brainstorming works best when you separate idea generation from idea judgement.',
          },
          task: {
            id: 'task-dt-step-7',
            expectations: [],
            editableCells: [],
            hints: ['Think about the word "quantity first, quality second".'],
            successMessage: 'Correct! Brainstorming is about generating lots of ideas first, then choosing later.',
            incorrectMessage: 'During ideation, you should avoid judging ideas. Just list as many as you can!',
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
            'A **prototype** is a rough, early version of your idea. It is NOT perfect — and it is not supposed to be!\n\n' +
            'Prototypes can be:\n' +
            '- A drawing on paper\n' +
            '- A model made from cardboard or clay\n' +
            '- A storyboard showing how someone would use it\n' +
            '- A digital mockup or slide\n\n' +
            '**Example:** If your idea is a "robot dog," your prototype might be:\n' +
            '- A drawing of what it looks like\n' +
            '- A list of what it can do\n' +
            '- A cardboard box with buttons drawn on it to show the controls\n\n' +
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
              'To sell the product to customers',
              'To show your final, perfect design',
              'To test your idea and get feedback early',
              'To win a design competition',
            ],
            correctAnswer: 'To test your idea and get feedback early',
            explanation: 'Prototypes let you learn what works and what does not before you invest time in a final version.',
          },
          task: {
            id: 'task-dt-step-9',
            expectations: [],
            editableCells: [],
            hints: ['Think about why you would build something rough instead of perfect.'],
            successMessage: 'Exactly! Prototypes help you learn early and avoid big mistakes later.',
            incorrectMessage: 'A prototype is not the final product — it is a rough version you use to get feedback.',
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
            '- "What do you like about this idea?"\n' +
            '- "What confuses you?"\n' +
            '- "What would you change?"\n' +
            '- "Would you actually use this? Be honest!"\n\n' +
            '**Important:** Do not defend your idea. Just listen.\n\n' +
            'If your partner says "I don\'t like that it needs charging every day," that is **great feedback**. Now you can go back and improve your design.\n\n' +
            'Design thinking is a **loop**, not a straight line. You might test, redesign, prototype again, and test again.',
          whyItMatters: 'Every product you love — your phone, your shoes, your favourite app — went through dozens of test-and-redesign loops before you ever saw it.',
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
              'Argue with them and explain why they are wrong',
              'Ignore the feedback and finish the project',
              'Use the feedback to improve your design',
              'Change partners until someone likes it',
            ],
            correctAnswer: 'Use the feedback to improve your design',
            explanation: 'Negative feedback is not a failure — it is valuable information that helps you make your design better.',
          },
          task: {
            id: 'task-dt-step-11',
            expectations: [],
            editableCells: [],
            hints: ['Think about why testing exists in the first place.'],
            successMessage: 'Correct! Feedback — even negative feedback — is how great designs get better.',
            incorrectMessage: 'The whole point of testing is to learn what needs improving. Listen to the feedback!',
            xpValue: 5,
          },
        },

        // Step 12: Assessment
        {
          id: 'dt-step-12',
          order: 5,
          type: 'quiz',
          title: 'Design Thinking Assessment',
          instruction: 'Put the 5 steps of the design thinking process in the correct order.',
          quiz: {
            type: 'multiple-choice',
            options: [
              'Ideate → Define → Empathize → Prototype → Test',
              'Define → Empathize → Ideate → Prototype → Test',
              'Empathize → Define → Ideate → Prototype → Test',
              'Prototype → Test → Ideate → Define → Empathize',
            ],
            correctAnswer: 'Define → Empathize → Ideate → Prototype → Test',
            explanation: 'First define the problem, then understand your user (empathize), brainstorm solutions (ideate), build a rough version (prototype), and finally test it.',
          },
          task: {
            id: 'task-dt-step-12',
            expectations: [],
            editableCells: [],
            hints: [
              'Think about the module: first we figured out the problem, then we understood the person, then we brainstormed, then we built something rough, then we tested it.',
            ],
            successMessage: '🎉 Assessment passed! You understand the design thinking process.',
            incorrectMessage: 'Think back through the module: Define → Empathize → Ideate → Prototype → Test.',
            xpValue: 15,
            bonusXp: 10,
          },
          isAssessment: true,
        },
      ],
    },
  ],
};
