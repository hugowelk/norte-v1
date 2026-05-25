// Language registry for the Norte report prompts.
// Adding a new language: create prompt.{code}.ts exporting a *_PROMPT and
// *_USER_PREFIX, then register it here.

import { EN_PROMPT, EN_USER_PREFIX } from "./prompt.en.ts";
import { PT_BR_PROMPT, PT_BR_USER_PREFIX } from "./prompt.pt-BR.ts";

type PromptEntry = { systemPrompt: string; userPrefix: string };

const PROMPTS: Record<string, PromptEntry> = {
  en: { systemPrompt: EN_PROMPT, userPrefix: EN_USER_PREFIX },
  "pt-BR": { systemPrompt: PT_BR_PROMPT, userPrefix: PT_BR_USER_PREFIX },
};

// Regional aliases: collapse bare language codes to a shipped variant.
const ALIASES: Record<string, string> = {
  pt: "pt-BR",
};

const FALLBACK = "en";

function resolveCode(language: string | undefined): string {
  if (!language) return FALLBACK;
  const lower = language.toLowerCase();
  // Exact (case-insensitive) match.
  for (const code of Object.keys(PROMPTS)) {
    if (code.toLowerCase() === lower) return code;
  }
  const prefix = lower.split("-")[0];
  if (ALIASES[prefix] && PROMPTS[ALIASES[prefix]]) return ALIASES[prefix];
  for (const code of Object.keys(PROMPTS)) {
    if (code.toLowerCase().split("-")[0] === prefix) return code;
  }
  return FALLBACK;
}

export function getSystemPrompt(language: string | undefined): string {
  return PROMPTS[resolveCode(language)].systemPrompt;
}

export function getUserPrefix(language: string | undefined): string {
  return PROMPTS[resolveCode(language)].userPrefix;
}

export function resolveLanguage(language: string | undefined): string {
  return resolveCode(language);
}
