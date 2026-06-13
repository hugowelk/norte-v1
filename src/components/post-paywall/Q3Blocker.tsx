import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PostPaywallLayout } from './PostPaywallLayout';
import { usePostPaywallStore, type BlockerAnswer } from '@/lib/postPaywallStore';

const OPTION_KEYS: Exclude<BlockerAnswer, null>[] = [
  'not_tried', 'other_priorities_win', 'dont_know_what_it_looks_like',
  'hard_right_now', 'not_sure_want_it', 'other',
];

export function Q3Blocker() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state, update } = usePostPaywallStore();
  const [selected, setSelected] = useState<BlockerAnswer>(state.blocker_answer);
  const [custom, setCustom] = useState(state.blocker_custom_text);

  const gap = state.loudest_gap;
  // We translate gap.label via values namespace when possible; otherwise show stored label.
  const gapLabel = gap?.label ?? t('postPaywall.q3.fallbackValue');
  // If gap value is one of our value keys, prefer the translated label
  const translatedLabel = gap?.value ? t(`values.${gap.value}.label`, { defaultValue: gapLabel }) : gapLabel;

  const heading = gap?.isFallback
    ? t('postPaywall.q3.headingFallback', { label: translatedLabel })
    : t('postPaywall.q3.headingReal', { label: translatedLabel });

  const canContinue =
    selected !== null && (selected !== 'other' || custom.trim().length >= 3);

  const submit = () => {
    if (!canContinue) return;
    update({
      blocker_answer: selected,
      blocker_custom_text: selected === 'other' ? custom.trim() : '',
    });
    navigate('/post-paywall/q4');
  };

  return (
    <PostPaywallLayout step={1}>
      <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground leading-tight">
        {heading}
      </h1>
      <p className="text-sm text-muted-foreground">{t('postPaywall.q3.subtitle')}</p>

      <div className="space-y-2.5">
        {OPTION_KEYS.map(key => {
          const isSel = selected === key;
          return (
            <div key={key}>
              <button
                onClick={() => setSelected(key)}
                className={`w-full text-left px-5 py-4 rounded-lg border-2 transition-all duration-200 font-body text-base ${isSel ? 'border-primary bg-primary/5 text-foreground shadow-sm' : 'border-border bg-card hover:border-primary/40 text-foreground/80 hover:text-foreground'}`}
              >
                {t(`postPaywall.q3.options.${key}`)}
              </button>
              <AnimatePresence initial={false}>
                {key === 'other' && isSel && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                    <input
                      autoFocus
                      type="text"
                      maxLength={200}
                      value={custom}
                      onChange={e => setCustom(e.target.value)}
                      placeholder={t('postPaywall.q3.customPlaceholder')}
                      className="mt-2.5 w-full px-4 py-3 rounded-lg border-2 border-border bg-card focus:border-primary focus:outline-none font-body text-base text-foreground"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <button onClick={submit} disabled={!canContinue} className={`w-full py-4 rounded-lg font-display font-medium text-base transition-all ${canContinue ? 'bg-primary text-primary-foreground hover:opacity-90' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}>
        {t('common.actions.continueArrow')}
      </button>
    </PostPaywallLayout>
  );
}
