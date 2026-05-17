import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { hasSeenPrivacyNotice, markPrivacyNoticeSeen } from '@/lib/reportOwnership';

interface Props { reportId: string; }

export function PrivacyNotice({ reportId }: Props) {
  const [hidden, setHidden] = useState(() => hasSeenPrivacyNotice(reportId));
  if (hidden) return null;

  const url = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="mb-8 border-2 border-dashed border-accent/60 rounded-md p-5 bg-background">
      <p className="font-semibold text-foreground mb-2">Your report has a unique link.</p>
      <p className="font-mono text-sm text-muted-foreground break-all mb-3">{url}</p>
      <p className="text-base text-foreground mb-4">
        Anyone with this link can read it. Share where it makes sense, or keep it private.
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={() => { markPrivacyNoticeSeen(reportId); setHidden(true); }}
      >
        Got it
      </Button>
    </div>
  );
}
