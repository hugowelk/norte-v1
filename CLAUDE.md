# CLAUDE.md — Norte Repo Instructions

> Read this file at the start of every session. It sets context that isn't obvious from the filenames.

---

## What Norte is

A web app that reveals a user's behavioural values through 15 trade-off scenarios, then helps them close the gap between revealed and aspirational values via an AI-generated action plan. The methodology is grounded in ACT (Acceptance and Commitment Therapy), the Valued Living Questionnaire, and the Bull's Eye Values Survey.

This is a wellness product, not a clinical tool. The product positioning is "well-designed psychology magazine" — editorial, minimalist, credible. Avoid clinical-sounding language; avoid self-help-sounding language. Find the line between.

## Core mental model

The app has three phases:

1. **Phase 1 — Revealed values.** User answers 15 scenarios. Algorithm scores all 8 values, normalizes 0–100, ranks them, returns the top 3.
2. **Phase 2 — Aspirational values.** User picks 3 values they want to centre, rates how present each one is in their life today.
3. **Phase 3 — Gap analysis + action plan.** App shows gaps between revealed and aspirational. AI generates a personalized action plan for closing them.

Phase 1 is fully deterministic frontend logic. Phase 3 calls the Anthropic API.

## The 8 values

Locked. Do not rename without explicit instruction.

```
achievement   — building, mastering, completing
connection    — quality of relationships
aliveness     — body, energy, vitality (English term is awkward, leave it alone)
enjoyment     — pleasure, present-moment experience
meaning       — purpose, significance, depth
contribution  — impact on others, helping, justice
stability     — safety, predictability, margin
autonomy      — control over time and choices
```

## The 15 scenarios

Single source of truth: `[path/to/scenarios file]` (update with actual path).

Each scenario has:
- An ID (C1–C15)
- A tier (warmup, revealing, hard, hard-split)
- A weight (1.0, 1.5, 2.0, or 1.0 for hard-split)
- Two options, each mapped to one value (or two values for the split scenario C12)

Coverage per value (after the v3 rewrite):

| Value | Count | Max Score |
|---|---|---|
| aliveness | 3 | 4.5 |
| contribution | 3 | 5.0 |
| connection | 4 | 5.5 |
| enjoyment | 4 | 5.0 |
| stability | 4 | 6.5 |
| autonomy | 4 | 5.0 |
| achievement | 5 | 7.0 |
| meaning | 5 | 7.5 |

If you change a scenario's value pairing or weight, the coverage table changes. Update `values.ts` `maxScore` per value accordingly, or normalization breaks.

## Algorithm rules

- Each scenario contributes its `weight` to the chosen value(s)
- C12 is special: each side has two values, each gets +1.0 (not +2.0 combined)
- Scores normalize: `normalized = round((raw / maxScore) * 100)`
- Ranking is by normalized score, with ties broken by `highestWinningWeight`
- The top 3 ranked values are the "revealed" set
- If the top two values tie on both score and highest winning weight, `coPrimary` flags the tie

Do not introduce any other normalization, weighting, or AI inference into Phase 1. The credibility of the product depends on the math being inspectable and deterministic.

## What was removed in v3 (May 2026)

- **Time and Money intake questions.** They used to add weighted contributions to scores via `applyIntake()`. Now removed entirely. If you find `TIME_OPTIONS`, `MONEY_OPTIONS`, `BehaviourAnswer`, `BehaviourOption`, `INTAKE_CAP`, `maxFromIntake`, `TIME_MAX`, `MONEY_MAX`, or `applyIntake` anywhere, they're dead code and can go.
- **The 13-scenario set.** Replaced with 15 scenarios. References to "13 scenarios" in copy or analytics should now be "15".
- **The 5-value aspirational flow.** Now 3 values. References to "top 5", "cinco valores", or 5-value logic should now be 3.

## Voice rules (non-negotiable)

These apply to all user-facing copy in the product AND to the Anthropic API system prompt for Phase 3.

**Banned:**
- Em-dashes (—). Always replace with period, comma, or parentheses.
- Hedging adverbs: "perhaps", "potentially", "you might consider"
- Empty intensifiers: "really important", "truly meaningful"
- Generic openers: "Let's explore...", "It's worth noting..."
- AI-symmetric tricolons: "clarity, purpose, and meaning"
- Vague verbs in headlines: "drive", "navigate", "unlock", "discover your truth"

**Required:**
- Direct over polite
- Specific over abstract
- Short sentences, active voice
- "I take it" not "I would take it"
- Concrete imagery (sleep thin, back hurts) over abstract framing

If a sentence sounds like a self-help book or a wellness app, rewrite it.

## Tech stack

- **Framework**: React (Vite or Next, depending on what's there)
- **Styling**: Tailwind, custom CSS where needed
- **Typography**: DM Serif Display (headlines), DM Sans (body)
- **State**: React state and context (no Redux unless absolutely needed)
- **Payments**: Stripe (one-time payment, $7–9 USD)
- **AI**: Anthropic API for Phase 3 action plan generation
- **Hosting**: Lovable for prototyping, [final host TBD]
- **Language**: English only. (App was originally Portuguese but shifted to English in v3.)

## Folder conventions

[Fill in with actual repo structure once Claude Code reads it. Suggested layout to look for:]

```
/src
  /algorithm     — scoring, scenario definitions, types
  /components    — UI components
  /pages         — routes/screens
  /content       — value definitions, scenario copy, methodology page
  /lib           — API clients, utilities
```

If the repo structure differs, document it here on first session.

## What's in progress (May 2026)

- Iteration A (engineering): Time/Money removal, scenario v3 swap, voice cleanup, top-5 → top-3, max score audit
- Iteration B (UI): Homepage rebuild, new onboarding slide, transition animation, results redesign, aspirational flow rebuild

The work splits between Claude Code (engineering) and Lovable (UI). Don't try to do UI rebuilds from Claude Code; don't try to do algorithm work from Lovable.

## Open product decisions

- Animation implementation (CSS vs Lottie) — pending
- Top-3 value explanations (3 paragraphs × 8 values) — Hugo to write
- C14 (contribution vs autonomy) tier confirmation — currently revealing (1.5), may bump to hard (2.0)

## How to work in this repo

1. Read this file first
2. Read the spec at `[path/to/values-app-spec.md]` (update with actual path) for the full product spec
3. Branch from main for any change
4. Run the test suite before committing if it exists; flag if it doesn't
5. For any algorithm change, verify the coverage table above is still accurate
6. For any copy change, run the voice rules audit (em-dashes, hedging, AI phrases)
7. Commit messages: imperative mood, specific, no fluff

## What Hugo cares about

- Algorithmic integrity over feature breadth
- Voice consistency over stylistic variety
- Shipping incremental improvements over big rewrites
- Methodology credibility — every user-facing claim about how the product works must be defensible
