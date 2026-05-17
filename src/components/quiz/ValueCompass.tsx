import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VALUES, getValueByKey, type ValueKey } from '@/lib/values';
import { findAspirationalGaps, type ScoreResult } from '@/lib/algorithm';
import type { SelectableValue } from './CoreValuesSelection';
import type { AlignmentScores } from './AlignmentReflection';

interface Props {
  result: ScoreResult;
  slots: SelectableValue[];
  alignmentScores: AlignmentScores;
  onContinue: () => void;
}

type Beat = 1 | 2 | 3;

export function ValueCompass({ result, slots, alignmentScores, onContinue }: Props) {
  const [beat, setBeat] = useState<Beat>(1);

  const revealed = [result.revealed.primary, result.revealed.secondary, result.revealed.tertiary];
  const revealedLabels = revealed.map(k => getValueByKey(k).label);

  const aspirationalCoreKeys = slots.map(s => s.key);
  const aspirationalTop3 = aspirationalCoreKeys.slice(0, 3);
  const aspirationalLabels = aspirationalTop3.map(k => getValueByKey(k).label);

  const gaps = findAspirationalGaps(aspirationalCoreKeys, result);
  const total = aspirationalCoreKeys.length;
  const fullOverlap = gaps.length === 0 && aspirationalCoreKeys.length > 0;

  // Per-value aspiring score (0-100) from sliders (all 8 values, since Alignment now scores all)
  const aspiring: Record<ValueKey, number> = {
    achievement: 0, connection: 0, aliveness: 0, enjoyment: 0,
    meaning: 0, contribution: 0, stability: 0, autonomy: 0,
  };
  for (const v of VALUES) {
    aspiring[v.key] = (alignmentScores[`core:${v.key}`] ?? 0) * 10;
  }

  return (
    <div className="space-y-10 pb-16 min-h-[70vh]">
      <div className="space-y-2 text-center">
        <p className="text-xs font-display uppercase tracking-widest text-accent">
          Your Compass · {beat} / 3
        </p>
      </div>

      <AnimatePresence mode="wait">
        {beat === 1 && (
          <motion.section
            key="beat1"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 text-foreground/90 leading-relaxed"
          >
            <p className="text-xl font-display text-foreground">Here's what came up.</p>
            <p>
              Across the choices you just made, three values showed up more often than the others:
            </p>
            <p className="text-2xl md:text-3xl font-display font-semibold text-foreground">
              {revealedLabels[0]}. {revealedLabels[1]}. {revealedLabels[2]}.
            </p>
            <p>
              These have been quietly shaping your decisions. The energy you spend, the time you give, the things you protect. You may already feel this on some level.
            </p>

            <button
              onClick={() => setBeat(2)}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-display font-medium text-base hover:opacity-90 transition-opacity shadow-md mt-4"
            >
              Continue →
            </button>
          </motion.section>
        )}

        {beat === 2 && (
          <motion.section
            key="beat2"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 text-foreground/90 leading-relaxed"
          >
            <p className="text-xl font-display text-foreground">Now. What you said you want to prioritise:</p>
            <p className="text-2xl md:text-3xl font-display font-semibold text-foreground">
              {aspirationalLabels.join('. ')}.
            </p>
            <p>That's a different shape.</p>

            <button
              onClick={() => setBeat(3)}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-display font-medium text-base hover:opacity-90 transition-opacity shadow-md mt-4"
            >
              Continue →
            </button>
          </motion.section>
        )}

        {beat === 3 && (
          <motion.section
            key="beat3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <GapBars
              values={VALUES.map(v => ({
                key: v.key,
                label: v.label,
                current: result.normalized[v.key],
                aspiring: aspiring[v.key],
              }))}
            />

            <div className="space-y-4 text-foreground/90 leading-relaxed pt-2">
              {fullOverlap ? (
                <>
                  <p>
                    The values you want at the centre and the ones you've been living are the same.
                  </p>
                  <p className="text-muted-foreground">
                    That's not nothing. It means the story you tell yourself about your life matches what your week actually does. The work, if there is any, is in the second tier. The values that are present but quieter than you'd like.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    {gaps.length} of the {total} values you want at the centre of your life haven't been at the centre of your choices.
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
                    That's not a verdict. It's the gap between the life you've been living and the one you've been reaching for. Most people find one. Some find it's been there for years.
                  </p>
                  <p className="text-foreground">
                    The question isn't whether the gap is wrong. It's whether you want to close it.
                  </p>
                </>
              )}
            </div>

            <button
              onClick={onContinue}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-display font-medium text-base hover:opacity-90 transition-opacity shadow-md mt-4"
            >
              Show me how →
            </button>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

function GapBars({ values }: { values: { key: ValueKey; label: string; current: number; aspiring: number }[] }) {
  // Sort by gap size descending so the most striking gap is on top
  const sorted = [...values].sort((a, b) => Math.abs(b.aspiring - a.current) - Math.abs(a.aspiring - a.current));
  return (
    <div className="bg-card border border-border rounded-2xl p-5 md:p-6 space-y-4">
      <div className="flex items-center gap-5 text-xs font-display text-muted-foreground">
        <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-accent/70" /> Current</span>
        <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-primary/70" /> Aspiring</span>
      </div>
      <div className="space-y-3">
        {sorted.map(v => {
          const cur = Math.max(0, Math.min(100, v.current));
          const asp = Math.max(0, Math.min(100, v.aspiring));
          const lo = Math.min(cur, asp);
          const hi = Math.max(cur, asp);
          return (
            <div key={v.key} className="space-y-1.5">
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-display text-foreground">{v.label}</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  gap {Math.round(hi - lo)}
                </span>
              </div>
              <div className="relative h-2.5 rounded-full bg-secondary overflow-hidden">
                {/* gap band */}
                <div
                  className="absolute top-0 bottom-0 bg-foreground/10"
                  style={{ left: `${lo}%`, width: `${hi - lo}%` }}
                />
                {/* current marker */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent ring-2 ring-card"
                  style={{ left: `calc(${cur}% - 6px)` }}
                />
                {/* aspiring marker */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary ring-2 ring-card"
                  style={{ left: `calc(${asp}% - 6px)` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ordinal(n: number): string {
  const map = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'];
  return map[n] ?? `${n}th`;
}
