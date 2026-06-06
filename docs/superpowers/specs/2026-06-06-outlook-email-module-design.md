# Outlook Email Module — Design Spec

**Date:** 2026-06-06
**Author:** Joshua Rentenaar
**Status:** Approved

---

## Overview

A new Circuit module teaching Year 7–8 students how to write and send emails using Microsoft Outlook. The module is writing-first (emphasis on composing a good email) with some interface orientation. All scenarios involve emailing a teacher — the most relatable context for this age group.

**Module ID:** `outlook-email`
**Topic:** Digital Technologies / Computer Literacy
**Estimated time:** ~35 minutes
**Target audience:** Year 7–8 beginners
**Player:** V2LessonPlayer (hardcoded TypeScript, no Supabase publish needed for initial version)

---

## Architecture

The module is authored as a hardcoded TypeScript file at:
`src/data/v2/outlook-email-module.ts`

It uses the factory functions from `src/lib/blocks/factories.ts` and step helpers from `src/lib/blocks/steps.ts` to compose a `Module` object conforming to `src/types/module-v2.ts`.

The module is registered in a new v2 registry at `src/data/v2/module-registry-v2.ts` and wired into `ModulePlayer` as a fallback alongside the existing legacy registry.

**Block types used:** `text`, `callout`, `word-match`, `true-false`, `fill-blank`, `quiz`, `sequence`, `flashcard`

No new block types are needed — all are already implemented.

---

## Module Structure

### Module metadata

| Field | Value |
|---|---|
| id | `outlook-email` |
| title | Writing Emails on Microsoft Outlook |
| description | Learn how to use Microsoft Outlook to write clear, polite emails to your teacher. |
| estimatedMinutes | 35 |
| topic | computer-literacy |

---

## Lesson 1: Email & Outlook Basics (~10 min, 5 steps)

**Goal:** Students understand what email is, why it's used, and can identify key parts of the Outlook interface.

### Step 1 — Instruction: What Is Email?
**Layout:** `instruction-full`
**Blocks:**
- `text` — Explains what email is, how it differs from texting (more formal, used in school/work), and why it matters
- `callout` (why-it-matters) — "Your teachers, future employers and businesses communicate by email. Learning to write a good one is an important life skill."

### Step 2 — Instruction: The Outlook Interface
**Layout:** `instruction-full`
**Blocks:**
- `text` — Describes the key areas of Outlook: the New Email button, Inbox, Sent Items, the Subject line field, the To/CC/BCC fields, and the Send button
- `callout` (tip) — "CC stands for Carbon Copy. It means you're sending a copy to someone else so they can read it, but they don't have to reply."

### Step 3 — Interactive: Match the Terms
**Layout:** `stacked`
**Blocks:**
- `text` — "Match each Outlook term to its meaning."
- `word-match` — 5 pairs:
  - Inbox → Where emails you receive are stored
  - Compose / New Email → The button you click to write a new email
  - Reply → Sending a response back to the person who emailed you
  - CC → Sending a copy of the email to someone else
  - Subject → A short title that tells the reader what the email is about

### Step 4 — Interactive: True or False?
**Layout:** `stacked`
**Blocks:**
- `text` — "Decide if each statement is True or False."
- `true-false` (×3, one per sub-step or presented sequentially):
  1. "CC stands for 'Carbon Copy' and means the person will receive a copy of the email." → True. Explanation: CC lets you share the email with others who don't need to reply.
  2. "You should always leave the Subject line blank to save time." → False. Explanation: The subject line tells the reader what your email is about before they open it.
  3. "Reply sends your response to everyone who received the original email." → False. Explanation: Reply only goes back to the sender. Reply All goes to everyone.

### Step 5 — Interactive: Steps in Order
**Layout:** `stacked`
**Blocks:**
- `text` — "Put these steps in the correct order to send an email in Outlook."
- `sequence` — 5 items:
  1. Open Microsoft Outlook (correctIndex: 0)
  2. Click New Email (correctIndex: 1)
  3. Type the subject line (correctIndex: 2)
  4. Write your message in the body (correctIndex: 3)
  5. Click Send (correctIndex: 4)

