import { motion } from 'framer-motion';
import { VALUES, type ValueKey } from '@/lib/values';
import { useTranslation, Trans } from 'react-i18next';
import { tValueLabel, tValueDescription } from '@/lib/i18nHelpers';
import { ValueIcon } from '../ValueIcon';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export type SelectableValue = { kind: 'core'; key: ValueKey };

export interface CoreValuesResult {
  slots: SelectableValue[];
}

interface Props {
  revealedTop3?: ValueKey[];
  onComplete: (r: CoreValuesResult) => void;
}

const TOTAL = 3;

export function CoreValuesSelection({ revealedTop3, onComplete }: Props) {
  const { t } = useTranslation();
  const [picked, setPicked] = useState<ValueKey[]>([]);

  const toggle = (key: ValueKey) => {
    setPicked(prev => {
      if (prev.includes(key)) return prev.filter(k => k !== key);
      if (prev.length >= TOTAL) return prev;
      return [...prev, key];
    });
  };

  const handleContinue = () => {
    if (picked.length !== TOTAL) return;
    onComplete({ slots: picked.map(key => ({ kind: 'core', key })) });
  };

  const remaining = TOTAL - picked.length;
  const revealedLabels = revealedTop3?.map(k => tValueLabel(t, k)) ?? [];

  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-3 text-center">
        <p className="text-xs font-display uppercase tracking-widest text-accent">{t('quiz.core.eyebrow')}</p>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground leading-tight">
          {t('quiz.core.title')}
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">{t('quiz.core.body')}</p>
      </div>

      {revealedLabels.length === 3 && (
        <div className="rounded-xl bg-accent/10 px-5 py-4">
          <p className="text-sm md:text-base text-foreground/85 leading-relaxed italic font-body">
            <Trans
              i18nKey="quiz.core.revealedNote"
              values={{ a: revealedLabels[0], b: revealedLabels[1], c: revealedLabels[2] }}
              components={{ strong: <span className="not-italic font-medium text-foreground" /> }}
            />
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {VALUES.map(v => {
          const rank = picked.indexOf(v.key);
          const selected = rank !== -1;
          const disabled = !selected && picked.length >= TOTAL;
          return (
            <button
              key={v.key}
              onClick={() => toggle(v.key)}
              disabled={disabled}
              className={cn(
                'relative text-left rounded-xl border-2 px-4 py-4 transition-all min-h-[120px] flex flex-col gap-2',
                selected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : disabled
                    ? 'border-border bg-card/40 opacity-40 cursor-not-allowed'
                    : 'border-border bg-card hover:border-primary/40 hover:bg-card/80',
              )}
            >
              {selected && (
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-sm font-medium"
                >
                  {rank + 1}
                </motion.span>
              )}
              <ValueIcon value={v.key} size={22} />
              <p className="font-display font-medium text-foreground">{tValueLabel(t, v.key)}</p>
              <p className="text-xs text-muted-foreground leading-snug font-body">
                {tValueDescription(t, v.key)}
              </p>
            </button>
          );
        })}
      </div>

      {picked.length > 0 && picked.length < TOTAL && (
        <p className="text-center text-xs text-muted-foreground font-body">
          {t('quiz.core.deselectHint')}
        </p>
      )}

      <button
        onClick={handleContinue}
        disabled={picked.length !== TOTAL}
        className={cn(
          'w-full py-4 rounded-lg font-display font-medium transition-all',
          picked.length === TOTAL
            ? 'bg-primary text-primary-foreground hover:opacity-90'
            : 'bg-muted text-muted-foreground cursor-not-allowed',
        )}
      >
        {picked.length === 0
          ? t('quiz.core.pickThree')
          : picked.length === TOTAL
            ? t('quiz.core.continue')
            : t('quiz.core.pickMore', { count: remaining })}
      </button>
    </div>
  );
}
