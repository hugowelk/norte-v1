import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { ValueIcon } from '../ValueIcon';
import { getValueByKey, type ValueKey } from '@/lib/values';
import { type ScoreResult } from '@/lib/algorithm';
import type { SelectableValue } from './CoreValuesSelection';

export type AlignmentScores = Record<string, number>;

interface Props {
  slots: SelectableValue[];
  result: ScoreResult;
  onComplete: (scores: AlignmentScores) => void;
}

function slotKey(s: SelectableValue): string {
  return s.kind === 'core' ? `core:${s.key}` : `custom:${s.custom.key}`;
}

function slotLabel(s: SelectableValue): string {
  return s.kind === 'core' ? getValueByKey(s.key).label : s.custom.label;
}

function suggested(s: SelectableValue, result: ScoreResult): number {
  if (s.kind === 'custom') return 5;
  return Math.round(result.normalized[s.key as ValueKey] / 10);
}

export function AlignmentReflection({ slots, result, onComplete }: Props) {
  const [scores, setScores] = useState<AlignmentScores>(() => {
    const init: AlignmentScores = {};
    slots.forEach(s => { init[slotKey(s)] = suggested(s, result); });
    return init;
  });

  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-3 text-center">
        <p className="text-xs font-display uppercase tracking-widest text-accent">Alignment Check</p>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground leading-tight">
          How much is your life reflecting each one?
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          We've placed each slider based on your behaviour so far. Adjust to where it actually feels.
        </p>
      </div>

      <div className="space-y-4">
        {slots.map(s => {
          const key = slotKey(s);
          const score = scores[key];
          const sug = suggested(s, result);
          return (
            <div key={key} className="space-y-3 p-5 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3">
                {s.kind === 'core'
                  ? <ValueIcon value={s.key} size={20} />
                  : <span className="w-5 h-5 rounded-full bg-accent/20 border border-accent/30 shrink-0" />}
                <p className="font-display font-medium text-foreground">{slotLabel(s)}</p>
                <span className="ml-auto font-display text-lg font-semibold text-accent tabular-nums">{score}/10</span>
              </div>
              <Slider
                value={[score]}
                onValueChange={([v]) => setScores(prev => ({ ...prev, [key]: v }))}
                min={0}
                max={10}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Not reflected</span>
                <span>Suggested from behaviour: {sug}</span>
                <span>Strongly reflected</span>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => onComplete(scores)}
        className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-display font-medium hover:opacity-90 transition-opacity"
      >
        See your value compass
      </button>
    </div>
  );
}
