import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, ChevronDown } from 'lucide-react';
import { PostPaywallLayout } from './PostPaywallLayout';
import { usePostPaywallStore } from '@/lib/postPaywallStore';

const MAX = 200;
const MIN = 5;

export function Q4WontGiveUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state, update } = usePostPaywallStore();
  const [value, setValue] = useState(state.wont_give_up);
  const [showExamples, setShowExamples] = useState(false);
  const examples = t('postPaywall.q4.examples', { returnObjects: true }) as string[];

  const canContinue = value.trim().length >= MIN;

  const submit = () => {
    if (!canContinue) return;
    update({ wont_give_up: value.trim() });
    navigate('/post-paywall/loading');
  };

  return (
    <PostPaywallLayout step={3} backTo="/post-paywall/q3">
      <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground leading-tight">
        {t('postPaywall.q4.title')}
      </h1>
      <div className="space-y-4">
        <p className="text-base text-foreground/80">{t('postPaywall.q4.body1')}</p>
        <p className="text-base text-foreground/80">{t('postPaywall.q4.body2')}</p>
      </div>

      <div className="space-y-2">
        <div className="relative">
          <textarea rows={2} maxLength={MAX} value={value} onChange={e => setValue(e.target.value)} className="w-full px-4 py-3 rounded-lg border-2 border-border bg-card focus:border-primary focus:outline-none font-body text-base text-foreground resize-none" />
          {value.length > 0 && (
            <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">{value.length} / {MAX}</span>
          )}
        </div>

        <div>
          <button type="button" onClick={() => setShowExamples(v => !v)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <span>{t('postPaywall.q4.seeExamples')}</span>
            <ChevronDown size={14} className={`transition-transform ${showExamples ? 'rotate-180' : ''}`} />
          </button>
          {showExamples && (
            <ul className="mt-2 space-y-1.5 text-sm italic text-muted-foreground animate-accordion-down">
              {examples.map((ex, i) => <li key={i}>{ex}</li>)}
            </ul>
          )}
        </div>
      </div>

      <button onClick={submit} disabled={!canContinue} className={`w-full py-5 rounded-xl font-display font-semibold text-base transition-all flex items-center justify-center gap-2 shadow-md ${canContinue ? 'bg-primary text-primary-foreground hover:opacity-90' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}>
        <Sparkles size={18} strokeWidth={1.75} />
        {t('postPaywall.q4.generate')}
      </button>
    </PostPaywallLayout>
  );
}
