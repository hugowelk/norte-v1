import { motion } from 'framer-motion';
import { VALUES, getValueByKey, type ValueKey } from '@/lib/values';
import { ValueIcon } from '../ValueIcon';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export type SelectableValue = { kind: 'core'; key: ValueKey };

export interface CoreValuesResult {
  slots: SelectableValue[];      // length 3, in pick order
}

interface Props {
  revealedTop3?: ValueKey[];
  onComplete: (r: CoreValuesResult) => void;
}

const TOTAL = 3;

export function CoreValuesSelection({ revealedTop3, onComplete }: Props) {
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
  const revealedLabels = revealedTop3?.map(k => getValueByKey(k).label) ?? [];

  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-3 text-center">
        <p className="text-xs font-display uppercase tracking-widest text-accent">Your Aspiration</p>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground leading-tight">
          Now. Pick the 3 values you want at the centre of your life.
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Not what came up. What you'd choose if you were choosing on purpose. The order you tap them is the order you're prioritising them.
        </p>
      </div>

      {revealedLabels.length === 3 && (
        <div className="rounded-xl bg-accent/10 px-5 py-4">
          <p className="text-sm md:text-base text-foreground/85 leading-relaxed italic font-body">
            Your revealed top 3 were <span className="not-italic font-medium text-foreground">{revealedLabels[0]}</span>, <span className="not-italic font-medium text-foreground">{revealedLabels[1]}</span>, and <span className="not-italic font-medium text-foreground">{revealedLabels[2]}</span>. The interesting question is which of these you want to keep at the centre, and what else you want to bring in.
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
              <p className="font-display font-medium text-foreground">{v.label}</p>
              <p className="text-xs text-muted-foreground leading-snug font-body">
                {v.description}
              </p>
            </button>
          );
        })}
      </div>

      {picked.length > 0 && picked.length < TOTAL && (
        <p className="text-center text-xs text-muted-foreground font-body">
          Tap a selected card to deselect it.
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
          ? 'Pick 3 to continue'
          : picked.length === TOTAL
            ? 'Continue →'
            : `Pick ${remaining} more`}
      </button>
    </div>
  );
}
