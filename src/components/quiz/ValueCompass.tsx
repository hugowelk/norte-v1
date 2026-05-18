import { motion } from 'framer-motion';
import { VALUES, getValueByKey, type ValueKey } from '@/lib/values';
import { findAspirationalGaps, type ScoreResult } from '@/lib/algorithm';
import { ValueIcon } from '../ValueIcon';
import type { SelectableValue } from './CoreValuesSelection';
import type { AlignmentScores } from './AlignmentReflection';

interface Props {
  result: ScoreResult;
  slots: SelectableValue[];
  alignmentScores: AlignmentScores;
  onContinue: () => void;
}

export function ValueCompass({ result, slots, alignmentScores, onContinue }: Props) {
  const aspirationalKeys = slots.map(s => s.key);
  const gaps = findAspirationalGaps(aspirationalKeys, result);
  const fullOverlap = gaps.length === 0 && aspirationalKeys.length > 0;

  // felt(0–10) → 0–100 for display
  const felt: Record<ValueKey, number> = {
    achievement: 0, connection: 0, aliveness: 0, enjoyment: 0,
    meaning: 0, contribution: 0, stability: 0, autonomy: 0,
  };
  for (const v of VALUES) {
    felt[v.key] = (alignmentScores[`core:${v.key}`] ?? 0) * 10;
  }

  // Sort: aspirational picks first (in their pick order), then the rest by current desc.
  const aspirationalSet = new Set(aspirationalKeys);
  const rest = VALUES.map(v => v.key)
    .filter(k => !aspirationalSet.has(k))
    .sort((a, b) => result.normalized[b] - result.normalized[a]);
  const ordered = [...aspirationalKeys, ...rest];

  return (
    <div className="space-y-10 pb-16">
      <div className="space-y-3 text-center">
        <p className="text-xs font-display uppercase tracking-widest text-accent">The Gap</p>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground leading-tight">
          Here's where revealed and aspirational meet.
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto font-body">
          For each value, the top bar is how often it showed up in your trade-offs. The bottom bar is how present it actually feels in your life.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 md:p-6 space-y-3">
        <div className="flex items-center gap-5 text-xs font-display text-muted-foreground pb-2 border-b border-border/60">
          <span className="inline-flex items-center gap-2"><span className="w-3 h-1.5 rounded-sm bg-accent" /> Revealed</span>
          <span className="inline-flex items-center gap-2"><span className="w-3 h-1.5 rounded-sm bg-primary" /> Felt</span>
        </div>
        <div className="space-y-5">
          {ordered.map((key, i) => {
            const isAspirational = aspirationalSet.has(key);
            return (
              <StackedRow
                key={key}
                valueKey={key}
                current={result.normalized[key]}
                felt={felt[key]}
                emphasised={isAspirational}
                delayIdx={i}
              />
            );
          })}
        </div>
      </div>

      <div className="space-y-4 text-foreground/90 leading-relaxed font-body">
        {fullOverlap ? (
          <>
            <p>
              The values you want at the centre and the ones you've been living are the same.
            </p>
            <p className="text-muted-foreground">
              That's not nothing. It means the story you tell yourself about your life matches what your week actually does. The work, if there is any, is in how present each one feels.
            </p>
          </>
        ) : (
          <>
            <p>
              {gaps.length} of the 3 values you want at the centre haven't been at the centre of your choices.
            </p>
            <p>
              {gaps[0] && (
                <><strong className="text-foreground">{getValueByKey(gaps[0].value).label}</strong> came up <strong>{ordinal(gaps[0].rank)}</strong>. </>
              )}
              {gaps[1] && (
                <><strong className="text-foreground">{getValueByKey(gaps[1].value).label}</strong> came up <strong>{ordinal(gaps[1].rank)}</strong>.</>
              )}
            </p>
            <p className="text-muted-foreground">
              That's not a verdict. It's the gap between the life you've been living and the one you've been reaching for.
            </p>
            <p className="text-foreground">
              The question isn't whether the gap is wrong. It's whether you want to close it.
            </p>
          </>
        )}
      </div>

      <button
        onClick={onContinue}
        className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-display font-medium text-base hover:opacity-90 transition-opacity shadow-md"
      >
        Show me how →
      </button>
    </div>
  );
}

function StackedRow({
  valueKey, current, felt, emphasised, delayIdx,
}: {
  valueKey: ValueKey;
  current: number;
  felt: number;
  emphasised: boolean;
  delayIdx: number;
}) {
  const gap = Math.abs(current - felt);
  return (
    <div className={`space-y-1.5 ${emphasised ? '' : 'opacity-70'}`}>
      <div className="flex items-baseline justify-between">
        <div className="flex items-center gap-2">
          <ValueIcon value={valueKey} size={14} className={emphasised ? 'text-primary' : undefined} />
          <span className={`font-display text-sm ${emphasised ? 'text-foreground font-medium' : 'text-foreground/80'}`}>
            {getValueByKey(valueKey).label}
          </span>
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">gap {Math.round(gap)}</span>
      </div>
      <div className="space-y-1">
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(0, Math.min(100, current))}%` }}
            transition={{ duration: 0.7, delay: 0.05 * delayIdx, ease: 'easeOut' }}
          />
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(0, Math.min(100, felt))}%` }}
            transition={{ duration: 0.7, delay: 0.05 * delayIdx + 0.15, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}

function ordinal(n: number): string {
  const map = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'];
  return map[n] ?? `${n}th`;
}