**Scoring:** xpValue: 10

---

## Lesson 2: Parts of a Good Email (~12 min, 6 steps)

**Goal:** Students can identify and write the 5 parts of a well-structured email.

### Step 1 — Instruction: The 5 Parts of Every Email
**Layout:** `instruction-full`
**Blocks:**
- `text` — Introduces the 5 parts with a labelled example email to a teacher:
  1. **Subject Line** — Short title for your email
  2. **Greeting** — How you address the reader ("Dear Mr Smith,")
  3. **Body** — The main message
  4. **Closing** — A polite sign-off ("Kind regards," / "Thank you,")
  5. **Signature** — Your name

### Step 2 — Instruction: Writing a Good Subject Line
**Layout:** `instruction-full`
**Blocks:**
- `text` — Explains what makes a good subject line: short, specific, and clear. Shows examples:
  - ✅ "Question about the science homework"
  - ✅ "Absent on Monday — catching up on work"
  - ❌ "hey"
  - ❌ (blank)
- `callout` (tip) — "A good subject line helps your teacher know what the email is about before they open it. Keep it under 10 words."

### Step 3 — Interactive: Match the Parts
**Layout:** `stacked`
**Blocks:**
- `text` — "Match each part of an email to its description."
- `word-match` — 5 pairs:
  - Subject Line → A short title that tells the reader what the email is about
  - Greeting → The opening line that addresses the reader by name
  - Body → The main message of the email
  - Closing → A polite sign-off before your name
  - Signature → Your name at the bottom of the email

### Step 4 — Interactive: Fill in the Subject Line
**Layout:** `stacked`
**Blocks:**
- `text` — "Complete the subject line for this email."
- `fill-blank` — 2 blanks:
  - Text: "I am writing to ask about the {{blank}} that is due on {{blank}}."
  - Blank 1: accepted: ["assignment", "homework", "task", "project"]
  - Blank 2: accepted: ["Friday", "Monday", "Tuesday", "Wednesday", "Thursday", "tomorrow", "today"]

### Step 5 — Interactive: True or False?
**Layout:** `stacked`
**Blocks:**
- `text` — "Decide if each statement is True or False."
- `true-false` (×3):
  1. "It is okay to leave the subject line blank when emailing your teacher." → False. Explanation: Always include a subject line so your teacher knows what the email is about.
  2. "A good greeting when emailing your teacher is 'Dear Mr Smith,' or 'Dear Ms Jones,'." → True. Explanation: Using "Dear" followed by the teacher's name is polite and professional.
  3. "'Kind regards' and 'Thank you' are both appropriate closings for a teacher email." → True. Explanation: Both are polite and commonly used in formal emails.

### Step 6 — Interactive: Choose the Best Greeting
**Layout:** `stacked`
**Blocks:**
- `text` — "Which greeting is most appropriate for an email to your teacher?"
- `quiz` (multiple-choice):
  - Question: "You are emailing your teacher, Mr Johnson, to ask about a homework task. Which greeting should you use?"
  - Options: ["Hey Johnson", "Dear Mr Johnson,", "Yo teacher,", "Hi,"]
  - Correct: "Dear Mr Johnson,"
  - Explanation: "Using 'Dear' followed by the teacher's title and surname is the most polite and professional way to start a formal email."

**Scoring:** xpValue: 15

---

## Lesson 3: Writing a Complete Email (~13 min, 6 steps)

**Goal:** Students can write a complete, well-structured email to a teacher from scratch.

### Step 1 — Instruction: A Worked Example
**Layout:** `instruction-full`
**Blocks:**
- `text` — Shows a complete, labelled example of a good email to a teacher asking about a missed lesson. Each part (subject, greeting, body, closing, signature) is annotated.
- `callout` (tip) — "Read the email below carefully. Notice how each part has a clear job to do."

### Step 2 — Instruction: Good vs Bad Email
**Layout:** `instruction-full`
**Blocks:**
- `text` — Shows two emails side by side: a bad version (no subject, starts with "hey", no closing, no name) and the good version corrected
- `callout` (warning) — "The bad email has 4 problems. Can you spot them before reading on?"

