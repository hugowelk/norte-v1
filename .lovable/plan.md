# Prompt 4 — PDF Export, Edge Cases & Polish

Finishing pass: print stylesheet, abandoned-session recovery, defensive layout, SEO/OG, and lightweight analytics.

## 1 · Print stylesheet

Add a `@media print` block to `src/index.css` that:
- Hides chrome via class hooks: `.no-print`, `nav`, `header`, `footer`.
- Resets `.report-content` (max-width, padding, margin).
- Defines print typography (DM Sans body 11pt, DM Serif Display H2 18pt dark green, olive bold, etc.).
- Sets `@page A4` with `@bottom-center: "norte.app · your reading"` and `@bottom-right: counter(page)`, suppressed on `:first` page.
- Adds `.pdf-header` (display: none on screen, block on print) styles.
- `orphans/widows: 3`, `page-break-after: avoid` on H2, `page-break-inside: avoid` on `ol li`.
- Defensive `overflow-wrap: break-word` on `.report-content p, li, h2`.

Apply class hooks in `ReportPage.tsx`:
- `<article className="report-content">` wraps markdown.
- `ShareHeader` and `PrivacyNotice` get `no-print`.
- Actions cluster + footer line get `no-print`.
- New `<div className="pdf-header">` with title + formatted `report.created_at` (via `Intl.DateTimeFormat('en-US', { year:'numeric', month:'long', day:'numeric' })`).

## 2 · Abandoned-session recovery

New edge function `check-report-status` (public, no JWT):
- `POST` `{ paymentSessionId }`.
- Looks up `reports` by `payment_session_id`.
- Returns `{ status: 'complete', report_id }` if found, else `{ status: 'pending' }`. (No 24h expiry table to query — treat all not-found as pending; client-side timestamp guards expiry.)

Frontend:
- `src/lib/pendingSession.ts` — localStorage helpers (`setPendingSession({ id, startedAt })`, `getPendingSession()`, `clearPendingSession()`). 24h client-side expiry.
- `LoadingPlaceholder` calls `setPendingSession` on mount, `clearPendingSession` on success, leaves it on failure.
- New top-level effect in `App.tsx` (small `<SessionRecovery />` component inside `<BrowserRouter>`): on mount, if a pending session exists and current path is not `/post-paywall/loading` or `/r/*`, call `check-report-status`. If complete → `markOwnedReport` + clear + `navigate(/r/{id})`. If pending → `navigate(/post-paywall/loading)` only when assessment data still present (so LoadingPlaceholder can re-fire). If expired → clear silently.

## 3 · SEO / OG

Add a small `useDocumentMeta` hook (`src/lib/useDocumentMeta.ts`) that imperatively sets/removes `<meta>` tags in `document.head`. Use it inside `ReportPage`:
- `<meta name="robots" content="noindex">`
- `og:title`, `og:description`, `og:url`, `og:image` (placeholder `https://norte.app/og-default.png` per spec).
- Restore previous values on unmount.

## 4 · Analytics

`src/lib/analytics.ts` — `track(event, props)` that `console.log`s a structured `[analytics] event { props }` payload. Wired at:
- `report_generated` (LoadingPlaceholder success, includes `generation_time_ms` measured from request start).
- `report_viewed` (ReportPage after fetch ok, with `is_creator`).
- `report_pdf_downloaded` (ReportActions Download click).
- `report_link_copied` (ReportActions Copy click).
- `report_upsell_clicked` (ReportActions primary CTA click, and ShareHeader link click — pass `cta_location: 'footer' | 'header'`).
- `report_404` (ReportPage when not-found).

## 5 · Polish

Apply subtle tweaks while editing components:
- 1px muted `<hr>` between report body and actions cluster (`mt-16 mb-12` rhythm).
- Confirm primary button visually heavier via existing size + variant.
- Privacy notice padding bumped to keep it quiet (already done).

## Files

New:
- `supabase/functions/check-report-status/index.ts`
- `src/lib/pendingSession.ts`
- `src/lib/analytics.ts`
- `src/lib/useDocumentMeta.ts`
- `src/components/SessionRecovery.tsx`

Edited:
- `src/index.css` (print block + pdf-header styles + overflow-wrap)
- `src/pages/ReportPage.tsx` (classes, pdf-header, meta, analytics, hr)
- `src/components/report/ShareHeader.tsx` (`no-print`, analytics)
- `src/components/report/PrivacyNotice.tsx` (`no-print`)
- `src/components/report/ReportActions.tsx` (analytics)
- `src/components/post-paywall/LoadingPlaceholder.tsx` (pending session + analytics)
- `src/App.tsx` (mount `<SessionRecovery />`)

## Out of scope

Real analytics provider (PostHog/Plausible), Stripe wiring, account-based report lists.
