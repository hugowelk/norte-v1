import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface Props {
  onContinue: () => void;
}

export function HowItWorksSlide({ onContinue }: Props) {
  const { t } = useTranslation();
  const points = t('quiz.howItWorks.points', { returnObjects: true }) as string[];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-10 max-w-xl mx-auto"
    >
      <div className="text-center space-y-3">
        <p className="text-xs font-display uppercase tracking-widest text-accent">{t('quiz.howItWorks.eyebrow')}</p>
        <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground leading-tight">
          {t('quiz.howItWorks.title')}
        </h2>
      </div>

      <ol className="space-y-6">
        {points.map((point, i) => (
          <li key={i} className="flex gap-5 items-start">
            <span className="shrink-0 w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center font-display text-sm text-foreground/80">
              {i + 1}
            </span>
            <p className="text-base md:text-lg text-foreground/85 leading-relaxed pt-1">{point}</p>
          </li>
        ))}
      </ol>

      <p className="text-xs text-muted-foreground italic leading-relaxed border-t border-border/60 pt-5">
        {t('quiz.howItWorks.methodology')}
      </p>

      <div className="flex justify-center">
        <button
          onClick={onContinue}
          className="px-10 py-4 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-lg hover:opacity-90 transition-opacity shadow-md"
        >
          {t('common.actions.begin')}
        </button>
      </div>
    </motion.div>
  );
}
