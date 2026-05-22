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
      <div className="space-y-4">
        <p className="text-base text-foreground/80">
          We often see people reevaluating their values during career transitions, breakups, moving to different countries, becoming parents, etc.
        </p>
        <p className="text-base text-foreground/80">
          In a few words, describe where you are in life right now. The more specific you are, the sharper the report.
        </p>
      </div>

      <div className="relative">
        <textarea
          rows={4}
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

      <div className="rounded-lg border border-border bg-card/50 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowExamples(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-display text-foreground hover:bg-muted/40 transition-colors"
        >
          <span>See examples</span>
          <ChevronDown
            size={16}
            className={`transition-transform ${showExamples ? 'rotate-180' : ''}`}
          />
        </button>
        {showExamples && (
          <ul className="px-4 pb-4 space-y-1.5 text-sm italic text-muted-foreground animate-accordion-down">
            <li>"Just left my job, figuring out what's next."</li>
            <li>"New parent, lost my edges."</li>
            <li>"Stuck. Last few years feel like autopilot."</li>
            <li>"Moved countries six months ago, still rebuilding."</li>
            <li>"Ended a long relationship, reassessing everything."</li>
          </ul>
        )}
      </div>

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
