import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export function ReportNotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-6">
        <h1 className="font-display text-3xl text-foreground">{t('report.notFound.title')}</h1>
        <p className="text-muted-foreground">{t('report.notFound.body')}</p>
        <Button asChild size="lg">
          <Link to="/">{t('report.notFound.cta')}</Link>
        </Button>
      </div>
    </div>
  );
}
