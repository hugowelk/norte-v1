# Norte — MVP Flow Revisions

Restructures the Life Values Discovery experience around the new "Norte" brand and reorders the flow. The new flow is:

```text
Landing → Quiz (Time, Money, 13 Trade-offs, Pride, Regret, Triggers)
       → Results (top 5 + secondary, expandable)
       → Core Values Selection (combined sort + rank, 5 slots, custom values)
       → Alignment Check (scales pre-filled from behaviour)
       → Value Compass / Alignment Map (radar: current vs aspiring)
       → Commit to Action (emotional report + CTA)
       → Paywall (custom AI action plan)
```

## 1. Landing page

- Add "Norte" wordmark at the top of the landing screen (above or near the compass icon).
- Add a short credentials / methodology block near the bottom: a single paragraph + a small "Based on" line referencing the frameworks behind the tool (e.g. Schwartz values theory, ACT values work, behavioural-economics trade-off framing). Editorial styling, muted-foreground, small text.
- Update `<title>` and meta description to use "Norte".

## 2. Value icons (shared)

- Replace emoji on each of the 14 values in `src/lib/values.ts` with a Lucide icon mapping (keep emoji as fallback for now, or remove). Add an `icon: LucideIcon` field on `Value`.
- Create a small `<ValueIcon value={key} />` component used everywhere a value appears (Results, Sorting, Ranking, Alignment, Compass, Actions). Ensures one icon per area is reused consistently across screens.

## 3. Quiz — Time Reality & Money Behaviour

- In `QuizSection`, when the current question is `time` or `money`, render an extra "Add your own" input below the options. Custom entries are stored on the answer and contribute neutral / user-tagged weight (no value scoring; recorded for display only).
- Render each option with its mapped icon.

## 4. Trade-off Decisions — 13 scenarios

- Replace the current 3 trade-off questions in `QUIZ_QUESTIONS` with 13 forced-choice scenarios. (Awaiting the attached list — I will use the 13 scenarios you provide; if not provided, I will draft 13 covering the main value tensions: career vs family, money vs freedom, growth vs comfort, helping others vs self, health vs achievement, etc., for your review.)
- For forced-choice questions, auto-advance to the next question on selection — remove the Continue button for this type only. Multi-select questions keep Continue.

## 5. Results page

- Show **Top 5** values prominently, then a collapsed **"Other values that showed up"** secondary list (remaining inferred).
- Each value is an accordion card. Expanded state shows a behaviour-grounded paragraph: *"You've been prioritising X — your time goes into A and B, and your money into C…"* generated from the user's actual answers (we already have `answers` + the option labels in `values.ts`).
- Add a `buildBehaviourNarrative(valueKey, answers)` helper in `src/lib/values.ts` that walks the answers and stitches together the option labels that contributed to that value.

## 6. Core Values Selection (merges Sorting + Ranking)

- Single screen replacing both `ValueSorting` and `ValueRanking`.
- Left/top: **5 ordered placeholder slots** (1–5) the user fills with their core values, drag-to-reorder via `@dnd-kit`.
- Below: list of all values as accordion cards (label + icon collapsed; expanded shows description). Tap to add to the next empty slot; tap a slot to remove.
- "Add your own value" button opens an inline form (label + short description); custom values join the list and can be slotted.
- `QuizFlow` collapses `sorting` and `ranking` phases into a single `coreValues` phase; downstream consumers use `rankedValues = coreValues` (slot order).

## 7. Alignment Check

- For each of the top 5 values, show a 0–10 scale (slider).
- Pre-fill each slider with a suggested position derived from the behaviour scores (normalise `scores[value]` against the max possible for that value → 0–10). Show a small "Suggested from your behaviour" label.
- User can adjust freely; final values feed the Compass.

## 8. Value Compass / Alignment Map (was FinalInsights radar)

- Move this **before** the Commit to Action step.
- Radar chart with two series, relabelled:
  - **Current behaviour signals** (from quiz scores).
  - **Aspiring values** (from ranking + alignment slider positions).
- Below the chart: a short emotional, plain-language report comparing the two — biggest gaps, biggest alignments, one "this is where your life is pulling away from what matters" callout. Tone: warm, editorial, no jargon. Designed as an a-ha moment.
- Primary CTA at bottom: **"Explore next steps"** → goes to Commit to Action.

## 9. Commit to Action

- Moved to after the Compass.
- Keep current action-capture UI (1–3 actions tied to top values), but lead with a short framing pulled from the Compass insight ("You said freedom matters most, but your week is built around achievement. Here's where to start.").

## 10. Paywall — Custom AI Action Plan (new final page)

- New `Paywall` component shown after Commit to Action.
- Promotes the next product: a guided, AI-driven deep dive that turns the user's value gaps into a personalised behaviour-shift plan. Frame it as *not* goal-setting — it's about reshaping daily behaviours to raise life satisfaction by aligning with their values.
- Sections: hero headline, 3–4 benefit bullets, what's included, single CTA button ("Start my plan" — non-functional placeholder for now), small "maybe later" link that loops back to the Compass.
- No payment integration in this pass — visual paywall only.

## Phase order in `QuizFlow.tsx`

```text
quiz → results → coreValues → alignment → compass → actions → paywall
```

(rename `insights` → `compass`; remove `sorting` and `ranking`; add `paywall`.)

## Technical notes

- Files to edit: `src/pages/Index.tsx`, `src/lib/values.ts`, `src/components/QuizFlow.tsx`, `src/components/quiz/QuizSection.tsx`, `src/components/quiz/ValueResults.tsx`, `src/components/quiz/AlignmentReflection.tsx`, `src/components/quiz/ActionPlanning.tsx`, `src/components/quiz/FinalInsights.tsx` (rename to `ValueCompass.tsx`), `index.html`.
- Files to create: `src/components/quiz/CoreValuesSelection.tsx`, `src/components/quiz/Paywall.tsx`, `src/components/ValueIcon.tsx`.
- Files to delete: `src/components/quiz/ValueSorting.tsx`, `src/components/quiz/ValueRanking.tsx`.
- New helpers in `src/lib/values.ts`: `buildBehaviourNarrative`, `suggestedAlignmentFromScores`, value→Lucide icon map, type updates for custom values.
- Accordion: reuse shadcn `Accordion` for Results and Core Values lists.
- Copy is intentionally left rough — you flagged a separate copy pass later.

## Open item

- The 13 trade-off scenarios were referenced as "attached" but I don't see the attachment in this thread. Please paste them in chat (or confirm I should draft a first version covering the main value tensions for you to edit).
