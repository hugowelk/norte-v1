# Prompt 3 — Report Page `/r/:reportId`

Build the public report page and supporting share UX. Adds `react-markdown` + `remark-gfm` for parsing.

## Routing

- Add `<Route path="/r/:reportId" element={<ReportPage />} />` in `src/App.tsx`. Public (no `RequirePayment` gate).

## Data

- Fetch with `supabase.from('reports').select('id, created_at, report_markdown, input_data').eq('id', reportId).maybeSingle()`.
- Loading: lightweight cream-bg pulse (same compass mark from loading screen, no status text).
- Not found / error: render the 404 state described below.
- Fire-and-forget view increment via a new SECURITY DEFINER RPC `public.increment_report_view(p_id text)` (RLS blocks anon updates, so we need a function). Call `supabase.rpc('increment_report_view', { p_id: reportId })` — don't await.

## Components / Files

New:
- `src/pages/ReportPage.tsx` — orchestrator: fetch, 404, share header, privacy notice, markdown, actions, footer.
- `src/components/report/ShareHeader.tsx` — top bar shown to non-creators, dismissible.
- `src/components/report/PrivacyNotice.tsx` — one-time creator notice with the report URL and `Got it`.
- `src/components/report/ReportMarkdown.tsx` — memoized `ReactMarkdown` with typography overrides.
- `src/components/report/ReportActions.tsx` — Download PDF / Copy link / Take Norte yourself.
- `src/components/report/ReportNotFound.tsx` — 404 state.
- `src/lib/reportOwnership.ts` — localStorage helpers (`isOwnedReport`, `markOwnedReport`, dismiss flags).

Edited:
- `src/App.tsx` — add route.
- `src/components/post-paywall/LoadingPlaceholder.tsx` — on success call `markOwnedReport(report_id)` before navigating, so the creator's first view shows the privacy notice (not the share header).

## Layout

- Container: `max-w-[640px] mx-auto px-6 md:px-0 pt-20 pb-16`.
- Share header (only when not owner): full-width bar above container, ~48px tall, cream slightly darker than bg (use `bg-secondary/40` or similar token already in palette), centered copy `Someone shared their Norte reading with you. Curious about yours? →` (italic prefix, link to `/`), `×` button on right, dismissal stored at `norte_dismissed_share_header_{id}`.
- Privacy notice (only when owner AND not yet seen): card with dashed olive border above the report. Stores `norte_seen_privacy_notice_{id}` on dismiss.
- Markdown body (see typography below).
- 72px gap → actions cluster: vertical on mobile, `md:flex-row` on desktop, gap 16px.
- 64px gap → footer line: `Norte · Anyone with this link can read this report.` centered, 14px, muted.

## Markdown typography

`ReactMarkdown` with `remarkGfm`, components map:
- `p`: `text-[18px] leading-[1.65] text-foreground mb-5 font-sans`
- `h2`: `font-display text-[30px] leading-[1.2] text-primary mt-14 mb-5` (primary = brand dark green)
- `h3`: `font-display text-[22px] leading-[1.3] text-primary mt-10 mb-3`
- `strong`: `font-semibold text-accent` (accent = olive)
- `em`: `italic`
- `ul`, `ol`: standard spacing; `li` `pt-6` for first-level numbered items (matches "5 shifts" rhythm)
- `blockquote`: `border-l-2 border-accent pl-4 italic text-muted-foreground`
- `a`: `underline text-primary`

Memoize via `useMemo` keyed on `report_markdown` so re-renders don't re-parse.

## Actions

- `Download as PDF`: `variant="outline"`, calls `window.print()`.
- `Copy share link`: `variant="outline"`, writes `window.location.href`, fires sonner `toast('Link copied — anyone with it can read your report.')`.
- `Take Norte yourself — $8`: primary (`variant="default"`), `navigate('/')`.
- All buttons `min-h-12` (≥48px tap target).

## 404 state

Centered cream page, no chrome:
```
# This report doesn't exist
The link you followed may be wrong, or the report may have been removed.
[ Take Norte yourself → ]
```
Button links to `/`.

## Database migration

```sql
create or replace function public.increment_report_view(p_id text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.reports set view_count = view_count + 1 where id = p_id;
$$;

grant execute on function public.increment_report_view(text) to anon, authenticated;
```

## Deps

```
bun add react-markdown remark-gfm
```

## Out of scope

Print-specific styles (Prompt 4), PDF generation, SSR/SSG, email delivery.
