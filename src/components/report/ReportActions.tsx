import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function ReportActions() {
  const navigate = useNavigate();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast('Link copied — anyone with it can read your report.', { duration: 2500 });
    } catch {
      toast.error('Could not copy link.');
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch md:items-center">
      <Button variant="outline" size="lg" className="min-h-12" onClick={() => window.print()}>
        Download as PDF
      </Button>
      <Button variant="outline" size="lg" className="min-h-12" onClick={handleCopy}>
        Copy share link
      </Button>
      <Button size="lg" className="min-h-12" onClick={() => navigate('/')}>
        Take Norte yourself — $8
      </Button>
    </div>
  );
}
