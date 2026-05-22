import { ArrowRight, Target } from 'lucide-react';
import { VALUES, type ValueKey } from '@/lib/values';

interface Props {
  revealed: ValueKey[];
  aspirational: ValueKey[];
}

function getValue(key: ValueKey) {
  return VALUES.find(v => v.key === key);
}

export function GapVisualization({ revealed, aspirational }: Props) {
  const revealedSet = new Set(revealed);
  const aspirationalSet = new Set(aspirational);

  const gaps = aspirational.filter(v => !revealedSet.has(v));
  const aligned = aspirational.filter(v => revealedSet.has(v));

  return (
    <section className="no-print mb-12 md:mb-16">
      <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5">
        Revealed vs Aspirational
      </p>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Revealed column */}
        <div className="rounded-lg border border-border bg-card/40 p-5">
          <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-4">
            How you're living
          </p>
          <ul className="space-y-2.5">
            {revealed.map((k, i) => {
              const v = getValue(k);
              if (!v) return null;
              const Icon = v.icon;
              const inAsp = aspirationalSet.has(k);
              return (
                <li key={k} className="flex items-center gap-3">
                  <span className="font-sans text-xs text-muted-foreground w-4">{i + 1}</span>
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full ${inAsp ? 'bg-accent/20 text-accent' : 'bg-muted text-muted-foreground'}`}>
                    <Icon size={16} />
                  </span>
                  <span className="font-display text-[18px] text-primary leading-none">
                    {v.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Aspirational column */}
        <div className="rounded-lg border border-accent/40 bg-accent/5 p-5">
          <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-accent mb-4">
            How you want to live
          </p>
          <ul className="space-y-2.5">
            {aspirational.map((k, i) => {
              const v = getValue(k);
              if (!v) return null;
              const Icon = v.icon;
              const matched = revealedSet.has(k);
              return (
                <li key={k} className="flex items-center gap-3">
                  <span className="font-sans text-xs text-muted-foreground w-4">{i + 1}</span>
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full ${matched ? 'bg-accent/20 text-accent' : 'bg-primary/10 text-primary'}`}>
                    <Icon size={16} />
                  </span>
                  <span className="font-display text-[18px] text-primary leading-none">
                    {v.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Gaps */}
      {gaps.length > 0 && (
        <div className="rounded-lg border border-dashed border-accent/60 bg-background p-5">
          <div className="flex items-center gap-2 mb-3">
            <Target size={16} className="text-accent" />
            <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-accent">
              The gaps to close
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {gaps.map(k => {
              const v = getValue(k);
              if (!v) return null;
              const Icon = v.icon;
              return (
                <div key={k} className="flex items-center gap-2 rounded-full bg-card border border-border pl-2 pr-4 py-1.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/15 text-accent">
                    <Icon size={12} />
                  </span>
                  <span className="font-display text-[15px] text-primary leading-none">
                    {v.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {aligned.length === aspirational.length && (
        <p className="font-sans text-sm text-muted-foreground italic">
          Your revealed and aspirational values are aligned.
        </p>
      )}

      <hr className="mt-12 md:mt-14 border-0 border-t border-border/60" />
    </section>
  );
}
