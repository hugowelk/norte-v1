# Prompt 1 — Post-Paywall Question Screens

Build the 4 screens that come after the Stripe paywall, with routing, state, and validation. No AI generation or report page yet (those are prompts 2–3).

## Routes

Add to `src/App.tsx`:

- `/post-paywall/q1` — Name (optional)
- `/post-paywall/q2` — Current chapter (required, ≥10 chars)
- `/post-paywall/q3` — Blocker (required, "Other" needs ≥3 chars)
- `/post-paywall/q4` — Won't give up (required, ≥5 chars)
- `/post-paywall/loading` — Placeholder ("Generation will happen here") until prompt 2

All `/post-paywall/*` routes are gated by a `paymentSessionId` flag in `sessionStorage`. Missing → redirect to `/` (where the existing paywall lives in `QuizFlow`).

## State

Single sessionStorage-backed store at key `norte_post_paywall`:

```ts
interface PostPaywallState {
  paymentSessionId: string;
  name: string;
  current_chapter: string;
  blocker_answer: 'not_tried' | 'other_priorities_win' | 'dont_know_what_it_looks_like'
    | 'hard_right_now' | 'not_sure_want_it' | 'other' | null;
  blocker_custom_text: string;
  wont_give_up: string;
  // assessment snapshot needed for Q3 + prompt 2
  loudest_gap_value: string | null;
  loudest_gap_label: string;
  assessment: AssessmentSnapshot;
}
```

A small `usePostPaywallStore` hook reads/writes JSON to sessionStorage so refresh + back-nav pre-fill works.

## Paywall hand-off

In `src/components/quiz/Paywall.tsx`, the "Unlock" CTA currently does nothing real. Change it to:

1. Compute the assessment snapshot (revealed top 3, aspirational top 5, loudest gap via `findAspirationalGaps`, time/money picks).
2. Write it + a generated `paymentSessionId` (uuid) to the store.
3. `navigate('/post-paywall/q1')`.

For now, no real Stripe — the click acts as "payment complete." Real Stripe wiring happens later.

## Loudest gap for Q3

Use `findAspirationalGaps(aspirationalTop5, revealedTop3)[0]`. If none, fall back to `aspirational[0]` and swap Q3 copy to "What's been making it harder to deepen your relationship with **{value}**?".

The aspirational top 5 is the user's `core.slots` from `CoreValuesSelection`. Pass it from `QuizFlow` into the Paywall (or read from a lifted state) so the snapshot is complete at hand-off.

## Screens

Each screen is a new file in `src/components/post-paywall/`:

- `PostPaywallLayout.tsx` — cream bg, max-w 640px, eyebrow + back link + content slot. Matches existing scenario rhythm.
- `Q1Name.tsx` — single input, max 30, autofocus, Skip link, Continue always enabled.
- `Q2Chapter.tsx` — 3-row textarea, max 280, live counter, 3 italic example lines, Continue ≥10 chars.
- `Q3Blocker.tsx` — 5 selectable card rows + "Other" with revealed text input (max 200). H1 interpolates `{loudest_gap_value}` in bold olive.
- `Q4WontGiveUp.tsx` — input/textarea, max 200, counter, 4 italic examples, CTA `Generate my report →` ≥5 chars. Routes to `/post-paywall/loading`.

Eyebrows: `BEFORE YOUR REPORT · N OF 4`. Back link top-left from Q2 onward. Reuse existing tokens (no new colors).

## Out of scope

AI call, real loading visual, report page, PDF, real Stripe — all in later prompts.

## Technical notes

- New files: `src/lib/postPaywallStore.ts`, `src/components/post-paywall/{PostPaywallLayout,Q1Name,Q2Chapter,Q3Blocker,Q4WontGiveUp,LoadingPlaceholder,RequirePayment}.tsx`, 5 route entries in `App.tsx`.
- Edited: `Paywall.tsx` (CTA → navigate + store write), `QuizFlow.tsx` (pass `core.slots` to Paywall for snapshot).
- No new deps; uses existing `react-router-dom`, shadcn primitives, framer-motion.
