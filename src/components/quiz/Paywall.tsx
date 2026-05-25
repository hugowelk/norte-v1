import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Compass, Target, MessageCircle, Check, Share2 } from 'lucide-react';
import { type ValueKey } from '@/lib/values';

interface Props {
  onBack: () => void;
  onUnlock: () => void;
  sampleValue?: ValueKey;
}

export function Paywall({ onBack, onUnlock, sampleValue }: Props) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-10 pb-16">
      <div className="space-y-4 text-center">
        <motion.span initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', duration: 0.7 }} className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary">
          <Compass size={28} strokeWidth={1.75} />
        </motion.span>
        <p className="text-xs font-display uppercase tracking-widest text-accent">{t('quiz.paywall.eyebrow')}</p>
        <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground leading-tight">
          {t('quiz.paywall.title')}
        </h1>
        <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
          {t('quiz.paywall.body')}
        </p>
      </div>

      <div className="rounded-2xl border border-primary/30 bg-card overflow-hidden shadow-sm">
        <div className="px-6 py-5 bg-primary/5 border-b border-primary/20 flex items-baseline justify-between gap-4 flex-wrap">
          <p className="text-xs font-display uppercase tracking-widest text-primary">{t('quiz.paywall.cardTitle')}</p>
          <p className="font-display text-sm text-foreground flex items-center gap-2">
            <span className="relative inline-block">
              <span className="font-semibold">$9</span>
              <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }} style={{ transformOrigin: 'left' }} className="absolute left-0 right-0 top-1/2 h-[2px] bg-foreground" />
            </span>
            <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9, type: 'spring', stiffness: 300 }} className="px-2 py-0.5 rounded-full bg-[hsl(20,90%,55%)] text-white text-[11px] font-display font-bold uppercase tracking-wider">
              {t('quiz.paywall.free')}
            </motion.span>
          </p>
        </div>
        <ul className="px-6 py-5 space-y-4">
          <Bullet icon={Target} title={t('quiz.paywall.bullets.nextSteps.title')}>
            {t('quiz.paywall.bullets.nextSteps.body')}
          </Bullet>
          <Bullet icon={MessageCircle} title={t('quiz.paywall.bullets.conversation.title')}>
            {t('quiz.paywall.bullets.conversation.body')}
          </Bullet>
          <Bullet icon={Sparkles} title={t('quiz.paywall.bullets.yours.title')}>
            {t('quiz.paywall.bullets.yours.body')}
          </Bullet>
        </ul>
      </div>

      <button onClick={onUnlock} className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-base hover:opacity-90 transition-opacity shadow-md">
        {t('quiz.paywall.cta')}
      </button>
      <div className="flex items-center justify-center gap-6 text-sm font-display">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
          {t('common.actions.maybeLater')}
        </button>
        <span className="text-border">·</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText('findmyvalues.app');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? <Check size={14} /> : <Share2 size={14} />}
          {copied ? t('common.actions.linkCopied') : t('common.actions.shareWithFriend')}
        </button>
      </div>
    </div>
  );
}

function Bullet({ icon: Icon, title, children }: { icon: typeof Sparkles; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="shrink-0 w-9 h-9 rounded-full bg-accent/10 text-accent flex items-center justify-center">
        <Icon size={18} strokeWidth={1.75} />
      </span>
      <div>
        <p className="font-display font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">{children}</p>
      </div>
    </li>
  );
}
