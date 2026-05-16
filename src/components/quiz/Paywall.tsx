import { motion } from 'framer-motion';
import { Sparkles, Compass, Target, MessageCircle } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export function Paywall({ onBack }: Props) {
  return (
    <div className="space-y-10 pb-16">
      <div className="space-y-4 text-center">
        <motion.span
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.7 }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary"
        >
          <Compass size={28} strokeWidth={1.75} />
        </motion.span>
        <p className="text-xs font-display uppercase tracking-widest text-accent">What's next</p>
        <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground leading-tight">
          Turn this gap into a life you actually live.
        </h1>
        <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
          You've seen the gap. Now build a personal plan that closes it — not with goals, but with the small
          behaviour shifts that move life satisfaction.
        </p>
      </div>

      <div className="rounded-2xl border border-primary/30 bg-card overflow-hidden shadow-sm">
        <div className="px-6 py-5 bg-primary/5 border-b border-primary/20">
          <p className="text-xs font-display uppercase tracking-widest text-primary">Custom Action Plan</p>
          <h2 className="font-display text-xl font-semibold text-foreground mt-1">
            Your Norte deep dive
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            A guided AI conversation built from your compass.
          </p>
        </div>
        <ul className="px-6 py-5 space-y-4">
          <Bullet icon={Sparkles} title="A behaviour-first plan, not a goal list">
            We don't ask what you want to achieve. We ask what daily behaviours pull you off course — and which
            tiny ones could pull you back.
          </Bullet>
          <Bullet icon={Target} title="Built around your gaps">
            Every step is anchored in the specific distance between your current behaviour and your aspirational
            values.
          </Bullet>
          <Bullet icon={MessageCircle} title="A real conversation">
            An AI guide that asks the harder questions — and helps you design shifts that fit your actual life.
          </Bullet>
        </ul>
      </div>

      <button
        onClick={() => {/* placeholder */}}
        className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-base hover:opacity-90 transition-opacity shadow-md"
      >
        Start my plan
      </button>
      <button
        onClick={onBack}
        className="w-full text-center text-sm font-display text-muted-foreground hover:text-foreground transition-colors"
      >
        Maybe later
      </button>
    </div>
  );
}

function Bullet({
  icon: Icon, title, children,
}: { icon: typeof Sparkles; title: string; children: React.ReactNode }) {
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
