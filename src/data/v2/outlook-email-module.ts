import type { Module, Lesson } from '@/types/module-v2';

// ─────────────────────────────────────────────────────────────────────────────
// Lesson 1: Email & Outlook Basics
// ─────────────────────────────────────────────────────────────────────────────

const lesson1: Lesson = {
  id: 'oe-l1',
  order: 1,
  title: 'Email & Outlook Basics',
  description: 'Discover what email is, why we use it, and how to find your way around Microsoft Outlook.',
  steps: [
    {
      id: 'oe-l1-s1',
      order: 1,
      title: 'What Is Email?',
      layout: 'instruction-full',
      blocks: [
        {
          type: 'text',
          content:
            '## What Is Email?\n\n' +
            'Email (short for **electronic mail**) is a way to send messages to people over the internet. ' +
            'Unlike a text message, emails are used in more **formal** situations — like communicating with your teacher, a business, or a future employer.\n\n' +
            '### Why use email instead of texting?\n\n' +
            '| Texting | Email |\n' +
            '|---|---|\n' +
            '| Casual and quick | More formal and professional |\n' +
            '| Short messages | Can include detail and attachments |\n' +
            '| Friends and family | Teachers, businesses, workplaces |\n\n' +
            'Email messages are stored in your **inbox** and can be read, replied to, or forwarded at any time.',
        },
        {
          type: 'callout',
          variant: 'why-it-matters',
          content:
            'Your teachers, future employers, and businesses all communicate by email. ' +
            'Learning to write a good one is an important life skill — and it starts here.',
        },
      ],
    },

    {
      id: 'oe-l1-s2',
      order: 2,
      title: 'The Outlook Interface',
      layout: 'instruction-full',
      blocks: [
        {
          type: 'text',
          content:
            '## The Outlook Interface\n\n' +
            'Microsoft Outlook is an email program. Here are the key areas you need to know:\n\n' +
            '- **New Email button** — Click this to start writing a new email\n' +
            '- **Inbox** — Where emails you receive are stored\n' +
            '- **Sent Items** — A folder that shows emails you have already sent\n' +
            '- **To field** — Where you type the email address of the person you are writing to\n' +
            '- **CC field** — Where you add people who should receive a copy of the email\n' +
            '- **Subject field** — A short title for your email\n' +
            '- **Body** — The main area where you write your message\n' +
            '- **Send button** — Click this when you are ready to send your email',
        },
        {
          type: 'callout',
          variant: 'tip',
          content:
            '**CC** stands for **Carbon Copy**. It means you are sending a copy of the email to someone else so they can read it — ' +
            'but they do not have to reply. For example, you might CC your parent when emailing a teacher.',
        },
      ],
    },

    {
      id: 'oe-l1-s3',
      order: 3,
      title: 'Match the Terms',
      layout: 'stacked',
      blocks: [
        {
          type: 'text',
          content: 'Match each Outlook term to its correct meaning.',
        },
        {
          type: 'word-match',
          blockId: 'oe-l1-s3-wm',
          pairs: [
            { id: 'oe-l1-s3-wm-p1', term: 'Inbox',     definition: 'Where emails you receive are stored' },
            { id: 'oe-l1-s3-wm-p2', term: 'New Email',  definition: 'The button you click to start writing a new email' },
            { id: 'oe-l1-s3-wm-p3', term: 'Reply',      definition: 'Sending a response back to the person who emailed you' },
            { id: 'oe-l1-s3-wm-p4', term: 'CC',         definition: 'Sending a copy of the email to someone else' },
            { id: 'oe-l1-s3-wm-p5', term: 'Subject',    definition: 'A short title that tells the reader what the email is about' },
          ],
        },
      ],
    },

    {
      id: 'oe-l1-s4',
      order: 4,
      title: 'True or False?',
      layout: 'stacked',
      blocks: [
        {
          type: 'text',
          content: 'Decide whether each statement is **True** or **False**.',
        },
        {
          type: 'true-false',
          blockId: 'oe-l1-s4-tf1',
          statement: 'CC stands for "Carbon Copy" and means the person will receive a copy of the email.',
          correct: true,
          explanation: 'Correct! CC sends a copy of the email to someone else. They can read it but do not need to reply.',
        },
        {
          type: 'true-false',
          blockId: 'oe-l1-s4-tf2',
          statement: 'You should always leave the Subject line blank to save time.',
          correct: false,
          explanation: 'The Subject line tells the reader what your email is about before they open it. Always fill it in!',
        },
        {
          type: 'true-false',
          blockId: 'oe-l1-s4-tf3',
          statement: '"Reply" sends your response to everyone who received the original email.',
          correct: false,
          explanation: 'Reply only sends your response back to the original sender. "Reply All" sends it to everyone.',
        },
      ],
    },

    {
      id: 'oe-l1-s5',
      order: 5,
      title: 'Steps in Order',
      layout: 'stacked',
      scoring: {
        xpValue: 10,
        hints: [],
        successMessage: 'Great work! You know how to send an email in Outlook.',
      },
      blocks: [
        {
          type: 'text',
          content: 'Put these steps in the **correct order** to send an email in Outlook.',
        },
        {
          type: 'sequence',
          blockId: 'oe-l1-s5-seq',
          instruction: 'Order the steps for sending an email in Outlook',
          items: [
            { id: 'oe-l1-s5-seq-i1', label: 'Open Microsoft Outlook',           correctIndex: 0 },
            { id: 'oe-l1-s5-seq-i2', label: 'Click New Email',                   correctIndex: 1 },
            { id: 'oe-l1-s5-seq-i3', label: 'Type the subject line',             correctIndex: 2 },
            { id: 'oe-l1-s5-seq-i4', label: 'Write your message in the body',    correctIndex: 3 },
            { id: 'oe-l1-s5-seq-i5', label: 'Click Send',                        correctIndex: 4 },
          ],
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Lesson 2: Parts of a Good Email
// ─────────────────────────────────────────────────────────────────────────────

const lesson2: Lesson = {
  id: 'oe-l2',
  order: 2,
  title: 'Parts of a Good Email',
  description: 'Learn the five parts every good email needs and how to write each one.',
  steps: [
    {
      id: 'oe-l2-s1',
      order: 1,
      title: 'The 5 Parts of Every Email',
      layout: 'instruction-full',
      blocks: [
        {
          type: 'text',
          content:
            '## The 5 Parts of Every Email\n\n' +
            'Every well-written email has five parts. Here is an example of an email to a teacher:\n\n' +
            '---\n\n' +
            '**Subject:** Question about the science homework\n\n' +
            '**Greeting:** Dear Mr Smith,\n\n' +
            '**Body:** I am writing to ask about the science homework that was set on Tuesday. ' +
            'I have completed the first three questions, but I am unsure what to do for question four. ' +
            'Could you please explain what is required?\n\n' +
            '**Closing:** Kind regards,\n\n' +
            '**Signature:** Ava Johnson\n\n' +
            '---\n\n' +
            '### The 5 Parts:\n' +
            '1. **Subject Line** — A short title that tells the reader what the email is about\n' +
            '2. **Greeting** — The opening line that addresses the reader by name\n' +
            '3. **Body** — The main message explaining why you are writing\n' +
            '4. **Closing** — A polite sign-off before your name\n' +
            '5. **Signature** — Your full name at the bottom',
        },
      ],
    },

    {
      id: 'oe-l2-s2',
      order: 2,
      title: 'Writing a Good Subject Line',
      layout: 'instruction-full',
      blocks: [
        {
          type: 'text',
          content:
            '## Writing a Good Subject Line\n\n' +
            'The subject line is the first thing your teacher sees. A good subject line is **short, specific, and clear**.\n\n' +
            '### Good examples ✅\n' +
            '- "Question about the science homework"\n' +
            '- "Absent on Monday — catching up on work"\n' +
            '- "Permission for sport excursion"\n\n' +
            '### Bad examples ❌\n' +
            '- "hey"\n' +
            '- (leaving it blank)\n' +
            '- "important!!!"\n' +
            '- "from ava"',
        },
        {
          type: 'callout',
          variant: 'tip',
          content:
            'A good subject line helps your teacher know what the email is about before they open it. ' +
            'Keep it under 10 words and be specific.',
        },
      ],
    },

    {
      id: 'oe-l2-s3',
      order: 3,
      title: 'Match the Parts',
      layout: 'stacked',
      blocks: [
        {
          type: 'text',
          content: 'Match each email part to its correct description.',
        },
        {
          type: 'word-match',
          blockId: 'oe-l2-s3-wm',
          pairs: [
            { id: 'oe-l2-s3-wm-p1', term: 'Subject Line', definition: 'A short title that tells the reader what the email is about' },
            { id: 'oe-l2-s3-wm-p2', term: 'Greeting',     definition: 'The opening line that addresses the reader by name' },
            { id: 'oe-l2-s3-wm-p3', term: 'Body',         definition: 'The main message of the email' },
            { id: 'oe-l2-s3-wm-p4', term: 'Closing',      definition: 'A polite sign-off before your name' },
            { id: 'oe-l2-s3-wm-p5', term: 'Signature',    definition: 'Your full name at the very bottom of the email' },
          ],
        },
      ],
    },

    {
      id: 'oe-l2-s4',
      order: 4,
      title: 'Fill in the Subject Line',
      layout: 'stacked',
      blocks: [
        {
          type: 'text',
          content: 'Complete the subject line for this email to your teacher.',
        },
        {
          type: 'fill-blank',
          blockId: 'oe-l2-s4-fb',
          text: 'Subject: Question about the {{blank}} that is due on {{blank}}',
          blanks: [
            {
              id: 'oe-l2-s4-fb-b1',
              accepted: ['assignment', 'homework', 'task', 'project', 'classwork'],
            },
            {
              id: 'oe-l2-s4-fb-b2',
              accepted: ['Friday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'tomorrow', 'today'],
            },
          ],
        },
      ],
    },

    {
      id: 'oe-l2-s5',
      order: 5,
      title: 'True or False?',
      layout: 'stacked',
      blocks: [
        {
          type: 'text',
          content: 'Decide whether each statement is **True** or **False**.',
        },
        {
          type: 'true-false',
          blockId: 'oe-l2-s5-tf1',
          statement: 'It is okay to leave the subject line blank when emailing your teacher.',
          correct: false,
          explanation:
            'Always include a subject line. It tells your teacher what the email is about before they open it.',
        },
        {
          type: 'true-false',
          blockId: 'oe-l2-s5-tf2',
          statement: 'A good greeting when emailing your teacher is "Dear Mr Smith," or "Dear Ms Jones,".',
          correct: true,
          explanation:
            'Using "Dear" followed by the teacher\'s title and surname is polite and professional.',
        },
        {
          type: 'true-false',
          blockId: 'oe-l2-s5-tf3',
          statement: '"Kind regards" and "Thank you" are both appropriate closings for a teacher email.',
          correct: true,
          explanation: 'Both are polite and commonly used in formal emails to teachers.',
        },
      ],
    },

    {
      id: 'oe-l2-s6',
      order: 6,
      title: 'Choose the Best Greeting',
      layout: 'stacked',
      scoring: {
        xpValue: 15,
        hints: [],
        successMessage: 'You know how to write the parts of a good email!',
      },
      blocks: [
        {
          type: 'text',
          content:
            'You are emailing your teacher, Mr Johnson, to ask about a homework task. ' +
            '**Which greeting should you use?**',
        },
        {
          type: 'quiz',
          question: {
            type: 'multiple-choice',
            options: ['Hey Johnson', 'Dear Mr Johnson,', 'Yo teacher,', 'Hi,'],
            correctAnswer: 'Dear Mr Johnson,',
            explanation:
              'Using "Dear" followed by the teacher\'s title and surname is the most polite and professional way to start a formal email.',
          },
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Lesson 3: Writing a Complete Email
// ─────────────────────────────────────────────────────────────────────────────

const lesson3: Lesson = {
  id: 'oe-l3',
  order: 3,
  title: 'Writing a Complete Email',
  description: 'Put everything together and practise writing a full, well-structured email to your teacher.',
  steps: [
    {
      id: 'oe-l3-s1',
      order: 1,
      title: 'A Worked Example',
      layout: 'instruction-full',
      blocks: [
        {
          type: 'text',
          content:
            '## A Worked Example\n\n' +
            'Read the email below carefully. Each part is labelled so you can see exactly how a good email to a teacher looks.\n\n' +
            '---\n\n' +
            '📌 **Subject:** Absent on Thursday — missed work\n\n' +
            '👋 **Greeting:** Dear Ms Williams,\n\n' +
            '📝 **Body:** I am writing to let you know that I was absent from school on Thursday due to illness. ' +
            'I understand that I missed the class on persuasive writing. ' +
            'Could you please let me know what we covered so that I can catch up before next week?\n\n' +
            '✉️ **Closing:** Thank you,\n\n' +
            '🖊️ **Signature:** Liam Nguyen\n\n' +
            '---\n\n' +
            '### Why is this email good?\n' +
            '- The subject line is **clear and specific**\n' +
            '- The greeting uses the **teacher\'s correct title and name**\n' +
            '- The body explains the situation, gives a reason, and makes a **polite request**\n' +
            '- The closing is **professional**\n' +
            '- The signature includes the student\'s **full name**',
        },
        {
          type: 'callout',
          variant: 'tip',
          content:
            'Notice that the email is polite, clear, and to the point. It does not use slang or casual language. ' +
            'Your teacher will appreciate a well-written email!',
        },
      ],
    },

    {
      id: 'oe-l3-s2',
      order: 2,
      title: 'Good vs Bad Email',
      layout: 'instruction-full',
      blocks: [
        {
          type: 'text',
          content:
            '## Good vs Bad Email\n\n' +
            'Can you spot what is wrong with the bad email before reading the explanation?\n\n' +
            '### ❌ Bad Email\n\n' +
            '**Subject:** (blank)\n\n' +
            'hey\n\n' +
            'i wasnt at school thursday. what did we do??\n\n' +
            'Liam\n\n' +
            '---\n\n' +
            '### ✅ Good Email\n\n' +
            '**Subject:** Absent on Thursday — missed work\n\n' +
            'Dear Ms Williams,\n\n' +
            'I am writing to let you know that I was absent on Thursday. ' +
            'Could you please tell me what we covered in class?\n\n' +
            'Thank you,\n\n' +
            'Liam Nguyen\n\n' +
            '---\n\n' +
            '### What was wrong with the bad email?\n' +
            '1. **No subject line** — the teacher does not know what it is about\n' +
            '2. **"hey"** — too casual for a teacher email\n' +
            '3. **No closing** — the email ends abruptly without a polite sign-off\n' +
            '4. **No full name** — the teacher may not know which "Liam" sent this',
        },
        {
          type: 'callout',
          variant: 'warning',
          content:
            'Always re-read your email before clicking Send. Check that it has a subject, a proper greeting, ' +
            'a clear message, a polite closing, and your full name.',
        },
      ],
    },

    {
      id: 'oe-l3-s3',
      order: 3,
      title: 'True or False?',
      layout: 'stacked',
      blocks: [
        {
          type: 'text',
          content: 'Decide whether each statement is **True** or **False**.',
        },
        {
          type: 'true-false',
          blockId: 'oe-l3-s3-tf1',
          statement: 'Starting an email to your teacher with "Hey" is appropriate.',
          correct: false,
          explanation: '"Hey" is too casual for a teacher email. Use "Dear Mr/Ms [Surname]," instead.',
        },
        {
          type: 'true-false',
          blockId: 'oe-l3-s3-tf2',
          statement: 'You should always include your full name at the end of an email to your teacher.',
          correct: true,
          explanation:
            'Your teacher may receive many emails. Signing off with your full name helps them identify who you are.',
        },
        {
          type: 'true-false',
          blockId: 'oe-l3-s3-tf3',
          statement: 'A one-word body is enough for a teacher email.',
          correct: false,
          explanation:
            'Your body should clearly explain why you are writing, give relevant details, and include a polite request.',
        },
      ],
    },

    {
      id: 'oe-l3-s4',
      order: 4,
      title: 'Order the Email Parts',
      layout: 'stacked',
      blocks: [
        {
          type: 'text',
          content: 'Put the **5 parts of an email** in the correct order, from top to bottom.',
        },
        {
          type: 'sequence',
          blockId: 'oe-l3-s4-seq',
          instruction: 'Order the 5 parts of an email from top to bottom',
          items: [
            { id: 'oe-l3-s4-seq-i1', label: 'Subject Line', correctIndex: 0 },
            { id: 'oe-l3-s4-seq-i2', label: 'Greeting',     correctIndex: 1 },
            { id: 'oe-l3-s4-seq-i3', label: 'Body',         correctIndex: 2 },
            { id: 'oe-l3-s4-seq-i4', label: 'Closing',      correctIndex: 3 },
            { id: 'oe-l3-s4-seq-i5', label: 'Signature',    correctIndex: 4 },
          ],
        },
      ],
    },

    {
      id: 'oe-l3-s5',
      order: 5,
      title: 'Complete the Email',
      layout: 'stacked',
      blocks: [
        {
          type: 'text',
          content:
            'Fill in the missing words to complete this email to your teacher. ' +
            'For the last blank, type your own first name.',
        },
        {
          type: 'fill-blank',
          blockId: 'oe-l3-s5-fb',
          // Written as a single inline sentence — FillInBlankRenderer renders parts inline,
          // so newlines would not display. The meaning is preserved without line breaks.
          text: 'Dear {{blank}}, I am writing to ask about the {{blank}} task from last week. I was absent on Thursday and I am not sure what I need to do. Could you please {{blank}} me know what I missed? Thank you, {{blank}}',
          blanks: [
            {
              id: 'oe-l3-s5-fb-b1',
              // Accept common teacher titles/names — students type their actual teacher's name
              accepted: ['Mr Smith', 'Ms Jones', 'Mr Johnson', 'Ms Williams', 'Sir', 'Miss', 'Mr', 'Ms', 'Mrs'],
            },
            {
              id: 'oe-l3-s5-fb-b2',
              accepted: ['homework', 'assignment', 'task', 'project', 'classwork', 'activity'],
            },
            {
              id: 'oe-l3-s5-fb-b3',
              accepted: ['let', 'tell', 'inform', 'show'],
            },
            {
              // Blank 4 is the student's own name — any answer passes.
              // The fill-blank block marks the step complete on Check regardless of correctness;
              // this blank will always show red but does not block progression.
              id: 'oe-l3-s5-fb-b4',
              accepted: ['your name', 'student', 'name'],
            },
          ],
        },
      ],
    },

    {
      id: 'oe-l3-s6',
      order: 6,
      title: 'Vocabulary Review',
      layout: 'stacked',
      scoring: {
        xpValue: 20,
        hints: [],
        successMessage: 'Module complete! You can now write a professional email to your teacher.',
      },
      blocks: [
        {
          type: 'text',
          content: 'Review the key vocabulary from this module. Click each card to flip it.',
        },
        {
          type: 'flashcard',
          blockId: 'oe-l3-s6-fc',
          instruction: 'Click a card to reveal the definition. Use the arrows to move between cards.',
          cards: [
            {
              id: 'oe-l3-s6-fc-c1',
              front: 'Subject Line',
              back: 'A short title at the top of an email that tells the reader what it is about.',
            },
            {
              id: 'oe-l3-s6-fc-c2',
              front: 'Greeting',
              back: 'The opening line of an email that addresses the reader, e.g. "Dear Mr Smith,"',
            },
            {
              id: 'oe-l3-s6-fc-c3',
              front: 'Body',
              back: 'The main message of the email — explains why you are writing.',
            },
            {
              id: 'oe-l3-s6-fc-c4',
              front: 'Closing',
              back: 'A polite sign-off before your name, e.g. "Kind regards," or "Thank you,"',
            },
            {
              id: 'oe-l3-s6-fc-c5',
              front: 'Signature',
              back: 'Your full name at the very bottom of the email.',
            },
            {
              id: 'oe-l3-s6-fc-c6',
              front: 'CC',
              back: 'Carbon Copy — sends a copy of the email to someone else who does not need to reply.',
            },
          ],
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Module export
// ─────────────────────────────────────────────────────────────────────────────

export const outlookEmailModule: Module = {
  id: 'outlook-email',
  title: 'Writing Emails on Microsoft Outlook',
  description: 'Learn how to use Microsoft Outlook to write clear, polite emails to your teacher.',
  topic: 'computer-literacy',
  estimatedMinutes: 35,
  lessons: [lesson1, lesson2, lesson3],
  competencies: [],
};
