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
            <h1 className="text-4xl md:text-5xl font-display font-semibold text-foreground leading-[1.15]">
              The values you live by aren't always the ones you'd name.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
              Norte is a 10-minute exercise that shows you the values behind the choices you've actually been making, and the gap between those and the life you say you want.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 md:gap-6 text-sm text-muted-foreground font-body flex-wrap">
            <span>~10 min</span>
            <span aria-hidden>·</span>
            <span>13 questions</span>
            <span aria-hidden>·</span>
            <span>No account</span>
            <span aria-hidden>·</span>
            <span>Private</span>
          </div>

          <motion.button
            onClick={() => setStarted(true)}
            className="px-10 py-4 bg-primary text-primary-foreground rounded-xl font-display font-semibold text-lg hover:opacity-90 transition-opacity shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Start →
          </motion.button>

          <p className="text-xs text-muted-foreground">No account needed</p>
        </motion.div>
      </main>

      {/* Credentials */}
      <footer className="px-6 py-10 border-t border-border/60">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <p className="text-xs font-display uppercase tracking-widest text-muted-foreground">
            How it works
          </p>
          <p className="text-sm text-foreground/75 leading-relaxed max-w-md mx-auto">
            Norte doesn't ask what you value. It puts you in 15 everyday trade-offs and watches what you choose. The pattern that emerges is what's actually been driving your week, even when the story you tell yourself sounds different.
          </p>
          <p className="text-xs text-muted-foreground">
            Grounded in Schwartz's values research, Acceptance and Commitment Therapy, and behavioural-economics work on revealed preference.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
