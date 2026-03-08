import { useState } from 'react';
import { getValueByKey, type ValueKey } from '@/lib/values';

interface Props {
  rankedValues: ValueKey[];
  onComplete: (scores: Record<ValueKey, number>) => void;
}

export function AlignmentReflection({ rankedValues, onComplete }: Props) {
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    rankedValues.forEach(k => { init[k] = 5; });
    return init;
  });

  const handleChange = (key: ValueKey, val: number) => {
    setScores(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <p className="text-xs font-display uppercase tracking-widest text-accent">Alignment Check</p>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground">
          How aligned is your life?
        </h2>
        <p className="text-sm text-muted-foreground">
          For each value, rate how well your current life reflects it.
        </p>
      </div>

      <div className="space-y-6">
        {rankedValues.map(key => {
          const value = getValueByKey(key);
          const score = scores[key];
          return (
            <div key={key} className="space-y-3 p-5 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-3">
                <span className="text-xl">{value.emoji}</span>
                <p className="font-display font-medium text-foreground">{value.label}</p>
                <span className="ml-auto font-display text-lg font-bold text-accent">{score}/10</span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                value={score}
                onChange={e => handleChange(key, parseInt(e.target.value))}
                className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Not reflected</span>
                <span>Strongly reflected</span>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => onComplete(scores as Record<ValueKey, number>)}
        className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-display font-medium hover:opacity-90 transition-opacity"
      >
        Continue to Action Planning
      </button>
    </div>
  );
}
