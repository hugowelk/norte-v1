import { useState } from 'react';
import { motion } from 'framer-motion';
import { QuizFlow } from '@/components/QuizFlow';

const Index = () => {
  const [started, setStarted] = useState(false);

  if (started) return <QuizFlow />;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg text-center space-y-8"
      >
        <motion.span
          className="text-6xl block"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.2, duration: 0.8 }}
        >
          🧭
        </motion.span>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground leading-tight">
            Discover Your
            <br />
            <span className="text-accent">Core Values</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
            Your values aren't what you say they are — they're what your behaviour reveals.
            Take this guided exercise to uncover what truly drives you.
          </p>
        </div>

        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-6">
            <span className="flex items-center gap-1.5">🕐 ~10 min</span>
            <span className="flex items-center gap-1.5">📊 Personalised</span>
            <span className="flex items-center gap-1.5">🎯 Actionable</span>
          </div>
        </div>

        <motion.button
          onClick={() => setStarted(true)}
          className="px-10 py-4 bg-primary text-primary-foreground rounded-xl font-display font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Begin Discovery
        </motion.button>

        <p className="text-xs text-muted-foreground">
          No account needed · Completely private
        </p>
      </motion.div>
    </div>
  );
};

export default Index;
