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
          Turn the gap into something you can actually move.
        </h1>
        <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
          You've seen what's been driving your week, and where you want it to be heading. The next step is the harder one — designing the small shifts that close the distance.
        </p>
      </div>

      <div className="rounded-2xl border border-primary/30 bg-card overflow-hidden shadow-sm">
        <div className="px-6 py-5 bg-primary/5 border-b border-primary/20 flex items-baseline justify-between gap-4 flex-wrap">
          <p className="text-xs font-display uppercase tracking-widest text-primary">Your Norte Plan</p>
          <p className="font-display text-sm text-foreground"><span className="font-semibold">$7</span> one-time</p>
        </div>
        <ul className="px-6 py-5 space-y-4">
          <Bullet icon={Target} title="A plan built from your gaps">
            Not a goal list. The specific behaviours that have been pulling you toward your top revealed value, and the small ones that could pull you toward the values you want at the centre instead.
          </Bullet>
          <Bullet icon={MessageCircle} title="A real conversation, not a checklist">
            Norte's AI guide works through your compass with you — asking the questions a thoughtful friend would, and helping you design shifts that fit the life you actually have.
          </Bullet>
          <Bullet icon={Sparkles} title="Yours to keep">
            Export your plan, revisit it, share it with someone who knows you.
          </Bullet>
        </ul>
      </div>

      <button
        onClick={() => {/* placeholder */}}
        className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-base hover:opacity-90 transition-opacity shadow-md"
      >
        Get my plan — $7 →
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
