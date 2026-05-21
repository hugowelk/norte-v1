# Copy edits + new report-preview section

Three small changes across the two marketing pages. No layout, form, or CTA changes.

## 1. Homepage (`/`, `src/pages/Waitlist.tsx`) — "Why Norte" section

Replace headline and the three body paragraphs. Keep the label, layout, animation, and section styling.

- Headline becomes: "Most people have never actually named what matters to them."
- Body becomes three paragraphs:
  1. "Self-help tells you to get clear on your values. It doesn't tell you how. Picking words from a list gives you aspirations, not answers."
  2. "Norte uses 15 trade-off scenarios to surface what you actually prioritise when something's at stake. The result isn't a label. It's a pattern, and a plan."
  3. "One session. Grounded in ACT psychology. No journaling required."

The third paragraph keeps the existing emphasised foreground colour so it still anchors the section.

## 2. `/app` (`src/pages/Index.tsx`) — "Who it's for"

Replace the single paragraph with the new copy:

"Norte is for people who sense a gap between the life they're building and the one they actually want. People who are doing fine on paper and quietly restless in practice. People who are done with vague self-awareness and want something concrete."

Label, Start button, and spacing stay as-is.

## 3. `/app` — New "What the report looks like" section

Insert a new section between "What you get" and "Who it's for". Same horizontal rhythm and label treatment as the surrounding sections so it feels native.

Structure:

- Small uppercase label: "What the report looks like"
- Headline (DM Serif Display): "A reading of your behaviour, not a personality type."
- Preview card: subtle border, faint background tint, generous padding, rounded corners. Contains 3 lines of sample report text at a slightly smaller body size, with the value name "achievement" emphasised in the Norte accent colour:
  "Your loudest gap is achievement. You ranked it first aspirationally, but your choices placed it sixth. This isn't a motivation problem."
- Small muted footnote under the card: "900–1100 words. Specific to your answers. No two reports are alike."

Visual reference:

```text
WHAT THE REPORT LOOKS LIKE
A reading of your behaviour,
not a personality type.

┌──────────────────────────────────────────┐
│  Your loudest gap is achievement. You    │
│  ranked it first aspirationally, but     │
│  your choices placed it sixth. This      │
│  isn't a motivation problem.             │
└──────────────────────────────────────────┘
  900–1100 words. Specific to your answers.
  No two reports are alike.
```

## Technical notes

- Files touched: `src/pages/Waitlist.tsx`, `src/pages/Index.tsx`.
- Reuse existing tokens only: `text-accent`, `text-foreground`, `text-muted-foreground`, `bg-card`, `border-border`, `font-display`, `font-body`. No new colours, no new fonts.
- New section uses the same `max-w-3xl mx-auto` container and `py-20 md:py-24` rhythm as the neighbouring sections.
- No changes to algorithm, data, routing, or analytics.
