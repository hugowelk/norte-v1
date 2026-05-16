import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { PostPaywallLayout } from './PostPaywallLayout';
import { usePostPaywallStore } from '@/lib/postPaywallStore';

const MAX = 200;
const MIN = 5;

export function Q4WontGiveUp() {
  const navigate = useNavigate();
  const { state, update } = usePostPaywallStore();
  const [value, setValue] = useState(state.wont_give_up);

  const canContinue = value.trim().length >= MIN;

  const submit = () => {
    if (!canContinue) return;
    update({ wont_give_up: value.trim() });
    navigate('/post-paywall/loading');
  };

  return (
    <PostPaywallLayout step={4} backTo="/post-paywall/q3">
      <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground leading-tight">
        If closing this gap meant giving something up, what would you NOT be willing to give up?
      </h1>
      <p className="text-base text-foreground/80">
        One sentence. This shapes what the report suggests.
      </p>

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

      <ul className="space-y-1.5 text-sm italic text-muted-foreground">
        <li>"Time with my kids."</li>
        <li>"The income I make now."</li>
        <li>"My morning routine."</li>
        <li>"Feeling secure financially."</li>
      </ul>

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
