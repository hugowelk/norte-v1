import { useTranslation } from 'react-i18next';
import { AVAILABLE_LANGS, currentLang, setLang, type SupportedLang } from './index';

export function useLang() {
  const { i18n } = useTranslation();
  const raw = i18n.language ?? 'en';
  const exact = AVAILABLE_LANGS.find((l) => l.toLowerCase() === raw.toLowerCase());
  const prefix = raw.toLowerCase().split('-')[0];
  const prefixMatch = AVAILABLE_LANGS.find((l) => l.toLowerCase().split('-')[0] === prefix);
  const lang = (exact ?? prefixMatch ?? 'en') as SupportedLang;
  return { lang, setLang, current: currentLang };
}
