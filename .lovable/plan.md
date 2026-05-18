# Norte v3 — UI Iteration Plan

Big scope. Split into 3 phases, each independently shippable. Confirm phasing before I start Phase A.

## Proposed phasing

I'm keeping your A/B/C structure. Rationale: A is low risk and unblocks credibility wins; B is the highest-stakes content work (locked copy already provided); C is the emotional payoff and the most animation-heavy.

### Phase A — Foundation (low risk, shippable alone)

1. **Global voice & count audit.** Sweep for any remaining "13", "top 5", em-dashes, Time/Money references, AI-tone phrasing. Fix progress bar denominator if still 13.
2. **Homepage rebuild.** Replace `src/pages/Index.tsx` sections with the 6-section structure: Hero, The problem, How it works (3 blocks, no Lucide icons), What you get, Who it's for, Methodology footer. Single CTA only.
3. **New "How this works" onboarding slide.** Insert between current mechanism explanation and the quiz start CTA. Three numbered points + methodology footer. Keep existing two-card psychological contract intact.
4. **`/methodology` page (scaffold).** New route. Five sections with the locked copy + placeholders where Hugo will fill in. Linked from results footer (link added in Phase B).

### Phase B — Results page rebuild (biggest content change)

1. **Top 3 value cards.** Rank, name, score, three open paragraphs (Definition / How it showed up / The cost) using the verbatim locked copy from the Value Explanations Reference for all 8 values. Stored in a new `src/lib/valueExplanations.ts` keyed by value id.
2. **"Why this value?" receipts.** Collapsible per card. Derive 2-3 driving scenarios from the user's answers: filter scenarios where the chosen option's value matches the card's value, sort by weight desc, take top 3. Show truncated prompt + chosen option + weight contribution.
3. **Secondary values divider + condensed list (#4–#8).** No accordion, one row each, one-sentence summary (first sentence of definition).
4. **Methodology footer + link to `/methodology`.** Remove the old dropdown and any Time/Money residual UI.

### Phase C — Transition + Aspirational rebuild (emotional payoff)

1. **10-second transition animation.** New component between last quiz answer and results. Four stages (Collection → Weighting → Ranking → Reveal prep), pure CSS/JS. Skip button after 5s. Reduced-motion fallback rotates the 4 phrases.
2. **Aspirational Screen 1 — Choose 3.** Rebuild `CoreValuesSelection.tsx` as 4×2 card grid (2×4 mobile) with numbered selection badges, dim non-selected once 3 picked, tap-to-deselect.
3. **Aspirational Screen 2 — Rate presence.** Replace dropdowns in `AlignmentReflection.tsx` with sliders 0–10, live numeric, end labels.
4. **Aspirational Screen 3 — Gap reveal.** New screen. Two stacked horizontal bars per value (Revealed 0–100, Felt slider×10), "Gap of X points in [Value]" caption. CTA into paywall.

## Questions before I start

1. **Phase A first?** Confirm I should start with Phase A as scoped, or reorder.
2. **Reduced-motion fallback in the transition** — OK to also skip straight to results after 10s on reduced motion (rotating text only, no animation), same total duration?
3. **Receipts truncation** — the spec says ~100 chars. Some scenario prompts are longer; OK if I truncate at word boundary near 100 chars?
4. **"How this works" onboarding slide placement** — current onboarding has `TradeoffIntro` then quiz. Should the new slide come **before** `TradeoffIntro` (intro → how-it-works → quiz) or **after** (how-it-works → intro → quiz)? I'd recommend after `TradeoffIntro` as a final priming card before scenarios begin.

## Technical notes (for me)

- New file `src/lib/valueExplanations.ts` holds the locked copy; consumed by results cards, secondary list, methodology page.
- Receipts logic lives next to results component; pure derivation from `SCENARIOS` + `answers` already in state.
- Transition animation: standalone component mounted by `QuizFlow` between final answer and results; uses CSS keyframes + `prefers-reduced-motion`.
- Gap reveal scaling: felt(0–10) → ×10 for display only; revealed uses existing normalized 0–100 score.
- No changes to `algorithm.ts`, `values.ts` maxScores, Edge Function, or Stripe.

## First step after approval

Start Phase A, item 1 (audit) in parallel with item 2 (homepage), since they touch different files.
