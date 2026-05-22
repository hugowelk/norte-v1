import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { PostPaywallLayout } from './PostPaywallLayout';
import { usePostPaywallStore } from '@/lib/postPaywallStore';

const MAX = 280;
const MIN = 10;

export function Q2Chapter() {
  const navigate = useNavigate();
  const { state, update } = usePostPaywallStore();
  const [value, setValue] = useState(state.current_chapter);
  const [showExamples, setShowExamples] = useState(false);


  const canContinue = value.trim().length >= MIN;

  const submit = () => {
    if (!canContinue) return;
    update({ current_chapter: value.trim() });
    navigate('/post-paywall/q3');
  };

  return (
    <PostPaywallLayout step={2} backTo="/post-paywall/q1">
      <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground leading-tight">
        What's the current chapter of your life right now?
      </h1>
      <p className="text-base text-foreground/80">
        One or two sentences. The more specific you are, the sharper the report.
      </p>

      <div className="relative">
        <textarea
          rows={3}
          maxLength={MAX}
          value={value}
          onChange={e => setValue(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border-2 border-border bg-card focus:border-primary focus:outline-none font-body text-base text-foreground resize-none"
        />
        {value.length > 0 && (
          <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">
            {value.length} / {MAX}
          </span>
        )}
      </div>

      <ul className="space-y-1.5 text-sm italic text-muted-foreground">
        <li>"Just left my job, figuring out what's next."</li>
        <li>"New parent, lost my edges."</li>
        <li>"Stuck. Last few years feel like autopilot."</li>
      </ul>

      <button
        onClick={submit}
        disabled={!canContinue}
        className={`w-full py-4 rounded-lg font-display font-medium text-base transition-all ${
          canContinue
            ? 'bg-primary text-primary-foreground hover:opacity-90'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        }`}
      >
        Continue →
      </button>
    </PostPaywallLayout>
  );
}
