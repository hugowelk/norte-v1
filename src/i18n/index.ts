import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { isComplete, missingKeys } from './completeness';

// Convention-based discovery: any folder under src/i18n/locales/{code}/
// with common.json + meta.json is auto-registered.
const commonModules = import.meta.glob('./locales/*/common.json', { eager: true }) as Record<
  string,
  { default: Record<string, unknown> }
>;
const metaModules = import.meta.glob('./locales/*/meta.json', { eager: true }) as Record<
  string,
  { default: { label: string; nativeLabel: string } }
>;

const STORAGE_KEY = 'norte_lang';
const SOURCE_LANG = 'en';

// Regional aliases: collapse browser locale prefixes to a shipped variant.
// Only needed when we ship a region-specific build (e.g. pt-BR but not pt-PT).
const LANG_ALIASES: Record<string, string> = {
  pt: 'pt-BR',
};

const FORCE_ENGLISH_HOSTS = ['findmyvalues.app', 'www.findmyvalues.app'];

function isEnglishForced(): boolean {
  if (typeof window === 'undefined') return false;
  return FORCE_ENGLISH_HOSTS.includes(window.location.hostname);
}

type LocaleEntry = {
  code: string;
  label: string;
  nativeLabel: string;
  translation: Record<string, unknown>;
  complete: boolean;
};

function pathToCode(path: string): string {
  // ./locales/pt-BR/common.json -> pt-BR
  const m = path.match(/\.\/locales\/([^/]+)\//);
  return m ? m[1] : '';
}

const allLocales: Record<string, LocaleEntry> = {};
for (const [path, mod] of Object.entries(commonModules)) {
  const code = pathToCode(path);
  if (!code) continue;
  const metaPath = path.replace('common.json', 'meta.json');
  const meta = metaModules[metaPath]?.default ?? { label: code, nativeLabel: code };
  allLocales[code] = {
    code,
    label: meta.label,
    nativeLabel: meta.nativeLabel,
    translation: mod.default,
    complete: false,
  };
}

const reference = allLocales[SOURCE_LANG]?.translation ?? {};
for (const entry of Object.values(allLocales)) {
  if (entry.code === SOURCE_LANG) {
    entry.complete = true;
    continue;
  }
  const missing = missingKeys(reference, entry.translation);
  entry.complete = missing.length === 0;
  if (!entry.complete && import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.warn(
      `[i18n] locale "${entry.code}" is incomplete (${missing.length} keys missing) and will be hidden from users.`,
      missing.slice(0, 20),
    );
  }
}

// On findmyvalues.app domains, lock everything to English regardless of detection.
const forceEnglish = isEnglishForced();

// Public registry: only complete locales are user-visible.
const _availableLocales: LocaleEntry[] = Object.values(allLocales).filter((l) => l.complete);
export const AVAILABLE_LOCALES: LocaleEntry[] = forceEnglish
  ? _availableLocales.filter((l) => l.code === SOURCE_LANG)
  : _availableLocales;
export const AVAILABLE_LANGS: string[] = AVAILABLE_LOCALES.map((l) => l.code);
export const LANG_LABELS: Record<string, string> = Object.fromEntries(
  AVAILABLE_LOCALES.map((l) => [l.code, l.nativeLabel]),
);

export type SupportedLang = string;
export const SUPPORTED_LANGS = AVAILABLE_LANGS;

// Resolve any detected locale (e.g. "pt-PT", "en-GB") to a shipped & complete locale.
function normalize(lang: string | undefined): string {
  if (!lang) return SOURCE_LANG;
  if (forceEnglish) return SOURCE_LANG;
  const lower = lang.toLowerCase();
  // Exact match (case-insensitive)
  const exact = AVAILABLE_LANGS.find((l) => l.toLowerCase() === lower);
  if (exact) return exact;
  // Prefix match: "en-GB" -> "en", then check aliases / availability
  const prefix = lower.split('-')[0];
  if (LANG_ALIASES[prefix] && AVAILABLE_LANGS.includes(LANG_ALIASES[prefix])) {
    return LANG_ALIASES[prefix];
  }
  const prefixMatch = AVAILABLE_LANGS.find((l) => l.toLowerCase().split('-')[0] === prefix);
  if (prefixMatch) return prefixMatch;
  return SOURCE_LANG;
}

const resources: Record<string, { translation: Record<string, unknown> }> = {};
for (const entry of AVAILABLE_LOCALES) {
  resources[entry.code] = { translation: entry.translation };
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: SOURCE_LANG,
    supportedLngs: AVAILABLE_LANGS,
    interpolation: { escapeValue: false },
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: STORAGE_KEY,
      caches: forceEnglish ? [] : ['localStorage'],
      convertDetectedLanguage: (lng) => normalize(lng),
    },
  });


if (i18n.language) {
  const norm = normalize(i18n.language);
  if (norm !== i18n.language) i18n.changeLanguage(norm);
}

export function setLang(lang: SupportedLang) {
  if (forceEnglish && lang !== SOURCE_LANG) return;
  i18n.changeLanguage(lang);
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }
}

export function currentLang(): SupportedLang {
  return normalize(i18n.language);
}

export default i18n;

// TEMP DEBUG
if (typeof window !== 'undefined') {
  setTimeout(() => {
    // eslint-disable-next-line no-console
    console.log('[i18n-debug]', {
      language: i18n.language,
      languages: i18n.languages,
      resolved: i18n.getDataByLanguage(i18n.language) ? Object.keys(i18n.getDataByLanguage(i18n.language)!) : 'none',
      heroTitle: i18n.t('pages.index.heroTitle'),
      available: AVAILABLE_LANGS,
      storage: localStorage.getItem(STORAGE_KEY),
    });
  }, 500);
}

