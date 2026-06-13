import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const MAX = 280;
const MIN = 3;

interface Props {
  initialValue: string;
  onContinue: (value: string) => void;
}

export function ChapterSelection({ initialValue, onContinue }: Props) {
  const { t } = useTranslation();
  const options = t('postPaywall.q2.options', { returnObjects: true }) as string[];

  const initialIsPreset = options.includes(initialValue);
  const [selected, setSelected] = useState<number | 'other' | null>(
    initialValue
      ? initialIsPreset
        ? options.indexOf(initialValue)
        : 'other'
      : null,
  );
  const [custom, setCustom] = useState(initialIsPreset ? '' : initialValue);

  const canContinue =
    selected !== null && (selected !== 'other' || custom.trim().length >= MIN);

  const submit = () => {
    if (!canContinue) return;
    const value = selected === 'other' ? custom.trim() : options[selected as number];
    onContinue(value);
  };

  return (
    <div className="space-y-8">
      <p className="text-xs font-display uppercase tracking-widest text-accent">
        {t('quiz.chapter.eyebrow', { defaultValue: 'Before we begin' })}
      </p>

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
    </div>
  );
}
