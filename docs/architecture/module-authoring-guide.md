# Module Authoring Guide

## Language & Style

### Australian English Spelling
All module content must use Australian English spelling.

| American | Australian |
|----------|------------|
| empathize | empathise |
| organize | organise |
| behavior | behaviour |
| color | colour |
| center | centre |
| judgment | judgement |
| modeling | modelling |
| realize | realise |
| analyze | analyse |
| finalize | finalise |
| customize | customise |
| prioritize | prioritise |

### Punctuation
- **Do not use em-dashes (—).** Use commas, colons, semicolons, or hyphens instead.
- Keep sentences short and direct; Year 7 reading level.

---

## Question Design Rules

Multiple choice questions must follow these rules. They are designed to surface misconceptions, not just check memorisation.

### 1. All options must be plausible
Every incorrect option should be something a reasonable student might actually think. Do not include obviously absurd answers.

### 2. Similar length
All four options should be roughly the same character count. The correct answer must **not** stand out because it is noticeably longer or shorter.

### 3. Correct answer is NOT the longest
If the correct answer is the longest option, students can guess it without understanding. Adjust wording so a distractor is longest, or balance them evenly.

### 4. Distractors are common misconceptions
Incorrect options should target the most likely misunderstandings:
- Reversing the order of steps
- Confusing two related concepts
- Stating a solution instead of a problem
- Designing for yourself instead of the user
- Skipping steps (e.g., prototyping before defining)

### 5. Explanations teach, don't just tell
The explanation field should explain **why** the correct answer is right **and** why the most tempting distractor is wrong.

---

## Assessment Structure

- **Practice steps** come first: low stakes, hints allowed, XP rewarded.
- **Assessment step** is the final step of the lesson: `isAssessment: true`.
- Assessments have **no hints** and determine whether the next lesson unlocks.
- One lesson should end with one assessment. For a multi-lesson module, each lesson has its own assessment.

---

## Example: Well-Designed Question

**Topic:** Defining a problem in design thinking

**Question:** Which of the following is the BEST problem definition?

**Options:**
- My partner wants a water bottle that looks cool and matches their bag. *(misconception: focusing on wants/looks, not needs)*
- My partner needs a bottle that does not leak because their books get wet. *(correct)*
- My partner needs a bottle with a locking lid because it tips over in their bag. *(misconception: jumping to a specific solution)*
- My partner needs a water bottle because all of their friends already have one. *(misconception: no meaningful "why")*

**Why this works:**
- All options sound reasonable to a student.
- Lengths are balanced; correct answer is not the longest.
- Each wrong answer reveals a different shallow understanding.
