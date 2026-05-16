# Prompt 2 — AI Generation, Loading Screen, Database Persistence

Wire the existing `/post-paywall/loading` placeholder to a real backend that generates the AI report, saves it, and redirects to `/r/{report_id}`. The report page itself (`/r/:id`) is out of scope (next prompt).

## Prerequisites

- **Enable Lovable Cloud** — needed for the `reports` table and the edge function that holds the Anthropic key. (Cloud is Supabase under the hood; no external account.)
- **Add `ANTHROPIC_API_KEY` secret** after Cloud is on. The key stays server-side in the edge function only.

Note: Lovable's default for AI is the Lovable AI Gateway (no key needed, billed per request). The prompt explicitly asks for Anthropic `claude-sonnet-4-5-20250929`, so the plan honors that. Say the word if you'd rather use Lovable AI instead.

## Database

New table `reports` (migration):

```sql
create table public.reports (
  id text primary key,
  created_at timestamptz default now(),
  payment_session_id text unique not null,
  input_data jsonb not null,
  report_markdown text not null,
  view_count integer default 0,
  paid boolean default true
);
create index idx_reports_payment_session on public.reports(payment_session_id);

alter table public.reports enable row level security;

-- public-by-link read, no anon write/update/delete
create policy "reports_public_read" on public.reports for select using (true);
```

Inserts happen only inside the edge function using the service role, so no insert policy for anon is needed.

## Edge function — `generate-report`

`supabase/functions/generate-report/index.ts`, invoked from the client via `supabase.functions.invoke('generate-report', { body })`. Public (no JWT) so the anonymous flow can call it.

Behavior:
1. Parse body matching the shape from the prompt (`paymentSessionId`, `assessmentResults`, `postPaywallAnswers`).
2. Idempotency: `select id from reports where payment_session_id = ?`. If present, return `{ success: true, report_id }`.
3. Build `inputData` by merging `assessmentResults` + `postPaywallAnswers` into a single object (field names as documented in prompt).
4. Call Anthropic Messages API:
   - `POST https://api.anthropic.com/v1/messages`
   - headers: `x-api-key: ANTHROPIC_API_KEY`, `anthropic-version: 2023-06-01`, `content-type: application/json`
   - body: `{ model: 'claude-sonnet-4-5-20250929', max_tokens: 2000, temperature: 0.7, system: NORTE_REPORT_SYSTEM_PROMPT, messages: [{ role: 'user', content: 'Generate the report for this user:\n\n' + JSON.stringify(inputData, null, 2) }] }`
   - 429 → wait 2s, retry once.
5. Extract `content[0].text` as `report_markdown`.
6. Generate a short URL-safe id (12-char nanoid-style, custom helper — no new deps).
7. Insert into `reports`. On unique-violation race, re-select and return existing id.
8. Return `{ success: true, report_id }`. On any failure return `{ success: false, error }` and do NOT insert.

System prompt: stored as a constant `NORTE_REPORT_SYSTEM_PROMPT` in `supabase/functions/generate-report/prompt.ts` using the placeholder string from the doc. Swap to the real ~3500-word prompt later by editing that one file.

CORS: standard `Access-Control-Allow-Origin: *` + handle OPTIONS.

## Frontend — Loading screen

Replace `src/components/post-paywall/LoadingPlaceholder.tsx` content (keep the file/route) with the real loading UI:

- Full-screen cream background, centered column.
- Top: small Norte compass mark. Pulsing opacity 0.4↔1.0 over 2s (Tailwind `animate-pulse` overridden with a custom keyframe in `index.css` or inline `@keyframes` for the exact range; no spin).
- 32px below: one of three rotating status lines, DM Sans body, centered, 300ms crossfade via framer-motion `AnimatePresence`:
  1. `Reading your trade-offs…`
  2. `Connecting the pattern to what you said about your life…`
  3. `Writing your report. This usually takes about 30 seconds.`
  - 8s per line; after line 3, keep looping line 3 until response arrives.
- No progress bar.

Lifecycle:
- On mount, read `postPaywallStore`. Build the request body (use `findAspirationalGaps` from `algorithm.ts`; map `time_picks`/`money_picks` to `TIME_OPTIONS[i].label` / `MONEY_OPTIONS[i].label` from `values.ts`).
- Call edge function via Supabase client. 90s client-side timeout via `AbortController`.
- On success → `clearPostPaywall()` then `navigate('/r/' + report_id, { replace: true })`. (The `/r/:id` route will 404 until next prompt — expected.)
- On failure → switch to retry UI:
  > Something interrupted the generation.\
  > We've saved your answers — try again?\
  > `[ Retry → ]`
- Track retry count in component state. After 3 failures, show the support message from the spec. Retry uses the same body.
- Guard against `StrictMode` double-invoke with a `useRef` flag so we don't fire two calls on mount in dev.

## Files

New:
- `supabase/migrations/<ts>_reports.sql`
- `supabase/functions/generate-report/index.ts`
- `supabase/functions/generate-report/prompt.ts`
- (Cloud auto-generates `src/integrations/supabase/client.ts` etc.)

Edited:
- `src/components/post-paywall/LoadingPlaceholder.tsx` — full loading + retry logic.

No new npm deps. No changes to `App.tsx` routing.

## Out of scope

`/r/:id` report page, PDF export, real Stripe webhook validation, `view_count` increment, full system prompt content.
