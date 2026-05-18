import { motion } from 'framer-motion';

interface Props {
  onContinue: () => void;
}

const POINTS = [
  "You'll answer 15 scenarios. Each presents two situations in conflict. Choose what you'd actually do.",
  "Don't overthink. There's no right or wrong. What counts is what you'd do, not what you'd like to do.",
  "At the end, we show you the 3 values that weigh most in your decisions, and where the gaps are between behaviour and aspiration.",
];

export function HowItWorksSlide({ onContinue }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-10 max-w-xl mx-auto"
    >
      <div className="text-center space-y-3">
        <p className="text-xs font-display uppercase tracking-widest text-accent">Before you start</p>
        <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground leading-tight">
          How this works
        </h2>
      </div>

      <ol className="space-y-6">
        {POINTS.map((point, i) => (
          <li key={i} className="flex gap-5 items-start">
            <span className="shrink-0 w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center font-display text-sm text-foreground/80">
              {i + 1}
            </span>
            <p className="text-base md:text-lg text-foreground/85 leading-relaxed pt-1">
              {point}
            </p>
          </li>
        ))}
      </ol>

      <p className="text-xs text-muted-foreground italic leading-relaxed border-t border-border/60 pt-5">
        Methodology grounded in ACT (Acceptance and Commitment Therapy), the Valued Living Questionnaire, and the Bull's Eye Values Survey.
      </p>

      <div className="flex justify-center">
        <button
          onClick={onContinue}
          className="px-10 py-4 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-lg hover:opacity-90 transition-opacity shadow-md"
        >
          Begin
        </button>
      </div>
    </motion.div>
  );
}
