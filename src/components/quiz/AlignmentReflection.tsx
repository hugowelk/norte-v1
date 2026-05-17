import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { ValueIcon } from '../ValueIcon';
import { VALUES, getValueByKey, type ValueKey } from '@/lib/values';
import { type ScoreResult } from '@/lib/algorithm';
import type { SelectableValue } from './CoreValuesSelection';
import { cn } from '@/lib/utils';

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
  const otherKeys = VALUES.map(v => v.key).filter(k => !pickedKeys.includes(k));

  const [scores, setScores] = useState<AlignmentScores>(() => {
    const init: AlignmentScores = {};
    for (const v of VALUES) init[`core:${v.key}`] = suggestedFor(v.key, result);
    return init;
  });
  const [otherOpen, setOtherOpen] = useState(false);

  const updateScore = (key: ValueKey, v: number) =>
    setScores(prev => ({ ...prev, [`core:${key}`]: v }));

  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-3 text-center">
        <p className="text-xs font-display uppercase tracking-widest text-accent">A quick check</p>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground leading-tight">
          How present is each of these in your life right now?
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          The sliders start where your trade-offs suggest. Move them to where it actually feels.
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-display uppercase tracking-widest text-muted-foreground px-1">
          The 3 you picked
        </p>
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

      {otherKeys.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => setOtherOpen(o => !o)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-border bg-card/60 hover:bg-card transition-colors text-left"
          >
            <span className="text-sm font-body text-foreground/80 italic">
              You didn't pick these — but they came up in your trade-offs. Tap to see where they sit.
            </span>
            <ChevronDown size={16} className={cn('text-muted-foreground transition-transform shrink-0', otherOpen && 'rotate-180')} />
          </button>
          {otherOpen && (
            <div className="space-y-4 pt-1">
              <p className="text-xs font-display uppercase tracking-widest text-muted-foreground px-1">
                The 3 you didn't pick
              </p>
              {otherKeys.map(k => (
                <SliderRow
                  key={k}
                  valueKey={k}
                  score={scores[`core:${k}`]}
                  suggested={suggestedFor(k, result)}
                  onChange={v => updateScore(k, v)}
                />
              ))}
            </div>
          )}
        </div>
      )}

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
  return (
    <div className="space-y-3 p-5 rounded-xl bg-card border border-border">
      <div className="flex items-center gap-3">
        <ValueIcon value={valueKey} size={20} />
        <p className="font-display font-medium text-foreground">{getValueByKey(valueKey).label}</p>
        <span className="ml-auto font-display text-lg font-semibold text-accent tabular-nums">{score}/10</span>
      </div>
      <Slider
        value={[score]}
        onValueChange={([v]) => onChange(v)}
        min={0}
        max={10}
        step={1}
      />
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span className="font-medium">Barely here</span>
        <span className="italic">Norte suggests: {suggested}</span>
        <span className="font-medium">Lived every day</span>
      </div>
    </div>
  );
}
