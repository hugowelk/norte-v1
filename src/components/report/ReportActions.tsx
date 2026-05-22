import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { track } from '@/lib/analytics';

interface Props { reportId?: string; }

export function ReportActions({ reportId }: Props) {
  const navigate = useNavigate();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast('Link copied. Anyone with it can read your report.', { duration: 2500 });
      track('report_link_copied', { report_id: reportId });
    } catch {
      toast.error('Could not copy link.');
    }
  };

  const handleDownload = () => {
    track('report_pdf_downloaded', { report_id: reportId });
    window.print();
  };

  const handleShare = async () => {
    track('report_upsell_clicked', { report_id: reportId, cta_location: 'footer' });
    const shareUrl = `${window.location.origin}/`;
    const shareData = {
      title: 'Norte',
      text: 'I just took Norte and discovered my values. Try it:',
      url: shareUrl,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // user cancelled — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast('Norte link copied. Share it with your friends.', { duration: 2500 });
    } catch {
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch md:items-center">
      <Button variant="outline" size="lg" className="min-h-12" onClick={handleDownload}>
        Download as PDF
      </Button>
      <Button variant="outline" size="lg" className="min-h-12" onClick={handleCopy}>
        Copy share link
      </Button>
      <Button size="lg" className="min-h-12 gap-2" onClick={handleShare}>
        <Share2 size={16} />
        Share Norte with your friends
      </Button>
    </div>
  );
}
