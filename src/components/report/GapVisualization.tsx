import { useTranslation } from 'react-i18next';
import { VALUES, type ValueKey } from '@/lib/values';
import { tValueLabel } from '@/lib/i18nHelpers';

interface Props {
  revealedFull: ValueKey[];
  aspirational: ValueKey[];
}

function getValue(key: ValueKey) {
  return VALUES.find(v => v.key === key);
}

const ROW_H = 56;
const SVG_W = 120;

export function GapVisualization({ revealedFull, aspirational }: Props) {
  const { t } = useTranslation();
  const leftKeys: ValueKey[] = (() => {
    const seen = new Set(revealedFull);
    const fill = VALUES.map(v => v.key).filter(k => !seen.has(k));
    return [...revealedFull, ...fill].slice(0, 8) as ValueKey[];
  })();

  const rightKeys = aspirational.slice(0, 3);
  const leftHeight = leftKeys.length * ROW_H;
  const rightHeight = rightKeys.length * ROW_H;
  const svgHeight = Math.max(leftHeight, rightHeight);
  const rightOffset = Math.max(0, (leftHeight - rightHeight) / 2);
  const chosenSet = new Set(rightKeys);

  return (
    <section className="mb-12 md:mb-16">
      <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5">
        {t('report.gap.eyebrow')}
      </p>

      <div className="rounded-2xl border border-border bg-card/40 p-5 md:p-7">
        <div className="flex items-start justify-between gap-2 mb-4">
          <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground flex-1">
            {t('report.gap.leftHeading')}
            <span className="block text-[10px] tracking-[0.14em] mt-1 text-muted-foreground/70">{t('report.gap.leftSub')}</span>
          </p>
          <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-accent flex-1 text-right">
            {t('report.gap.rightHeading')}
            <span className="block text-[10px] tracking-[0.14em] mt-1 text-accent/70">{t('report.gap.rightSub')}</span>
          </p>
        </div>

        <div className="relative grid items-start gap-0" style={{ gridTemplateColumns: `1fr ${SVG_W}px 1fr` }}>
          <ul className="space-y-0">
            {leftKeys.map((k, i) => {
              const v = getValue(k);
              if (!v) return null;
              const Icon = v.icon;
              const isChosen = chosenSet.has(k);
              return (
                <li key={k} className="flex items-center gap-3" style={{ height: ROW_H }}>
                  <span className="font-sans text-xs text-muted-foreground tabular-nums w-4 text-right">{i + 1}</span>
                  <span className={`flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0 ${isChosen ? 'bg-accent/20 text-accent ring-1 ring-accent/40' : 'bg-muted text-muted-foreground/70'}`}>
                    <Icon size={16} />
                  </span>
                  <span className={`font-display text-[17px] md:text-[18px] leading-none ${isChosen ? 'text-primary' : 'text-muted-foreground'}`}>
                    {tValueLabel(t, k)}
                  </span>
                </li>
              );
            })}
          </ul>

          <svg width={SVG_W} height={svgHeight} viewBox={`0 0 ${SVG_W} ${svgHeight}`} className="overflow-visible" aria-hidden="true">
            {rightKeys.map((k) => {
              const lIdx = leftKeys.indexOf(k);
              if (lIdx < 0) return null;
              const rIdx = rightKeys.indexOf(k);
              const y1 = lIdx * ROW_H + ROW_H / 2;
              const y2 = rightOffset + rIdx * ROW_H + ROW_H / 2;
              const x1 = 0; const x2 = SVG_W;
              const cx1 = SVG_W * 0.45; const cx2 = SVG_W * 0.55;
              return (
                <g key={k}>
                  <path d={`M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`} fill="none" stroke="hsl(var(--accent))" strokeWidth={1.5} strokeLinecap="round" opacity={0.7} />
                  <circle cx={x1} cy={y1} r={3} fill="hsl(var(--accent))" />
                  <circle cx={x2} cy={y2} r={3} fill="hsl(var(--accent))" />
                </g>
              );
            })}
          </svg>

          <ul className="space-y-0" style={{ marginTop: rightOffset }}>
            {rightKeys.map((k, i) => {
              const v = getValue(k);
              if (!v) return null;
              const Icon = v.icon;
              return (
                <li key={k} className="flex items-center gap-3 flex-row-reverse text-right" style={{ height: ROW_H }}>
                  <span className="font-sans text-xs text-accent tabular-nums w-4 text-left">{i + 1}</span>
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-accent/20 text-accent ring-1 ring-accent/40 flex-shrink-0">
                    <Icon size={16} />
                  </span>
                  <span className="font-display text-[17px] md:text-[18px] leading-none text-primary">
                    {tValueLabel(t, k)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <hr className="mt-12 md:mt-14 border-0 border-t border-border/60" />
    </section>
  );
}
