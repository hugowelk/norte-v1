import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { getValueByKey, type ValueKey } from '@/lib/values';
import { type ScoreResult } from '@/lib/algorithm';
import { ValueIcon } from '../ValueIcon';
import { cn } from '@/lib/utils';

interface Props {
  result: ScoreResult;
  onContinue: () => void;
}

export function ValueResults({ result, onContinue }: Props) {
  const top3 = [result.revealed.primary, result.revealed.secondary, result.revealed.tertiary];
  const rest = result.ranking.slice(3);
  const [restOpen, setRestOpen] = useState(false);

  return (
    <div className="space-y-10 pb-12">
      <div className="space-y-3 text-center">
        <p className="text-xs font-display uppercase tracking-widest text-accent">Your Results</p>
        <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground leading-tight">
          Here's what came up.
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Across the trade-offs you just made, these are the three values that showed up most often.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-display uppercase tracking-widest text-muted-foreground px-1">
          Your revealed top 3
        </p>
        {top3.map((key, i) => (
          <TopValueCard
            key={key}
            valueKey={key}
            rank={i + 1}
          />
        ))}
      </div>

      <div>
        <button
          onClick={() => setRestOpen(o => !o)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-border bg-card/60 hover:bg-card transition-colors text-left"
        >
          <span className="text-xs font-display uppercase tracking-widest text-muted-foreground">
            Other values that came up
          </span>
          <ChevronDown size={16} className={cn('text-muted-foreground transition-transform', restOpen && 'rotate-180')} />
        </button>
        {!restOpen && (
          <p className="px-4 pt-2 text-sm text-foreground/70 font-body">
            {rest.map((k, i) => (
              <span key={k}>
                <span className="text-muted-foreground tabular-nums mr-1.5">{i + 4}</span>
                {getValueByKey(k).label}
                {i < rest.length - 1 && <span className="text-muted-foreground/50 mx-2">·</span>}
              </span>
            ))}
          </p>
        )}
        {restOpen && (
          <div className="space-y-2 pt-3">
            {rest.map((key, i) => (
              <RestRow key={key} valueKey={key} rank={i + 4} />
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onContinue}
        className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-display font-medium hover:opacity-90 transition-opacity"
      >
        Next: choose the values you want at the centre →
      </button>
    </div>
  );
}

function TopValueCard({
  valueKey, rank,
}: {
  valueKey: ValueKey;
  rank: number;
}) {
  const value = getValueByKey(valueKey);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-primary/30 bg-card shadow-sm overflow-hidden"
    >
      <div className="flex items-center gap-4 px-5 py-4">
        <span className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-sm font-medium">
          {rank}
        </span>
        <ValueIcon value={valueKey} size={22} />
        <p className="font-display font-medium text-foreground text-lg">{value.label}</p>
      </div>
      <p className="px-5 pb-5 text-sm text-foreground/80 leading-relaxed border-t border-border/60 pt-3">
        {value.longDescription}
      </p>
    </motion.div>
  );
}

function RestRow({ valueKey, rank }: { valueKey: ValueKey; rank: number }) {
  const value = getValueByKey(valueKey);
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-card">
      <span className="w-6 h-6 rounded-full bg-secondary text-foreground/70 flex items-center justify-center font-display text-xs">
        {rank}
      </span>
      <ValueIcon value={valueKey} size={18} />
      <span className="font-display text-foreground">{value.label}</span>
    </div>
  );
}
