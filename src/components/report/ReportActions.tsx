import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
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

  const handleUpsell = () => {
    track('report_upsell_clicked', { report_id: reportId, cta_location: 'footer' });
    navigate('/');
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch md:items-center">
      <Button variant="outline" size="lg" className="min-h-12" onClick={handleDownload}>
        Download as PDF
      </Button>
      <Button variant="outline" size="lg" className="min-h-12" onClick={handleCopy}>
        Copy share link
      </Button>
      <Button size="lg" className="min-h-12" onClick={handleUpsell}>
        Take Norte yourself ($8)
      </Button>
    </div>
  );
}
