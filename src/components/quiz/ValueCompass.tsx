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

  const aspirationalSet = new Set(aspirationalKeys);
  const rest = VALUES.map(v => v.key)
    .filter(k => !aspirationalSet.has(k))
    .sort((a, b) => result.normalized[b] - result.normalized[a]);

  // Stats
  const topAspirational = aspirationalKeys[0];
  const topAspirationalRank = topAspirational ? result.ranking.indexOf(topAspirational) + 1 : 0;
  const missingCount = gaps.length;

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

      <div className="bg-card border border-border rounded-2xl p-5 md:p-6 space-y-5">
        <div className="flex items-center gap-5 text-xs font-display text-muted-foreground pb-3 border-b border-border/60">
          <span className="inline-flex items-center gap-2"><span className="w-3 h-1.5 rounded-sm bg-accent" /> Revealed</span>
          <span className="inline-flex items-center gap-2"><span className="w-3 h-1.5 rounded-sm bg-primary" /> Felt</span>
        </div>

        {/* Top 3 chosen */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-display uppercase tracking-widest text-accent/80">Your chosen 3</p>
        </div>
        <div className="space-y-5">
          {aspirationalKeys.map((key, i) => (
            <StackedRow
              key={key}
              valueKey={key}
              current={result.normalized[key]}
              felt={felt[key]}
              emphasised
              delayIdx={i}
            />
          ))}
        </div>

        {/* Divider + rest */}
        <div className="pt-2 border-t border-dashed border-border/60 space-y-1.5">
          <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">The rest</p>
        </div>
        <div className="space-y-4">
          {rest.map((key, i) => (
            <StackedRow
              key={key}
              valueKey={key}
              current={result.normalized[key]}
              felt={felt[key]}
              emphasised={false}
              delayIdx={aspirationalKeys.length + i}
              compact
            />
          ))}
        </div>
      </div>

      {/* Visual summary */}
      {!fullOverlap && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
            <div className="font-display text-5xl font-semibold text-accent leading-none tabular-nums">
              {missingCount}
              <span className="text-xl text-muted-foreground">/3</span>
            </div>
            <p className="text-sm text-foreground/85 font-body leading-snug">
              of the values you want at the centre are <strong className="text-foreground">not</strong> showing up in your revealed top 3.
            </p>
          </div>

          {topAspirational && (
            <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
              <div className="shrink-0 w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
                <ValueIcon value={topAspirational} size={26} className="text-primary" />
              </div>
              <p className="text-sm text-foreground/85 font-body leading-snug">
                <strong className="text-foreground">{getValueByKey(topAspirational).label}</strong> is your top chosen value, but your trade-offs place it{' '}
                <strong className="text-foreground">{ordinal(topAspirationalRank)}</strong>.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="rounded-2xl border-l-2 border-accent bg-card/60 p-5 space-y-3 font-body">
        {fullOverlap ? (
          <>
            <p className="text-foreground/90 leading-relaxed">
              The values you want at the centre and the ones you've been living are the same.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              That's not nothing. It means the story you tell yourself about your life matches what your week actually does. The work, if there is any, is in how present each one feels.
            </p>
          </>
        ) : (
          <>
            <p className="text-xs font-display uppercase tracking-widest text-accent">A note</p>
            <p className="text-foreground/90 leading-relaxed">
              That's not a verdict. It's the gap between the life you've been living and the one you've been reaching for.
            </p>
            <p className="text-foreground leading-relaxed">
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
  valueKey, current, felt, emphasised, delayIdx, compact = false,
}: {
  valueKey: ValueKey;
  current: number;
  felt: number;
  emphasised: boolean;
  delayIdx: number;
  compact?: boolean;
}) {
  return (
    <div className={`space-y-1.5 ${emphasised ? '' : 'opacity-60'}`}>
      <div className="flex items-center gap-2">
        <ValueIcon value={valueKey} size={compact ? 12 : 14} className={emphasised ? 'text-primary' : undefined} />
        <span className={`font-display ${compact ? 'text-xs' : 'text-sm'} ${emphasised ? 'text-foreground font-medium' : 'text-foreground/80'}`}>
          {getValueByKey(valueKey).label}
        </span>
      </div>
      <div className="space-y-1">
        <div className={`${compact ? 'h-1.5' : 'h-2'} rounded-full bg-secondary overflow-hidden`}>
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(0, Math.min(100, current))}%` }}
            transition={{ duration: 0.7, delay: 0.05 * delayIdx, ease: 'easeOut' }}
          />
        </div>
        <div className={`${compact ? 'h-1.5' : 'h-2'} rounded-full bg-secondary overflow-hidden`}>
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
  const map = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
  return map[n] ?? `${n}th`;
}
