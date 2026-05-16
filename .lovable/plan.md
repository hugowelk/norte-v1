# Norte — MVP Flow Revisions (v2)

Restructures the app around the new "Norte" brand, the locked **8-value model**, and the **13 trade-off algorithm** you provided. Replaces the current 14-value emoji system end-to-end.

New flow:

```text
Landing
  → Time Reality
  → Money Behaviour
  → Trade-off Intro ("There's no right answer")
  → 13 Trade-off Scenarios (C1–C13)
  → Results (revealed top 3 + ranked rest, expandable)
  → Core Values Selection (5 ordered slots + accordion list + custom)
  → Alignment Check (sliders pre-filled from normalised scores)
  → Value Compass / Alignment Map (Current vs Aspiring + emotional report)
  → Paywall (custom AI action plan)
```

The standalone "Commit to Action" page is removed.

## 1. Values model — switch to the 8-value system

Rewrite `src/lib/values.ts` to the locked 8 values:

| Key | Label |
|---|---|
| achievement | Achievement |
| connection  | Connection |
| aliveness   | Aliveness |
| enjoyment   | Enjoyment |
| meaning     | Meaning |
| contribution| Contribution |
| stability   | Stability |
| autonomy    | Autonomy |

Each gets: label, short description, long description (used on Results accordion), Lucide icon, and a `maxScore` (per algorithm: Achievement 7.0, Connection 5.5, Aliveness 4.5, Enjoyment 3.5, Meaning 7.5, Contribution 3.5, Stability 5.0, Autonomy 3.5).

Drop all 14 legacy values, the emoji field, and the old scoring system.

## 2. Trade-off algorithm

Implement exactly per your spec in a new `src/lib/algorithm.ts`:

- `SCENARIOS`: array of 13 entries, each with `id` (C1–C13), `tier`, `weight`, `prompt`, `optionA`, `optionB`. C12 carries `split: true` with two values per side.
- `computeScores(answers: ('A'|'B')[13])` → `{ raw, normalized, ranking, revealed: { primary, secondary, tertiary } }`. Normalisation = round(raw / maxScore × 100). Tiebreakers per spec (highest-weight scenario wins; if still tied → co-primary).
- Validates all 13 answers are present before computing.
- Pure, deterministic, frontend only. No persistence beyond React state for MVP.

## 3. Landing page (`/`)

- Add **"Norte"** wordmark at top.
- Keep the compass icon + headline.
- Add a small credentials block near the bottom (1 short paragraph + "Based on" line referencing Schwartz values theory, ACT values work, behavioural-economics trade-off framing — placeholder copy for later pass).
- Update `<title>` and meta description to use "Norte".

## 4. Time Reality & Money Behaviour

These stay as the first two screens (kept simple — they feed the behaviour narrative on the Results page, not the algorithm).

- Multi-select with up to 3 options each.
- Each option gets a Lucide icon (rendered next to the label).
- Add an "Add your own" text input below the options so the user can type a custom item. Custom entries are stored alongside the selected indices and surfaced verbatim in the Results behaviour narrative.

## 5. Trade-off intro screen

New transition screen before C1, with the exact framing from the spec:

> **There's no right answer.**
> You'll see 13 everyday situations. In each one, pick the option closest to how you'd actually act — not how you'd like to act.
> Be honest with yourself. That's what makes the result useful.

Single "Begin" button.

## 6. The 13 Trade-off scenarios

New `TradeoffScenario` component:

- Header: numeric counter "X of 13" (no progress bar per UX notes).
- Scenario prompt in editorial type.
- Two large option cards (A / B). No value labels shown.
- **Auto-advance on click** — no Continue button.
- **No back navigation** on this segment (per spec).
- After C4 → show transition card "The next ones get a little harder."
- After C8 → show transition card "Almost at the hardest choices."
- C12 gets a distinct visual treatment (no A/B label, broader card layout) to signal it's the special split scenario.

Scenario content sourced verbatim from `norte-scenarios-EN.md` (C1–C13).

## 7. Results page

- Compute `revealed` and `ranking` via the algorithm.
- Show **Revealed top 3** prominently (primary, secondary, tertiary) — each as an accordion card with icon, name, normalised score, and an expanded behaviour narrative.
- Below: **"Other values that came up"** — remaining 5 in ranked order, smaller, also expandable.
- Behaviour narrative for each value is generated from the user's Time + Money answers ("You've been prioritising X — your time goes into A and B, and your money into C…"). Helper: `buildBehaviourNarrative(valueKey, timeAnswers, moneyAnswers)`.
- Single CTA: "Choose your core values" → Core Values Selection.

