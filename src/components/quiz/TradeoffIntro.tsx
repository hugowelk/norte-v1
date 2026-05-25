import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';

interface Props {
  onBegin: () => void;
}

export function TradeoffIntro({ onBegin }: Props) {
  const { t } = useTranslation();
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
      <button
        onClick={onBegin}
        className="px-10 py-4 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-lg hover:opacity-90 transition-opacity shadow-md"
      >
        {t('common.actions.beginArrow')}
      </button>
    </motion.div>
  );
}
