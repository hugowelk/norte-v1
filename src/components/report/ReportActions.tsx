import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { track } from '@/lib/analytics';

interface Props { reportId?: string; }

export function ReportActions({ reportId }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast(t('common.toasts.shareLinkCopied'), { duration: 2500 });
      track('report_link_copied', { report_id: reportId });
    } catch {
      toast.error(t('common.toasts.couldNotCopy'));
    }
  };

  const handleDownload = () => {
    track('report_pdf_downloaded', { report_id: reportId });
    window.print();
  };

  const handleShare = async () => {
    track('report_upsell_clicked', { report_id: reportId, cta_location: 'footer' });
    const shareUrl = `${window.location.origin}/`;
    const shareData = { title: 'Norte', text: t('report.actions.shareText'), url: shareUrl };
    if (navigator.share) {
      try { await navigator.share(shareData); return; } catch { /* user cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast(t('common.toasts.shareNorteCopied'), { duration: 2500 });
    } catch {
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch md:items-center">
      <Button variant="outline" size="lg" className="min-h-12" onClick={handleDownload}>
        {t('report.actions.downloadPdf')}
      </Button>
      <Button variant="outline" size="lg" className="min-h-12" onClick={handleCopy}>
        {t('report.actions.copy')}
      </Button>
      <Button size="lg" className="min-h-12 gap-2" onClick={handleShare}>
        <Share2 size={16} />
        {t('report.actions.share')}
      </Button>
    </div>
  );
}