### Step 3 — Interactive: True or False?
**Layout:** `stacked`
**Blocks:**
- `text` — "Decide if each statement about email writing is True or False."
- `true-false` (×3):
  1. "Starting an email to your teacher with 'Hey' is appropriate." → False. Explanation: 'Hey' is too casual for a teacher email. Use 'Dear Mr/Ms [Surname],' instead.
  2. "You should always include your name at the end of an email to your teacher." → True. Explanation: Your teacher may receive many emails. Always sign off with your full name.
  3. "A body paragraph of one word is enough for a teacher email." → False. Explanation: Your body should clearly explain your reason for writing, any relevant details, and what you are asking.

### Step 4 — Interactive: Order the Email Parts
**Layout:** `stacked`
**Blocks:**
- `text` — "Put the 5 parts of an email in the correct order, from top to bottom."
- `sequence` — 5 items:
  1. Subject Line (correctIndex: 0)
  2. Greeting (correctIndex: 1)
  3. Body (correctIndex: 2)
  4. Closing (correctIndex: 3)
  5. Signature (correctIndex: 4)

### Step 5 — Interactive: Complete the Email
**Layout:** `stacked`
**Blocks:**
- `text` — "Fill in the missing parts of this email to your teacher."
- `fill-blank` — 4 blanks:
  - Text: "Dear {{blank}},\n\nI am writing to ask about the {{blank}} task from last week. I was absent on Thursday and I am not sure what I need to do. Could you please {{blank}} me know what I missed?\n\nThank you,\n{{blank}}"
  - Blank 1: accepted: ["Mr Smith", "Ms Jones", "Mr Johnson", "Ms Williams", "Sir", "Miss"] (teacher name/title)
  - Blank 2: accepted: ["homework", "assignment", "task", "project", "classwork"]
  - Blank 3: accepted: ["let", "tell", "inform"]
  - Blank 4: This blank represents the student's own name. The `fill-blank` block requires accepted answers, so use accepted: ["your name", "student"] as a soft pass, and add an instruction note: "Type your first and last name here." In practice this blank always passes — it is a guided practice exercise, not a graded answer. This is a known limitation of the fill-blank block type.

### Step 6 — Interactive: Vocabulary Flashcards
**Layout:** `stacked`
**Blocks:**
- `text` — "Review the key vocabulary from this module. Click each card to flip it."
- `flashcard` — 6 cards:
  1. Front: "Subject Line" → Back: "A short title at the top of an email that tells the reader what it is about."
  2. Front: "Greeting" → Back: "The opening line of an email that addresses the reader, e.g. 'Dear Mr Smith,'"
  3. Front: "Body" → Back: "The main message of the email — explains why you are writing."
  4. Front: "Closing" → Back: "A polite sign-off before your name, e.g. 'Kind regards,' or 'Thank you,'"
  5. Front: "Signature" → Back: "Your name at the very bottom of the email."
  6. Front: "CC" → Back: "Carbon Copy — sends a copy of the email to someone else who doesn't need to reply."

**Scoring:** xpValue: 20

---

## Implementation Notes

### File to create
`src/data/v2/outlook-email-module.ts`

### New v2 registry
`src/data/v2/module-registry-v2.ts` — exports `allV2Modules` and `getV2ModuleById`

### ModulePlayer wiring
`src/pages/ModulePlayer.tsx` — add v2 registry lookup as a second fallback (after DB miss, before "not found"):
```
DB module → v2 hardcoded → legacy hardcoded → not found
```

### True/False handling
The `true-false` block type renders one statement per block. Steps with 3 true/false questions need 3 separate `true-false` blocks stacked in the same step — `StepLayoutEngine` renders them in sequence and `V2LessonPlayer` waits for all to be answered before enabling Continue.

### No Supabase publish needed
This module is hardcoded — it does not need `publishModule`. It loads through the local registry fallback in `ModulePlayer`, which means it works immediately without a database entry.

---

## Out of Scope

- Sending a real email (no live Outlook integration)
- Marking/grading the free-text fill-in-blank answers against a rubric
- A module banner image (can be added later)
