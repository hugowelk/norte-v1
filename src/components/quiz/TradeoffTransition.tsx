import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface Props {
  message: string;
  onContinue: () => void;
}

export function TradeoffTransition({ message, onContinue }: Props) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-8 max-w-md mx-auto"
    >
      <h3 className="text-2xl md:text-3xl font-display font-medium text-foreground leading-snug italic">
        {message}
      </h3>
      <button
        onClick={onContinue}
        className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-display font-medium hover:opacity-90 transition-opacity"
      >
        {t('common.actions.continue')}
      </button>
    </motion.div>
  );
}
