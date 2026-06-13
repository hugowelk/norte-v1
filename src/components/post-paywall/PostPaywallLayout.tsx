import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Props {
  step: 1 | 2;
  backTo?: string;
  children: React.ReactNode;
}

export function PostPaywallLayout({ step, backTo, children }: Props) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {backTo && (
        <Link to={backTo} className="fixed top-6 left-6 z-50 text-muted-foreground hover:text-foreground transition-colors text-sm font-display flex items-center gap-1">
          {t('common.actions.back')}
        </Link>
      )}

      <div className="flex-1 flex items-start md:items-center justify-center px-4 py-20 md:py-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }} className="w-full max-w-[640px] space-y-8">
          <p className="text-xs font-display uppercase tracking-widest text-accent">
            {t('postPaywall.layout.eyebrow', { step })}
          </p>
          {children}
        </motion.div>
      </div>
    </div>
  );
}
