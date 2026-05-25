# Localize Norte to Brazilian Portuguese (pt-BR)

Add full pt-BR translation, auto-detect for Portuguese-speaking visitors, and a footer language picker. English remains the default and fallback.

## Scope decisions

- **Languages shipped:** `en` (default) and `pt-BR`. Architecture leaves room for more later.
- **Auto-detect:** First visit only. Match `navigator.language` against the Portuguese country list below. Once the user picks a language manually (or visits with `?lang=`), persist that choice and stop auto-detecting.
- **Portuguese countries detected:** BR, PT, AO, MZ, CV, GW, ST, TL (all `pt-*` locales map to pt-BR for now since we only ship one Portuguese variant; we surface it in the UI as "Português").
- **Persistence:** `localStorage` key `norte_lang`. URL query `?lang=pt-BR` overrides and updates storage.
- **Picker location:** A small footer added to all public pages (Index, Methodology, ReportPage, post-paywall flow). Globe icon + current language label, opens a menu with "English" / "Português".
- **SEO:** Set `<html lang>` dynamically. Add `hreflang` alternate link tags in `<head>` for `en` and `pt-BR`. Keep one URL per page (no `/pt/` prefix in this pass — simpler, and the report URLs are user-shared).
- **AI report language:** Pass the active language to `generate-report`. The Edge Function prompt branches to a pt-BR system prompt so the user gets the report in their language. The voice rules (no em-dashes, no hedging, direct tone) are translated and enforced in both.

## What gets translated

All hard-coded user-facing strings, including:

- `src/pages/*` (Index, Methodology, ReportPage, NotFound)
- `src/components/quiz/*` — including the 15 trade-off scenarios in `src/lib/algorithm.ts` and the value labels/descriptions/`valueExplanations.ts`
- `src/components/post-paywall/*` (Q2/Q3/Q4 etc.)
- `src/components/report/*` (PrivacyNotice, ReviewDialog, share/actions copy)
- Paywall pricing label (price stays "$9", caption translated)
- Toasts, errors, meta titles/descriptions

Not translated: admin panel (internal), the AI-generated report markdown (the model writes it in the requested language directly).

## Library choice

Use **`react-i18next` + `i18next` + `i18next-browser-languagedetector`**. Standard, tiny, well-supported, supports interpolation/plurals which we'll need (e.g. "X of 15", value names inside sentences). Translations live as JSON namespaces split per area to keep files reviewable.

## File structure

```text
src/i18n/
  index.ts                  i18n init, detector config, fallback
  useLang.ts                hook to read/set active language
  locales/
    en/
      common.json           nav, footer, buttons, toasts
      quiz.json             scenarios, intros, transitions
      values.json           value names, short descriptions, explanations
      report.json           share header, actions, review dialog
      pages.json            Index, Methodology, NotFound meta + copy
    pt-BR/
      (mirror of en/)
src/components/LanguagePicker.tsx
src/components/SiteFooter.tsx
```

The 15 scenarios stay structurally in `src/lib/algorithm.ts` (IDs, weights, value mappings) — only the display strings move to `quiz.json`, looked up by scenario ID.

## Backend changes

- `generate-report` accepts a `language: "en" | "pt-BR"` field on the request body.
- `supabase/functions/generate-report/prompt.ts` exports `getSystemPrompt(language)` returning the matching prompt. Both versions follow the same voice rules and output structure.
- `reports` table: add a `language` column (text, default `'en'`) so shared report pages can render meta in the right language. Stored alongside the markdown.

## Technical implementation

1. **Add deps:** `i18next`, `react-i18next`, `i18next-browser-languagedetector`.
2. **`src/i18n/index.ts`:** init with `en` fallback; detector order = `querystring`, `localStorage`, `navigator`; normalize any `pt-*` locale to `pt-BR`; cache in `localStorage` under `norte_lang`.
3. **`src/main.tsx`:** import `./i18n` before `<App />` mounts.
4. **`<html lang>`:** small effect in `App.tsx` that sets `document.documentElement.lang` whenever language changes; also injects `<link rel="alternate" hreflang>` tags via `useDocumentMeta`.
5. **`LanguagePicker.tsx`:** shadcn `DropdownMenu` triggered by a Globe icon + active label. Calls `i18n.changeLanguage(lang)`; navigation stays on the current route.
6. **`SiteFooter.tsx`:** thin footer with brand mark on the left, picker + small links on the right. Mounted from `App.tsx` so it appears on every public route except full-bleed flows where it would distract (we can hide it on quiz pages — confirm in QA).
7. **Component refactor pass:** replace inline strings with `t('namespace.key')`. Quiz scenarios get keys like `quiz.scenarios.C7.prompt`, `quiz.scenarios.C7.options.A`.
8. **Report generation:** client passes current `i18n.language` to the Edge Function; function picks the prompt and writes `language` into the row; `ReportPage` reads the row's language to render meta/share copy.

## Voice rules in pt-BR

Same spirit as the English rules: no em-dashes, no hedging ("talvez", "possivelmente"), no empty intensifiers, direct active voice, short sentences, concrete imagery. Translations will be authored against these rules, not literal.

## Rollout

- Phase 1 (this plan): infra, picker, en + pt-BR JSONs, English-language report still works, pt-BR report when selected.
- Phase 2 (later): per-language meta descriptions for SEO, optional `/pt-br/` URL prefix if we want indexed separate pages.

## Open question for you

1. **Translation authoring:** do you want to write the pt-BR copy yourself (I scaffold all keys with English placeholders and you fill them in), or should I draft an initial pt-BR pass for you to edit? The 15 scenarios and the 8 value explanations are the most voice-sensitive pieces — your call matters most there.
2. **Footer on quiz screens:** keep the picker visible during the quiz, or hide it after the first scenario to avoid distraction? Default I'd ship: visible on landing/results/report, hidden mid-quiz.
