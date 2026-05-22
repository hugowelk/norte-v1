import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ChevronDown } from 'lucide-react';
import { PostPaywallLayout } from './PostPaywallLayout';
import { usePostPaywallStore } from '@/lib/postPaywallStore';

const MAX = 200;
const MIN = 5;

export function Q4WontGiveUp() {
  const navigate = useNavigate();
  const { state, update } = usePostPaywallStore();
  const [value, setValue] = useState(state.wont_give_up);
  const [showExamples, setShowExamples] = useState(false);

  const canContinue = value.trim().length >= MIN;

  const submit = () => {
    if (!canContinue) return;
    update({ wont_give_up: value.trim() });
    navigate('/post-paywall/loading');
  };

  return (
    <PostPaywallLayout step={3} backTo="/post-paywall/q3">
      <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground leading-tight">
        If closing the gaps from how you are living your life today to how you want to live it, meant giving something up, what would you NOT be willing to give up?
      </h1>
      <div className="space-y-4">
        <p className="text-base text-foreground/80">
          Prioritising our values often includes making choices, leaving habits behind and sometimes, even making major changes in our lives.
        </p>
        <p className="text-base text-foreground/80">
          In a few words, describe something that's non-negotiable in this process. This will shape the actions you can take this week.
        </p>
      </div>

      <div className="space-y-2">
        <div className="relative">
          <textarea
            rows={2}
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

        <div>
          <button
            type="button"
            onClick={() => setShowExamples(v => !v)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>See examples</span>
            <ChevronDown
              size={14}
              className={`transition-transform ${showExamples ? 'rotate-180' : ''}`}
            />
          </button>
          {showExamples && (
            <ul className="mt-2 space-y-1.5 text-sm italic text-muted-foreground animate-accordion-down">
              <li>"Time with my kids."</li>
              <li>"The income I make now."</li>
              <li>"My morning routine."</li>
              <li>"Feeling secure financially."</li>
            </ul>
          )}
        </div>
      </div>

      <button
        onClick={submit}
        disabled={!canContinue}
        className={`w-full py-5 rounded-xl font-display font-semibold text-base transition-all flex items-center justify-center gap-2 shadow-md ${
          canContinue
            ? 'bg-primary text-primary-foreground hover:opacity-90'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        }`}
      >
        <Sparkles size={18} strokeWidth={1.75} />
        Generate my report →
      </button>
    </PostPaywallLayout>
  );
}
