import { motion } from 'framer-motion';
import { getValueByKey, type ValueKey, type Value } from '@/lib/values';

interface Props {
  inferredValues: ValueKey[];
  scores: Record<ValueKey, number>;
  onContinue: () => void;
}

export function ValueResults({ inferredValues, onContinue }: Props) {
  return (
    <div className="space-y-8 text-center">
      <div className="space-y-3">
        <p className="text-xs font-display uppercase tracking-widest text-accent">Your Results</p>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground">
          Your behaviour suggests these values
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Based on how you spend your time, money, and energy — these values currently influence your life the most.
        </p>
      </div>

      <div className="space-y-3">
        {inferredValues.map((key, i) => {
          const value = getValueByKey(key);
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 px-5 py-4 rounded-lg bg-card border border-border text-left"
            >
              <span className="text-2xl">{value.emoji}</span>
              <div>
                <p className="font-display font-medium text-foreground">{value.label}</p>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="text-sm text-muted-foreground">
        Next, you'll sort these into what truly matters to you.
      </p>

      <button
        onClick={onContinue}
        className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-display font-medium hover:opacity-90 transition-opacity"
      >
        Sort My Values
      </button>
    </div>
  );
}
