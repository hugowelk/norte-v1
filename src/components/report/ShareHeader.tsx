import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { dismissShareHeader, isShareHeaderDismissed } from '@/lib/reportOwnership';

interface Props { reportId: string; }

export function ShareHeader({ reportId }: Props) {
  const [hidden, setHidden] = useState(() => isShareHeaderDismissed(reportId));
  if (hidden) return null;

  return (
    <div className="w-full bg-secondary/60 border-b border-border">
      <div className="relative max-w-[960px] mx-auto px-6 py-3 flex items-center justify-center text-center">
        <p className="text-sm text-foreground">
          <em className="italic text-muted-foreground">Someone shared their Norte reading with you.</em>{' '}
          <Link to="/" className="underline text-primary font-medium">
            Curious about yours? →
          </Link>
        </p>
        <button
          aria-label="Dismiss"
          onClick={() => { dismissShareHeader(reportId); setHidden(true); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
