import { useMemo, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { VALUES, type ValueKey } from '@/lib/values';
import type { ScoreResult } from '@/lib/algorithm';
import { tValueLabel, tOrdinal } from '@/lib/i18nHelpers';
import { ValueIcon } from '../ValueIcon';
import type { SelectableValue } from './CoreValuesSelection';

interface Props {
  result: ScoreResult;
  slots: SelectableValue[];
  // Kept for backwards-compat with QuizFlow; no longer used.
  alignmentScores?: Record<string, number>;
  onContinue: () => void;
}

const ROW_H = 52;
const SVG_W = 140;

export function ValueCompass({ result, slots, onContinue }: Props) {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState<ValueKey | null>(null);

  // LEFT: aspirational ranking (1..8). Top 3 = user's picks (in chosen order).
  // Remaining 5 keep their declared order in VALUES.
  // LEFT: revealed ranking from the algorithm (1..8).
  const leftKeys: ValueKey[] = result.ranking;

  // RIGHT: aspirational ranking (1..8). Top 3 = user's picks (in chosen order).
  // Remaining 5 keep their declared order in VALUES.
  const rightKeys: ValueKey[] = useMemo(() => {
    const picked = slots.map(s => s.key);
    const rest = VALUES.map(v => v.key).filter(k => !picked.includes(k));
    return [...picked, ...rest];
  }, [slots]);

  const leftRank = (k: ValueKey) => leftKeys.indexOf(k) + 1;     // revealed
  const rightRank = (k: ValueKey) => rightKeys.indexOf(k) + 1;   // aspirational

  // Stat card: how many of top-3 aspirational fall in the bottom half (5-8)
  // of the revealed ranking.
  const top3Aspirational = slots.slice(0, 3).map(s => s.key);
  const bottomHalfCount = top3Aspirational.filter(k => leftRank(k) >= 5).length;

  // Insight card: value with the single largest rank gap (in either direction).
  const largestGap = useMemo(() => {
    let best: { key: ValueKey; diff: number } | null = null;
    for (const v of VALUES) {
      // diff = aspirational - revealed. Positive => claimed higher than lived (the gap).
      const diff = rightRank(v.key) - leftRank(v.key);
      if (!best || Math.abs(diff) > Math.abs(best.diff)) {
        best = { key: v.key, diff };
      }
    }
    return best!;
  }, [leftKeys, rightKeys]);

  const fullOverlap = top3Aspirational.every(k => leftRank(k) <= 3);

  const svgHeight = leftKeys.length * ROW_H;

  const lineColor = (k: ValueKey) => {
    // diff > 0: aspirational rank is higher (better) than revealed -> the gap (terracotta).
    // diff < 0: revealed rank is higher than aspirational -> lived more than claimed (green).
    const diff = rightRank(k) - leftRank(k);
    if (diff <= -2) return 'hsl(var(--primary))';      // green: lived more than claimed
    if (diff >= 2) return 'hsl(var(--accent))';        // terracotta: the gap
    return 'hsl(var(--muted-foreground) / 0.35)';      // neutral
  };


  return (
    <div className="space-y-10 pb-16">
      <div className="space-y-3 text-center">
        <p className="text-xs font-display uppercase tracking-widest text-accent">
          {t('quiz.compass.eyebrow')}
        </p>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground leading-tight">
          {t('quiz.compass.title')}
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto font-body">
          {t('quiz.compass.slopeBody', {
            defaultValue: 'On the left, the order your trade-offs revealed. On the right, the order you said matters. The lines show the distance between them.',
          })}
        </p>
      </div>

      {/* Slope / bump chart */}
      <div className="bg-card border border-border rounded-2xl p-4 md:p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <p className="font-display text-[11px] uppercase tracking-[0.18em] text-accent">
              {t('quiz.compass.leftCol', { defaultValue: 'What your choices revealed' })}
            </p>
          </div>
          <div className="flex-1 min-w-0 text-right">
            <p className="font-display text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {t('quiz.compass.rightCol', { defaultValue: 'What you said mattered' })}
            </p>
          </div>
        </div>


        {/* Desktop: 3-column slope chart */}
        <div className="hidden md:grid items-start" style={{ gridTemplateColumns: `1fr ${SVG_W}px 1fr` }}>
          <ul className="space-y-0">
            {leftKeys.map((k, i) => (
              <SlopeRow
                key={`L-${k}`}
                valueKey={k}
                rank={i + 1}
                align="left"
                active={hovered === k}
                onHover={setHovered}
              />
            ))}
          </ul>

          <svg
            width={SVG_W}
            height={svgHeight}
            viewBox={`0 0 ${SVG_W} ${svgHeight}`}
            className="overflow-visible"
            aria-hidden="true"
          >
            {VALUES.map(v => {
              const lIdx = leftRank(v.key) - 1;
              const rIdx = rightRank(v.key) - 1;
              const y1 = lIdx * ROW_H + ROW_H / 2;
              const y2 = rIdx * ROW_H + ROW_H / 2;
              const x1 = 0;
              const x2 = SVG_W;
              const cx1 = SVG_W * 0.45;
              const cx2 = SVG_W * 0.55;
              const isActive = hovered === v.key;
              const isDim = hovered !== null && !isActive;
              return (
                <g key={v.key} opacity={isDim ? 0.18 : 1}>
                  <path
                    d={`M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`}
                    fill="none"
                    stroke={lineColor(v.key)}
                    strokeWidth={isActive ? 2.5 : 1.5}
                    strokeLinecap="round"
                  />
                  <circle cx={x1} cy={y1} r={isActive ? 4 : 3} fill={lineColor(v.key)} />
                  <circle cx={x2} cy={y2} r={isActive ? 4 : 3} fill={lineColor(v.key)} />
                </g>
              );
            })}
          </svg>

          <ul className="space-y-0">
            {rightKeys.map((k, i) => (
              <SlopeRow
                key={`R-${k}`}
                valueKey={k}
                rank={i + 1}
                align="right"
                active={hovered === k}
                onHover={setHovered}
              />
            ))}
          </ul>
        </div>

        {/* Mobile: stacked list with rank shift */}
        <ul className="md:hidden divide-y divide-border/60">
          {[...VALUES]
            .sort((a, b) => leftRank(a.key) - leftRank(b.key))
            .map(v => {
              const lr = leftRank(v.key);
              const rr = rightRank(v.key);
              const diff = rr - lr;
              const color = lineColor(v.key);
              const arrow = diff === 0 ? '·' : diff > 0 ? '↓' : '↑';
              return (
                <li key={v.key} className="py-3 flex items-center gap-3">
                  <ValueIcon value={v.key} size={16} />
                  <span className="font-display text-[15px] text-foreground flex-1 truncate">
                    {tValueLabel(t, v.key)}
                  </span>
                  <span className="font-body text-xs text-muted-foreground tabular-nums">
                    #{lr} → #{rr}
                  </span>
                  <span
                    className="font-display text-base tabular-nums w-5 text-center"
                    style={{ color }}
                    aria-label={diff > 0 ? 'dropped' : diff < 0 ? 'rose' : 'same'}
                  >
                    {arrow}
                  </span>
                </li>
              );
            })}
        </ul>

        {/* Hover/tap detail (desktop) */}
        {hovered && (
          <div className="hidden md:flex mt-5 pt-4 border-t border-border/60 items-center gap-3 text-sm font-body text-foreground">
            <ValueIcon value={hovered} size={16} />
            <span className="font-display">{tValueLabel(t, hovered)}:</span>
            <span className="text-muted-foreground tabular-nums">
              #{leftRank(hovered)} → #{rightRank(hovered)}
            </span>
          </div>
        )}

        {/* Legend */}
        <div className="mt-5 pt-4 border-t border-border/60 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-display uppercase tracking-[0.14em] text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-[2px] rounded-full bg-accent" />
            {t('quiz.compass.legendGap', { defaultValue: 'The gap' })}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-[2px] rounded-full bg-primary" />
            {t('quiz.compass.legendLived', { defaultValue: 'Lived more than claimed' })}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-[2px] rounded-full bg-muted-foreground/40" />
            {t('quiz.compass.legendAligned', { defaultValue: 'Roughly aligned' })}
          </span>
        </div>
      </div>

      {/* Callout cards */}
      {!fullOverlap && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
            <div className="font-display text-5xl font-semibold text-accent leading-none tabular-nums">
              {bottomHalfCount}
              <span className="text-xl text-muted-foreground">/3</span>
            </div>
            <p className="text-sm text-foreground/85 font-body leading-snug">
              <Trans
                i18nKey="quiz.compass.bottomHalfNote"
                values={{ count: bottomHalfCount }}
                components={{ strong: <strong className="text-foreground" /> }}
                defaults="of the values you want at the centre sit in the <strong>bottom half</strong> of what your choices revealed."
              />
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
            <div className="shrink-0 w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
              <ValueIcon
                value={largestGap.key}
                size={26}
                className={largestGap.diff >= 0 ? 'text-accent' : 'text-primary'}
              />
            </div>
            <p className="text-sm text-foreground/85 font-body leading-snug">
              {largestGap.diff > 0 ? (
                <Trans
                  i18nKey="quiz.compass.largestGapDown"
                  values={{
                    label: tValueLabel(t, largestGap.key),
                    aspOrdinal: tOrdinal(t, rightRank(largestGap.key)),
                    revOrdinal: tOrdinal(t, leftRank(largestGap.key)),
                  }}
                  components={{ strong: <strong className="text-foreground" /> }}
                  defaults="<strong>{{label}}</strong> is your {{aspOrdinal}} chosen value, but your trade-offs place it {{revOrdinal}}."
                />
              ) : largestGap.diff < 0 ? (
                <Trans
                  i18nKey="quiz.compass.largestGapUp"
                  values={{
                    label: tValueLabel(t, largestGap.key),
                    aspOrdinal: tOrdinal(t, rightRank(largestGap.key)),
                    revOrdinal: tOrdinal(t, leftRank(largestGap.key)),
                  }}
                  components={{ strong: <strong className="text-foreground" /> }}
                  defaults="<strong>{{label}}</strong> sits {{aspOrdinal}} in what you claim, but your choices put it {{revOrdinal}}. You live it more than you say."
                />
              ) : (
                <Trans
                  i18nKey="quiz.compass.noGap"
                  values={{ label: tValueLabel(t, largestGap.key) }}
                  components={{ strong: <strong className="text-foreground" /> }}
                  defaults="<strong>{{label}}</strong> lines up exactly. What you claim and what you choose are the same."
                />
              )}
            </p>
          </div>
        </div>
      )}

      <div className="rounded-2xl border-l-2 border-accent bg-card/60 p-5 space-y-3 font-body">
        {fullOverlap ? (
          <>
            <p className="text-foreground/90 leading-relaxed">{t('quiz.compass.fullOverlap1')}</p>
            <p className="text-muted-foreground leading-relaxed">{t('quiz.compass.fullOverlap2')}</p>
          </>
        ) : (
          <>
            <p className="text-xs font-display uppercase tracking-widest text-accent">
              {t('quiz.compass.noteEyebrow')}
            </p>
            <p className="text-foreground/90 leading-relaxed">{t('quiz.compass.gapNote1')}</p>
            <p className="text-foreground leading-relaxed">{t('quiz.compass.gapNote2')}</p>
          </>
        )}
      </div>

      <button
        onClick={onContinue}
        className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-display font-medium text-base hover:opacity-90 transition-opacity shadow-md"
      >
        {t('quiz.compass.continue')}
      </button>
    </div>
  );
}

