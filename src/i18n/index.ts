import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import ptBR from './locales/pt-BR.json';

export const SUPPORTED_LANGS = ['en', 'pt-BR'] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];

export const LANG_LABELS: Record<SupportedLang, string> = {
  en: 'English',
  'pt-BR': 'Português',
};

const STORAGE_KEY = 'norte_lang';

// Any Portuguese-region locale collapses to pt-BR (the only PT variant we ship).
function normalize(lang: string | undefined): SupportedLang {
  if (!lang) return 'en';
  const lower = lang.toLowerCase();
  if (lower.startsWith('pt')) return 'pt-BR';
  return 'en';
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      'pt-BR': { translation: ptBR },
    },
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGS as unknown as string[],
    nonExplicitSupportedLngs: true,
    load: 'currentOnly',
    interpolation: { escapeValue: false },
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: STORAGE_KEY,
      caches: ['localStorage'],
      convertDetectedLanguage: (lng) => normalize(lng),
    },
  });

// Belt-and-braces: even if detection skips conversion, force normalization once.
if (i18n.language) {
  const norm = normalize(i18n.language);
  if (norm !== i18n.language) i18n.changeLanguage(norm);
}

export function setLang(lang: SupportedLang) {
  i18n.changeLanguage(lang);
  try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* ignore */ }
}

export function currentLang(): SupportedLang {
  return normalize(i18n.language);
}

export default i18n;
