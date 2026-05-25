## Goal

The pt-BR localization is already built. This plan adjusts the architecture so adding French, Spanish, German, etc. later is a drop-in operation, not a refactor.

## Changes

### 1. Convention-based locale discovery
- Restructure `src/i18n/locales/` so each language is its own folder: `en/common.json`, `pt-BR/common.json`. (Currently flat files: `en.json`, `pt-BR.json`.)
- `src/i18n/index.ts` uses Vite's `import.meta.glob('./locales/*/common.json', { eager: true })` to auto-register every locale found on disk.
- No central registry file. Drop a folder = language exists.

### 2. Completeness gate
- Add a build-time helper `src/i18n/completeness.ts` that compares each locale's key set against `en` (the source of truth).
- Locales missing any key are excluded from the picker dropdown and from auto-detect.
- English always renders. Partial languages are invisible to users until complete.
- Dev-only console warning lists missing keys so translators know what's left.

### 3. Language-code-only auto-detect
- Replace the current country-list logic (BR, PT, AO, MZ, CV, GW, ST, TL) with a simple prefix match: `navigator.language.split('-')[0]`.
- `pt` → `pt-BR` (only Portuguese variant we ship), `es` → `es` when added, etc.
- Mapping lives in `src/i18n/index.ts` as a small `LANG_ALIASES` object — only needed for regional variants like pt-BR.

### 4. Per-language AI prompt files
- Rename `supabase/functions/generate-report/prompt.ts` → `prompt.en.ts` and `prompt.pt-BR.ts` (split the existing branching logic into two files).
- Add `prompt.index.ts` that maps language code → prompt module, with English fallback for unknown codes.
- Adding a new language to the AI = create one new `prompt.{lang}.ts` file.

### 5. Picker reads from registry
- `LanguagePicker.tsx` lists only languages that pass the completeness gate.
- Each locale folder gets a tiny `meta.json` (`{ "label": "Português (Brasil)", "nativeLabel": "Português" }`) so the picker doesn't need a hardcoded label map.

## Technical notes

- No DB changes. `reports.language` column already supports arbitrary codes.
- No new dependencies.
- The Cloud edge function dynamically imports the right prompt module based on the `language` field in the request payload, falling back to `en` if the file doesn't exist.
- `hreflang` tags in `App.tsx` are generated from the same registry, so SEO scales automatically.

## Out of scope

- Writing translations for any language other than en/pt-BR.
- Changing the existing pt-BR translation content.
- Region-specific routing (`/pt-br/...` URL paths). Current `?lang=` query + localStorage approach stays.