## 8. Core Values Selection (merges old Sorting + Ranking)

Single screen:

- 5 ordered placeholder slots (1–5). Drag to reorder via `@dnd-kit`.
- Below: full list of the 8 values as accordion cards (icon + label collapsed; expanded shows long description). Click adds to next empty slot; click a filled slot to remove.
- "Add your own value" button → inline form (label + short description). Custom values join the list and can be slotted.
- These become the user's **aspirational top 5** (`aspirational`), distinct from `revealed` (algorithm output).
- Continue button enabled when all 5 slots are filled.

## 9. Alignment Check

- For each of the 5 aspirational values, show a 0–10 slider.
- Pre-fill each slider with a suggestion derived from `normalized[value] / 10` (so a value scored 70 lands at 7). For custom user-added values, default to mid (5) with a note. Show small "Suggested from your behaviour" label.
- User can adjust freely. Continue stores `alignmentScores`.

## 10. Value Compass / Alignment Map

Rename old `FinalInsights.tsx` → `ValueCompass.tsx`. Moved before any action/paywall step.

- Radar chart (recharts) with two relabelled series:
  - **Current behaviour signals** — from `normalized` (algorithm output).
  - **Aspiring values** — from the alignment sliders × 10.
- Plot all 8 values on the radar so gaps are visible across the whole system, not just the chosen 5.
- Below the chart: short, warm, plain-language **gap reveal** report using the spec's Beat-3 logic:
  - Detect which aspirational values fall outside the revealed top 3.
  - Call out their ranked position ("Connection came up fifth").
  - Highlight 1 biggest gap and 1 strongest alignment.
  - Tone: editorial, emotional, no jargon — designed as an a-ha moment.
- Primary CTA: **"Explore next steps"** → Paywall.

## 11. Paywall — Custom AI Action Plan

New `Paywall.tsx`, final screen. Replaces the old standalone Commit to Action page.

- Hero headline + subhead positioning the next product: an AI-guided deep dive that turns the user's value gaps into a personalised behaviour-shift plan. Framing: *not* goal-setting — it's about reshaping daily behaviours so life satisfaction rises by aligning with revealed/aspired values.
- 3–4 benefit bullets, "what's included" block.
- Primary CTA "Start my plan" (non-functional placeholder).
- Secondary link "Maybe later" → returns to the Compass.

## 12. Removed

- `ActionPlanning.tsx` and the `actions` phase — gone.
- `ValueSorting.tsx` and `ValueRanking.tsx` — replaced by the combined Core Values Selection.
- 14-value system, emoji field, old `calculateValueScores` / `getTopValues`.
- Back button on the 13-scenario segment.

## Phase order in `QuizFlow.tsx`

```text
time → money → tradeoffIntro → tradeoffs(0..12) → results
  → coreValues → alignment → compass → paywall
```

## Technical notes

Files to create:
- `src/lib/algorithm.ts` — scenarios + scoring + tiebreakers + output types.
- `src/components/quiz/TradeoffIntro.tsx`
- `src/components/quiz/TradeoffScenario.tsx`
- `src/components/quiz/TradeoffTransition.tsx`
- `src/components/quiz/CoreValuesSelection.tsx`
- `src/components/quiz/Paywall.tsx`
- `src/components/ValueIcon.tsx`

Files to rewrite:
- `src/lib/values.ts` — 8-value model, icons, max scores, long descriptions.
- `src/components/QuizFlow.tsx` — new phase machine.
- `src/components/quiz/QuizSection.tsx` — only used for Time/Money now; add custom-input support and icons.
- `src/components/quiz/ValueResults.tsx` — top 3 + ranked rest, accordions, behaviour narrative.
- `src/components/quiz/AlignmentReflection.tsx` — sliders pre-filled from normalised scores.
- `src/components/quiz/FinalInsights.tsx` → rename `ValueCompass.tsx`; relabel radar; add gap-reveal report.
- `src/pages/Index.tsx`, `index.html` — Norte branding + credentials.

Files to delete:
- `src/components/quiz/ValueSorting.tsx`
- `src/components/quiz/ValueRanking.tsx`
- `src/components/quiz/ActionPlanning.tsx`

Algorithm confirmation: yes — your `norte-algorithm.md` gives the full deterministic matrix (weights per tier, value mapping per option, max-score table, normalisation to 0–100, ranking, top-3 revealed values, C12 split rule, tiebreakers). I will implement it verbatim with unit-style sanity checks on 8–10 answer patterns to confirm every value can plausibly land in top 3.