function SlopeRow({
  valueKey,
  rank,
  align,
  active,
  onHover,
}: {
  valueKey: ValueKey;
  rank: number;
  align: 'left' | 'right';
  active: boolean;
  onHover: (k: ValueKey | null) => void;
}) {
  const { t } = useTranslation();
  return (
    <li
      onMouseEnter={() => onHover(valueKey)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(valueKey)}
      onBlur={() => onHover(null)}
      tabIndex={0}
      className={`flex items-center gap-3 cursor-default outline-none transition-opacity ${
        align === 'right' ? 'flex-row-reverse text-right' : ''
      } ${active ? 'opacity-100' : 'opacity-95'}`}
      style={{ height: ROW_H }}
    >
      <span
        className={`font-display text-xs tabular-nums w-4 ${
          align === 'right' ? 'text-left text-accent' : 'text-right text-muted-foreground'
        }`}
      >
        {rank}
      </span>
      <span
        className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${
          active
            ? align === 'right'
              ? 'bg-accent/20 text-accent ring-1 ring-accent/40'
              : 'bg-primary/15 text-primary ring-1 ring-primary/30'
            : 'bg-muted text-muted-foreground/80'
        }`}
      >
        <ValueIcon value={valueKey} size={14} className="text-current" />
      </span>
      <span
        className={`font-display text-[15px] md:text-[16px] leading-none truncate ${
          active ? 'text-foreground' : 'text-foreground/85'
        }`}
      >
        {tValueLabel(t, valueKey)}
      </span>
    </li>
  );
}
