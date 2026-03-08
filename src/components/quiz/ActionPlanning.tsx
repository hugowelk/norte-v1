import { useState } from 'react';
import { getValueByKey, type ValueKey } from '@/lib/values';

interface Props {
  rankedValues: ValueKey[];
  onComplete: (actions: { value: ValueKey; action: string; when: string }[]) => void;
}

export function ActionPlanning({ rankedValues, onComplete }: Props) {
  const [actions, setActions] = useState<Record<string, { action: string; when: string; committed: boolean }>>(() => {
    const init: Record<string, { action: string; when: string; committed: boolean }> = {};
    rankedValues.forEach(k => { init[k] = { action: '', when: '', committed: false }; });
    return init;
  });

  const updateAction = (key: string, field: 'action' | 'when', val: string) => {
    setActions(prev => ({ ...prev, [key]: { ...prev[key], [field]: val } }));
  };

  const toggleCommit = (key: string) => {
    setActions(prev => ({ ...prev, [key]: { ...prev[key], committed: !prev[key].committed } }));
  };

  const committed = Object.entries(actions).filter(([, a]) => a.committed && a.action.trim());
  const canContinue = committed.length >= 1 && committed.length <= 3;

  const handleComplete = () => {
    const result = committed.map(([key, a]) => ({
      value: key as ValueKey,
      action: a.action,
      when: a.when,
    }));
    onComplete(result);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <p className="text-xs font-display uppercase tracking-widest text-accent">Action Planning</p>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground">
          Turn values into action
        </h2>
        <p className="text-sm text-muted-foreground">
          Define small, specific actions for the next 1–2 weeks. Commit to 1–3 only.
        </p>
      </div>

      <div className="space-y-4">
        {rankedValues.map(key => {
          const value = getValueByKey(key);
          const a = actions[key];
          return (
            <div key={key} className={`p-5 rounded-lg border-2 transition-all ${
              a.committed ? 'border-primary bg-primary/5' : 'border-border bg-card'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">{value.emoji}</span>
                <p className="font-display font-medium text-foreground">{value.label}</p>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="What's one small action you'll take?"
                  value={a.action}
                  onChange={e => updateAction(key, 'action', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  type="text"
                  placeholder="When will you do this? (e.g., Thursday evening)"
                  value={a.when}
                  onChange={e => updateAction(key, 'when', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {a.action.trim() && (
                  <button
                    onClick={() => toggleCommit(key)}
                    className={`text-sm font-display font-medium px-4 py-2 rounded-lg transition-all ${
                      a.committed
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-primary/10'
                    }`}
                  >
                    {a.committed ? '✓ Committed' : 'Commit to this'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-center text-muted-foreground">
        {committed.length}/3 actions committed
      </p>

      <button
        onClick={handleComplete}
        disabled={!canContinue}
        className={`w-full py-4 rounded-lg font-display font-medium transition-all ${
          canContinue ? 'bg-primary text-primary-foreground hover:opacity-90' : 'bg-muted text-muted-foreground cursor-not-allowed'
        }`}
      >
        See My Insights
      </button>
    </div>
  );
}
