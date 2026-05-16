import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { getValueByKey, buildBehaviourNarrative, type ValueKey, type BehaviourAnswer } from '@/lib/values';
import { type ScoreResult } from '@/lib/algorithm';
import { ValueIcon } from '../ValueIcon';
import { cn } from '@/lib/utils';

interface Props {
  result: ScoreResult;
  timeAnswer: BehaviourAnswer | undefined;
  moneyAnswer: BehaviourAnswer | undefined;
  onContinue: () => void;
}

export function ValueResults({ result, timeAnswer, moneyAnswer, onContinue }: Props) {
  const top3 = [result.revealed.primary, result.revealed.secondary, result.revealed.tertiary];
  const rest = result.ranking.slice(3);

  return (
    <div className="space-y-10 pb-12">
      <div className="space-y-3 text-center">
        <p className="text-xs font-display uppercase tracking-widest text-accent">Your Results</p>
        <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground leading-tight">
          Here's what came up.
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Based on the trade-offs you actually made, these are the values driving your life right now.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-display uppercase tracking-widest text-muted-foreground px-1">
          Your revealed top 3
        </p>
        {top3.map((key, i) => (
          <ValueAccordion
            key={key}
            valueKey={key}
            rank={i + 1}
            score={result.normalized[key]}
            narrative={buildBehaviourNarrative(key, timeAnswer, moneyAnswer)}
            featured
            defaultOpen={i === 0}
          />
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-xs font-display uppercase tracking-widest text-muted-foreground px-1">
          Other values that came up
        </p>
        {rest.map((key, i) => (
          <ValueAccordion
            key={key}
            valueKey={key}
            rank={i + 4}
            score={result.normalized[key]}
            narrative={buildBehaviourNarrative(key, timeAnswer, moneyAnswer)}
          />
        ))}
      </div>

      <button
        onClick={onContinue}
        className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-display font-medium hover:opacity-90 transition-opacity"
      >
        Choose your core values
      </button>
    </div>
  );
}

function ValueAccordion({
  valueKey, rank, score, narrative, featured, defaultOpen = false,
}: {
  valueKey: ValueKey;
  rank: number;
  score: number;
  narrative: string;
  featured?: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const value = getValueByKey(valueKey);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-xl border bg-card overflow-hidden',
        featured ? 'border-primary/30 shadow-sm' : 'border-border',
      )}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-muted/30 transition-colors"
      >
        <span className="shrink-0 w-8 h-8 rounded-full bg-secondary text-foreground/70 flex items-center justify-center font-display text-sm font-medium">
          {rank}
        </span>
        <ValueIcon value={valueKey} size={22} />
        <div className="flex-1">
          <p className={cn(
            'font-display font-medium text-foreground',
            featured ? 'text-lg' : 'text-base',
          )}>
            {value.label}
          </p>
          {featured && <p className="text-xs text-muted-foreground mt-0.5">{value.description}</p>}
        </div>
        <span className="text-sm font-display text-accent font-medium tabular-nums">{score}</span>
        <ChevronDown
          size={18}
          className={cn('text-muted-foreground transition-transform shrink-0', open && 'rotate-180')}
        />
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.25 }}
          className="px-5 pb-5 space-y-2 text-sm text-foreground/80 leading-relaxed border-t border-border/60"
        >
          <p className="pt-3">{narrative}</p>
          <p className="text-muted-foreground italic">{value.longDescription}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
