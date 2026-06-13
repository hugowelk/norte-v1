import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PostPaywallLayout } from './PostPaywallLayout';
import { usePostPaywallStore } from '@/lib/postPaywallStore';

const MAX = 280;
const MIN = 3;

export function Q2Chapter() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state, update } = usePostPaywallStore();
  const options = t('postPaywall.q2.options', { returnObjects: true }) as string[];

  // Initial selection: match stored value against preset options; otherwise treat as "other".
  const initialIsPreset = options.includes(state.current_chapter);
  const [selected, setSelected] = useState<number | 'other' | null>(
    state.current_chapter
      ? initialIsPreset
        ? options.indexOf(state.current_chapter)
        : 'other'
      : null,
  );
  const [custom, setCustom] = useState(initialIsPreset ? '' : state.current_chapter);

  const canContinue =
    selected !== null && (selected !== 'other' || custom.trim().length >= MIN);

  const submit = () => {
    if (!canContinue) return;
    const value = selected === 'other' ? custom.trim() : options[selected as number];
    update({ current_chapter: value });
    navigate('/post-paywall/q3');
  };

  return (
    <PostPaywallLayout step={1}>
      <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground leading-tight">
        {t('postPaywall.q2.title')}
      </h1>
      <div className="space-y-4">
        <p className="text-base text-foreground/80">{t('postPaywall.q2.body1')}</p>
        <p className="text-base text-foreground/80">{t('postPaywall.q2.body2')}</p>
      </div>

      <div className="space-y-2.5">
        {options.map((label, i) => {
          const isSel = selected === i;
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-full text-left px-5 py-4 rounded-lg border-2 transition-all duration-200 font-body text-base ${
                isSel
                  ? 'border-primary bg-primary/5 text-foreground shadow-sm'
                  : 'border-border bg-card hover:border-primary/40 text-foreground/80 hover:text-foreground'
              }`}
            >
              {label}
            </button>
          );
        })}

        <div>
          <button
            onClick={() => setSelected('other')}
            className={`w-full text-left px-5 py-4 rounded-lg border-2 transition-all duration-200 font-body text-base ${
              selected === 'other'
                ? 'border-primary bg-primary/5 text-foreground shadow-sm'
                : 'border-border bg-card hover:border-primary/40 text-foreground/80 hover:text-foreground'
            }`}
          >
            {t('postPaywall.q2.otherLabel')}
          </button>
          <AnimatePresence initial={false}>
            {selected === 'other' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="relative mt-2.5">
                  <textarea
                    autoFocus
                    rows={3}
                    maxLength={MAX}
                    value={custom}
                    onChange={e => setCustom(e.target.value)}
                    placeholder={t('postPaywall.q2.customPlaceholder')}
                    className="w-full px-4 py-3 rounded-lg border-2 border-border bg-card focus:border-primary focus:outline-none font-body text-base text-foreground resize-none"
                  />
                  {custom.length > 0 && (
                    <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">
                      {custom.length} / {MAX}
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
        {t('common.actions.continueArrow')}
      </button>
    </PostPaywallLayout>
  );
}
