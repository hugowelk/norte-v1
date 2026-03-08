import { useState } from 'react';
import { getValueByKey, VALUES, type ValueKey } from '@/lib/values';

type Bucket = 'core' | 'important' | 'nice';

interface Props {
  inferredValues: ValueKey[];
  onComplete: (coreValues: ValueKey[]) => void;
}

export function ValueSorting({ inferredValues, onComplete }: Props) {
  // Show all values, not just inferred — user might want to pick others
  const allValues = VALUES.map(v => v.key);
  const [buckets, setBuckets] = useState<Record<ValueKey, Bucket | null>>(() => {
    const init: Record<string, Bucket | null> = {};
    allValues.forEach(k => { init[k] = null; });
    return init as Record<ValueKey, Bucket | null>;
  });

  const assignToBucket = (key: ValueKey, bucket: Bucket) => {
    setBuckets(prev => {
      const coreCount = Object.values({ ...prev, [key]: bucket }).filter(b => b === 'core').length;
      if (bucket === 'core' && prev[key] !== 'core' && coreCount > 5) return prev;
      return { ...prev, [key]: bucket };
    });
  };

  const coreValues = Object.entries(buckets).filter(([, b]) => b === 'core').map(([k]) => k as ValueKey);
  const allSorted = Object.values(buckets).every(b => b !== null);

  // Show inferred first, then rest
  const sortedKeys = [...inferredValues, ...allValues.filter(k => !inferredValues.includes(k))];
  const unsorted = sortedKeys.filter(k => buckets[k] === null);
  const coreList = sortedKeys.filter(k => buckets[k] === 'core');
  const importantList = sortedKeys.filter(k => buckets[k] === 'important');
  const niceList = sortedKeys.filter(k => buckets[k] === 'nice');

  const canContinue = coreValues.length >= 1 && coreValues.length <= 5;

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <p className="text-xs font-display uppercase tracking-widest text-accent">Value Sorting</p>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground">
          Sort your values
        </h2>
        <p className="text-sm text-muted-foreground">
          Tap to assign each value. Max 5 core values.
        </p>
      </div>

      {unsorted.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-display uppercase tracking-wider text-muted-foreground">Unsorted</p>
          <div className="flex flex-wrap gap-2">
            {unsorted.map(key => {
              const v = getValueByKey(key);
              return (
                <ValueChip
                  key={key}
                  label={`${v.emoji} ${v.label}`}
                  variant="unsorted"
                  onCore={() => assignToBucket(key, 'core')}
                  onImportant={() => assignToBucket(key, 'important')}
                  onNice={() => assignToBucket(key, 'nice')}
                />
              );
            })}
          </div>
        </div>
      )}

      <BucketSection title={`Core Values (${coreList.length}/5)`} keys={coreList} variant="core" onRemove={(k) => assignToBucket(k, null as any)} setBuckets={setBuckets} />
      <BucketSection title="Important" keys={importantList} variant="important" onRemove={(k) => assignToBucket(k, null as any)} setBuckets={setBuckets} />
      <BucketSection title="Nice to Have" keys={niceList} variant="nice" onRemove={(k) => assignToBucket(k, null as any)} setBuckets={setBuckets} />

      <button
        onClick={() => canContinue && onComplete(coreValues)}
        disabled={!canContinue}
        className={`w-full py-4 rounded-lg font-display font-medium transition-all ${
          canContinue ? 'bg-primary text-primary-foreground hover:opacity-90' : 'bg-muted text-muted-foreground cursor-not-allowed'
        }`}
      >
        {coreValues.length === 0 ? 'Select at least 1 core value' : `Continue with ${coreValues.length} core values`}
      </button>
    </div>
  );
}

function BucketSection({ title, keys, variant, onRemove }: {
  title: string;
  keys: ValueKey[];
  variant: string;
  onRemove: (k: ValueKey) => void;
  setBuckets: any;
}) {
  if (keys.length === 0) return null;
  const colors: Record<string, string> = {
    core: 'bg-primary/10 border-primary/30',
    important: 'bg-accent/10 border-accent/30',
    nice: 'bg-muted border-border',
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-display uppercase tracking-wider text-muted-foreground">{title}</p>
      <div className={`p-3 rounded-lg border ${colors[variant]} min-h-[48px] flex flex-wrap gap-2`}>
        {keys.map(key => {
          const v = getValueByKey(key);
          return (
            <button
              key={key}
              onClick={() => onRemove(key)}
              className="px-3 py-1.5 rounded-md bg-card border border-border text-sm font-body hover:bg-secondary transition-colors"
            >
              {v.emoji} {v.label} ×
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ValueChip({ label, onCore, onImportant, onNice }: {
  label: string;
  variant: string;
  onCore: () => void;
  onImportant: () => void;
  onNice: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-1.5 rounded-md bg-card border border-border text-sm font-body hover:border-primary/40 transition-colors"
      >
        {label}
      </button>
      {open && (
        <div className="absolute z-10 top-full mt-1 left-0 bg-card border border-border rounded-lg shadow-lg p-1 min-w-[140px]">
          <button onClick={() => { onCore(); setOpen(false); }} className="block w-full text-left px-3 py-1.5 text-sm hover:bg-primary/10 rounded-md transition-colors">
            ⭐ Core
          </button>
          <button onClick={() => { onImportant(); setOpen(false); }} className="block w-full text-left px-3 py-1.5 text-sm hover:bg-accent/10 rounded-md transition-colors">
            💡 Important
          </button>
          <button onClick={() => { onNice(); setOpen(false); }} className="block w-full text-left px-3 py-1.5 text-sm hover:bg-muted rounded-md transition-colors">
            ✨ Nice to have
          </button>
        </div>
      )}
    </div>
  );
}
