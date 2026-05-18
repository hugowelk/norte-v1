import { motion } from 'framer-motion';

interface Props {
  onBegin: () => void;
}

export function TradeoffIntro({ onBegin }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-8 max-w-lg mx-auto"
    >
      <p className="text-xs font-display uppercase tracking-widest text-accent">Part 1</p>
      <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground leading-tight">
        There's no right answer.
      </h2>
      <div className="space-y-4 text-base md:text-lg text-foreground/80 leading-relaxed">
        <p>
          You'll see 15 everyday situations. In each one, pick the option closest to how you'd <em>actually</em> act, not how you wish you would.
        </p>
        <p className="text-muted-foreground">
          The first answer is usually the truest one.
        </p>
      </div>
      <button
        onClick={onBegin}
        className="px-10 py-4 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-lg hover:opacity-90 transition-opacity shadow-md"
      >
        Begin →
      </button>
    </motion.div>
  );
}
