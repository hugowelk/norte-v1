import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';

interface Props {
  onBegin: () => void;
}

export function TradeoffIntro({ onBegin }: Props) {
  const { t } = useTranslation();
  const steps = t('quiz.intro.steps', { returnObjects: true }) as string[];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-8 max-w-lg mx-auto"
    >
      <p className="text-xs font-display uppercase tracking-widest text-accent">{t('quiz.intro.eyebrow')}</p>
      <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground leading-tight text-balance">
        {t('quiz.intro.title')}
      </h2>
      <div className="space-y-4 text-base md:text-lg text-foreground/80 leading-relaxed">
        <p>
          <Trans i18nKey="quiz.intro.body1" components={{ em: <em /> }} />
        </p>
        <p className="text-muted-foreground">
          {t('quiz.intro.body2')}
        </p>
      </div>
      <div className="text-left space-y-3">
        <p className="text-xs font-display uppercase tracking-widest text-accent text-center">{t('quiz.intro.stepsTitle')}</p>
        <ol className="space-y-2 text-sm text-foreground/80">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 text-accent text-xs font-display font-semibold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>
      <button
        onClick={onBegin}
        className="px-10 py-4 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-lg hover:opacity-90 transition-opacity shadow-md"
      >
        {t('common.actions.beginArrow')}
      </button>
      <p className="text-xs text-muted-foreground italic leading-relaxed pt-2">
        {t('quiz.intro.methodology')}
      </p>
    </motion.div>
  );
}
