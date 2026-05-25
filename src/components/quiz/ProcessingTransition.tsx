import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface Props {
  onComplete: () => void;
}

export function ProcessingTransition({ onComplete }: Props) {
  const { t } = useTranslation();
  const stages = t('quiz.processing.stages', { returnObjects: true }) as string[];
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      const tt = setTimeout(onComplete, 600);
      return () => clearTimeout(tt);
    }
    const perStage = 2400;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i < stages.length; i++) {
      timers.push(setTimeout(() => setStage(i), perStage * i));
    }
    timers.push(setTimeout(onComplete, perStage * stages.length + 200));
    return () => timers.forEach(clearTimeout);
  }, [onComplete, stages.length]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-10">
      <div className="relative w-20 h-20">
        <motion.div className="absolute inset-0 rounded-full border border-accent/30" animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute inset-2 rounded-full border border-accent/50" animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0.1, 0.7] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }} />
        <motion.div className="absolute inset-6 rounded-full bg-accent" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }} />
      </div>

      <div className="space-y-3 max-w-sm">
        <p className="text-xs font-display uppercase tracking-widest text-accent">{t('quiz.processing.eyebrow')}</p>
        <AnimatePresence mode="wait">
          <motion.p key={stage} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.5 }} className="text-lg md:text-xl font-display text-foreground leading-snug">
            {stages[stage]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="w-48 h-px bg-border relative overflow-hidden">
        <motion.div className="absolute inset-y-0 left-0 bg-accent" initial={{ width: '0%' }} animate={{ width: `${((stage + 1) / stages.length) * 100}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} />
      </div>
    </div>
  );
}
