import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { hasSeenPrivacyNotice, markPrivacyNoticeSeen } from '@/lib/reportOwnership';

interface Props { reportId: string; }

export function PrivacyNotice({ reportId }: Props) {
  const { t } = useTranslation();
  const [hidden, setHidden] = useState(() => hasSeenPrivacyNotice(reportId));
  if (hidden) return null;

  const url = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="mb-8 border-2 border-dashed border-accent/60 rounded-md p-5 bg-background">
      <p className="font-semibold text-foreground mb-2">{t('report.privacy.title')}</p>
      <p className="font-mono text-sm text-muted-foreground break-all mb-3">{url}</p>
      <p className="text-base text-foreground mb-4">{t('report.privacy.body')}</p>
      <Button variant="outline" size="sm" onClick={() => { markPrivacyNoticeSeen(reportId); setHidden(true); }}>
        {t('common.actions.gotIt')}
      </Button>
    </div>
  );
}
