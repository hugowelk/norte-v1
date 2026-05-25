import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguagePicker } from './LanguagePicker';

export function SiteFooter() {
  const { t } = useTranslation();
  return (
    <footer className="px-6 py-8 border-t border-border/60 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between text-sm">
        <div className="flex items-center gap-5">
          <Link to="/" className="font-display font-semibold tracking-tight text-foreground">
            Norte
          </Link>
          <Link to="/methodology" className="text-muted-foreground hover:text-foreground transition-colors">
            {t('common.footer.methodology')}
          </Link>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-muted-foreground text-xs">{t('common.footer.copyright')}</span>
          <LanguagePicker />
        </div>
      </div>
    </footer>
  );
}
