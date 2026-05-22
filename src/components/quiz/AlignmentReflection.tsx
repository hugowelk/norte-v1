import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { ValueIcon } from '../ValueIcon';
import { VALUES, getValueByKey, type ValueKey } from '@/lib/values';
import { type ScoreResult } from '@/lib/algorithm';
import type { SelectableValue } from './CoreValuesSelection';

export type AlignmentScores = Record<string, number>;

interface Props {
  slots: SelectableValue[];
  result: ScoreResult;
  onComplete: (scores: AlignmentScores) => void;
}

function suggestedFor(key: ValueKey, result: ScoreResult): number {
  return Math.round(result.normalized[key] / 10);
}

export function AlignmentReflection({ slots, result, onComplete }: Props) {
  const pickedKeys = slots.map(s => s.key);

  const [scores, setScores] = useState<AlignmentScores>(() => {
    const init: AlignmentScores = {};
    for (const v of VALUES) init[`core:${v.key}`] = 0;
    return init;
  });

  const updateScore = (key: ValueKey, v: number) =>
    setScores(prev => ({ ...prev, [`core:${key}`]: v }));

  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-3 text-center">
        <p className="text-xs font-display uppercase tracking-widest text-accent">A quick check</p>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground leading-tight">
          How present are these values in your life right now?
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Move each slider to where it actually feels. The dotted mark shows where your trade-offs placed you.
        </p>
      </div>

      <div className="space-y-4">
        {pickedKeys.map(k => (
          <SliderRow
            key={k}
            valueKey={k}
            score={scores[`core:${k}`]}
            suggested={suggestedFor(k, result)}
            onChange={v => updateScore(k, v)}
          />
        ))}
      </div>

      <button
        onClick={() => onComplete(scores)}
        className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-display font-medium hover:opacity-90 transition-opacity"
      >
        See your compass →
      </button>
    </div>
  );
}

function SliderRow({
  valueKey, score, suggested, onChange,
}: { valueKey: ValueKey; score: number; suggested: number; onChange: (v: number) => void }) {
  const suggestedPct = (suggested / 10) * 100;
  return (
    <div className="space-y-3 p-5 rounded-xl bg-card border border-border">
      <div className="flex items-center gap-3">
        <ValueIcon value={valueKey} size={20} />
        <p className="font-display font-medium text-foreground">{getValueByKey(valueKey).label}</p>
        <span className="ml-auto font-display text-lg font-semibold text-accent tabular-nums">{score}/10</span>
      </div>
      <div className="relative py-2">
        <Slider
          value={[score]}
          onValueChange={([v]) => onChange(v)}
          min={0}
          max={10}
          step={1}
        />
        <div
          className="pointer-events-none absolute top-0 bottom-0 border-l-2 border-dotted border-accent"
          style={{ left: `${suggestedPct}%` }}
          aria-hidden
        />
      </div>
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span className="font-medium">Barely here</span>
        <span className="italic">Your trade-offs: {suggested}</span>
        <span className="font-medium">Lived every day</span>
      </div>
    </div>
  );
}
