import { useTranslation } from 'react-i18next';
import { currentLang, setLang, type SupportedLang } from './index';

export function useLang() {
  const { i18n } = useTranslation();
  return {
    lang: (i18n.language?.startsWith('pt') ? 'pt-BR' : 'en') as SupportedLang,
    setLang,
    current: currentLang,
  };
}
