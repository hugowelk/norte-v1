import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { getValueByKey, type ValueKey } from '@/lib/values';
import type { UserData } from '../QuizFlow';

interface Props {
  userData: UserData;
}

export function FinalInsights({ userData }: Props) {
  const { inferredValues, rankedValues, alignmentScores, actions, scores } = userData;

  // Radar chart data
  const radarData = rankedValues.map(key => {
    const v = getValueByKey(key);
    const maxScore = Math.max(...Object.values(scores), 1);
    return {
      value: v.label,
      current: Math.round(((scores[key] || 0) / maxScore) * 10),
      alignment: alignmentScores[key] || 0,
    };
  });

  // Determine gap
  const inferredLabels = inferredValues.slice(0, 3).map(k => getValueByKey(k).label);
  const chosenLabels = rankedValues.slice(0, 3).map(k => getValueByKey(k).label);
  const hasGap = inferredValues.slice(0, 3).some(v => !rankedValues.slice(0, 3).includes(v));

  return (
    <div className="space-y-10 pb-16">
      <div className="space-y-3 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.6 }}>
          <span className="text-5xl">🧭</span>
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
          Your Values Compass
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Here's a complete picture of your values, alignment, and next steps.
        </p>
      </div>

      {/* Radar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <h3 className="font-display font-semibold text-foreground mb-4 text-center">Value Alignment Map</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis
              dataKey="value"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            />
            <Radar name="Behaviour" dataKey="current" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.2} />
            <Radar name="Alignment" dataKey="alignment" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
          </RadarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-2 text-sm">
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-accent" /> Behaviour signals</span>
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary" /> Life alignment</span>
        </div>
      </motion.div>

      {/* Current Life Signals */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-3">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
          <span className="text-lg">📊</span> Current Life Signals
        </h3>
        <p className="text-sm text-muted-foreground">Values inferred from your behaviour:</p>
        <div className="flex flex-wrap gap-2">
          {inferredValues.slice(0, 5).map(key => {
            const v = getValueByKey(key);
            return (
              <span key={key} className="px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-sm font-body">
                {v.emoji} {v.label}
              </span>
            );
          })}
        </div>
      </motion.div>

      {/* Chosen Core Values */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-3">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
          <span className="text-lg">⭐</span> Your Chosen Core Values
        </h3>
        <div className="flex flex-wrap gap-2">
          {rankedValues.map((key, i) => {
            const v = getValueByKey(key);
            return (
              <span key={key} className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-body">
                #{i + 1} {v.emoji} {v.label}
              </span>
            );
          })}
        </div>
      </motion.div>

      {/* Alignment Gap */}
      {hasGap && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-xl bg-accent/5 border border-accent/20"
        >
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2 mb-3">
            <span className="text-lg">🔄</span> The Alignment Gap
          </h3>
          <p className="text-sm text-foreground/80 leading-relaxed">
            Your behaviour suggests <strong>{inferredLabels.join(', ')}</strong> currently guide your life.
            But your chosen values prioritise <strong>{chosenLabels.join(', ')}</strong>.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            This difference highlights areas where you may want to rebalance your time and energy.
          </p>
        </motion.div>
      )}

      {/* Committed Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="space-y-3">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
          <span className="text-lg">🎯</span> Your Committed Actions
        </h3>
        <div className="space-y-3">
          {actions.map((a, i) => {
            const v = getValueByKey(a.value);
            return (
              <div key={i} className="p-4 rounded-lg bg-card border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <span>{v.emoji}</span>
                  <span className="text-xs font-display uppercase tracking-wider text-accent">{v.label}</span>
                </div>
                <p className="font-body text-foreground">{a.action}</p>
                {a.when && <p className="text-sm text-muted-foreground mt-1">📅 {a.when}</p>}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Closing message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center pt-6 border-t border-border"
      >
        <p className="text-lg font-display text-foreground font-medium">
          Values are revealed through behaviour, not declarations.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          The gap between how you live and how you want to live is where meaningful change begins.
        </p>
      </motion.div>
    </div>
  );
}
