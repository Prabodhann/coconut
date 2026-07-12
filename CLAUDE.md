# Ways of Working

## Stack Overview

Monorepo with `backend/` (Node/Express/TypeScript) and `frontend/` (Next.js/TypeScript/Tailwind).

---

## Mandatory Process — Feature Implementation

**These rules apply to every feature, bug fix, and refactor. No exceptions.**

### Step 1: Plan before touching code

When given a spec or feature request, use the **`superpowers:writing-plans`** skill to produce a detailed plan before writing a single line of code.

Save plans to `docs/plans/YYYY-MM-DD-<feature-name>.md`.

Show the plan and get explicit approval before implementing anything.

### Step 2: Implement with TDD

Use the **`superpowers:test-driven-development`** skill for all implementation.

```
Red → Green → Refactor
```

- Write a failing test first. Run it. Confirm it fails for the right reason.
- Write the _minimal_ code to make it pass. Nothing more.
- Refactor only after green.

Never write production code before a failing test exists.

### Step 3: Small, verified increments

Work in the smallest practical increments. Keep the test-first red → green cycle,
but do not wait for user confirmation after every increment. Report meaningful
progress and verification results at logical milestones.

---

```
## Step N: [What this step does]

**Test written:** [file path + test name]
**Test result:** [FAIL — paste relevant output]

**Implementation:** [file path, 1-line summary of what changed]
**Test result:** [PASS — paste output]

**Suggested commit:** `[type(scope): description]`

```

---

---

## Code Quality Rules

- **Simple over clever** — prefer readable, maintainable code.
- **YAGNI** — don't build for hypothetical future requirements.
- **Clean architecture** — separate concerns; keep layers distinct (routes → controllers → services → data).
- **No comments explaining what** — code names should do that. Only comment the _why_ when it's non-obvious.
- **Ask, don't assume** — if the spec is ambiguous, ask before implementing.

---

## Spec Convention

Place feature specs in `docs/specs/<feature-name>.md` before starting work. A spec should contain:

- **Goal** — what problem this solves
- **Requirements** — concrete, testable acceptance criteria
- **Out of scope** — what this does NOT cover

---

## Skills Reference

| When                          | Use                                          |
| ----------------------------- | -------------------------------------------- |
| Given a spec, before planning | `superpowers:brainstorming`                  |
| Before writing code           | `superpowers:writing-plans`                  |
| Writing any feature/fix       | `superpowers:test-driven-development`        |
| Executing a saved plan        | `superpowers:executing-plans`                |
| Something is broken           | `superpowers:systematic-debugging`           |
| About to say "done"           | `superpowers:verification-before-completion` |
| Implementation complete       | `superpowers:finishing-a-development-branch` |
