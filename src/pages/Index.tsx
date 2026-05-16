import { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import { QuizFlow } from '@/components/QuizFlow';

const Index = () => {
  const [started, setStarted] = useState(false);

  if (started) return <QuizFlow />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Brand bar */}
      <header className="px-6 py-5">
        <div className="flex items-center gap-2">
          <Compass size={20} strokeWidth={1.75} className="text-primary" />
          <span className="font-display font-semibold text-lg tracking-tight text-foreground">Norte</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg text-center space-y-8"
        >
          <div className="space-y-5">
            <h1 className="text-4xl md:text-5xl font-display font-semibold text-foreground leading-[1.1]">
              Find your<br />
              <span className="text-accent italic">true north.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
              Your values aren't what you say they are — they're what your behaviour reveals.
              A guided exercise to uncover what's actually driving your life.
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground font-body">
            <span>~10 min</span>
            <span aria-hidden>·</span>
            <span>13 trade-offs</span>
            <span aria-hidden>·</span>
            <span>Completely private</span>
          </div>

          <motion.button
            onClick={() => setStarted(true)}
            className="px-10 py-4 bg-primary text-primary-foreground rounded-xl font-display font-semibold text-lg hover:opacity-90 transition-opacity shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Begin Discovery
          </motion.button>

          <p className="text-xs text-muted-foreground">No account needed</p>
        </motion.div>
      </main>

      {/* Credentials */}
      <footer className="px-6 py-10 border-t border-border/60">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <p className="text-xs font-display uppercase tracking-widest text-muted-foreground">
            The method behind Norte
          </p>
          <p className="text-sm text-foreground/75 leading-relaxed max-w-md mx-auto">
            Norte is built on the principle that values are revealed through behaviour and trade-offs, not declarations.
            Our 13-scenario inference draws on decades of work in values psychology and behavioural decision-making.
          </p>
          <p className="text-xs text-muted-foreground">
            Based on Schwartz's Theory of Basic Human Values, Acceptance and Commitment Therapy (ACT) values work,
            and behavioural-economics research on revealed preference.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
