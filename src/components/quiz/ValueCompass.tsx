import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
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

export function ValueCompass({ result, slots, alignmentScores, onContinue }: Props) {
  // Build a per-value aspiring score (0-100). For each of the 8 canonical values,
  // use the alignment slider if the user picked it, else fall back to 0.
  const aspiring: Record<ValueKey, number> = {
    achievement: 0, connection: 0, aliveness: 0, enjoyment: 0,
    meaning: 0, contribution: 0, stability: 0, autonomy: 0,
  };
  for (const s of slots) {
    if (s.kind === 'core') {
      const k = `core:${s.key}`;
      aspiring[s.key] = (alignmentScores[k] ?? 0) * 10;
    }
  }

  const radarData = VALUES.map(v => ({
    value: v.label,
    current: result.normalized[v.key],
    aspiring: aspiring[v.key],
  }));

  // Gap reveal: aspirational values that fell outside the revealed top 3.
  const aspirationalCoreKeys = slots
    .filter((s): s is { kind: 'core'; key: ValueKey } => s.kind === 'core')
    .map(s => s.key);
  const gaps = findAspirationalGaps(aspirationalCoreKeys, result);
  const topGap = gaps[0];

  // Strongest alignment: a top-3 revealed value that the user also chose in slots.
  const top3 = new Set([result.revealed.primary, result.revealed.secondary, result.revealed.tertiary]);
  const alignedValue = aspirationalCoreKeys.find(k => top3.has(k));

  const primaryLabel = getValueByKey(result.revealed.primary).label;
  const aspirationalLabels = aspirationalCoreKeys.map(k => getValueByKey(k).label);

  return (
    <div className="space-y-10 pb-12">
      <div className="space-y-3 text-center">
        <p className="text-xs font-display uppercase tracking-widest text-accent">Your Value Compass</p>
        <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground leading-tight">
          Where your life is, and where you want it.
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card border border-border rounded-2xl p-5 md:p-6"
      >
        <ResponsiveContainer width="100%" height={360}>
          <RadarChart data={radarData} outerRadius="72%">
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis
              dataKey="value"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            />
            <Radar
              name="Current behaviour signals"
              dataKey="current"
              stroke="hsl(var(--accent))"
              fill="hsl(var(--accent))"
              fillOpacity={0.25}
            />
            <Radar
              name="Aspiring values"
              dataKey="aspiring"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.2}
            />
            <Legend
              wrapperStyle={{ paddingTop: 12, fontFamily: 'var(--font-display)', fontSize: 13 }}
              iconType="circle"
            />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Gap reveal — the emotional moment */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="space-y-5"
      >
        <p className="text-xs font-display uppercase tracking-widest text-muted-foreground">What this tells you</p>

        <div className="space-y-4 text-foreground/90 leading-relaxed">
          <p className="text-lg font-display">
            Your behaviour has been pointing at <strong className="text-foreground">{primaryLabel}</strong>.
          </p>
          <p>
            But the values you said you want to live by — {prettyList(aspirationalLabels)} — tell a different story
            about who you're becoming.
          </p>

          {topGap && (
            <div className="p-5 rounded-xl bg-accent/5 border border-accent/20">
              <p className="text-foreground">
                <strong>{getValueByKey(topGap.value).label}</strong> matters to you, but in your real choices it came
                up <strong>{ordinal(topGap.rank)}</strong> out of eight. That's the widest gap between who you say you
                are and how you actually spend your week.
              </p>
            </div>
          )}

          {alignedValue && (
            <p className="text-muted-foreground italic">
              You are already living in alignment with <strong className="text-foreground not-italic">
                {getValueByKey(alignedValue).label}
              </strong> — your behaviour and your aspiration agree here.
            </p>
          )}

          <p className="text-foreground pt-2">
            This isn't a verdict. It's a starting point. The space between the two lines on the compass is exactly
            where a more aligned life gets built.
          </p>
        </div>
      </motion.div>

      <button
        onClick={onContinue}
        className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-display font-medium text-base hover:opacity-90 transition-opacity shadow-md"
      >
        Explore next steps
      </button>
    </div>
  );
}

function prettyList(items: string[]): string {
  if (items.length === 0) return '—';
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

function ordinal(n: number): string {
  const map = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'];
  return map[n] ?? `${n}th`;
}
