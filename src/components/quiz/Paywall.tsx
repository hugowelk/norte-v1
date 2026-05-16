import { motion } from 'framer-motion';
import { Sparkles, Compass, Target, MessageCircle, Lock } from 'lucide-react';
import { type ValueKey, getValueByKey } from '@/lib/values';
import { ValueIcon } from '../ValueIcon';

interface Props {
  onBack: () => void;
  sampleValue?: ValueKey;
}

const SAMPLE_ACTIONS: Record<ValueKey, { title: string; body: string }> = {
  aliveness: {
    title: 'A small shift this week · toward Aliveness',
    body: 'Move your daily decision about exercise from the morning to the night before. Decide tonight what tomorrow looks like — not in the morning, when your tired brain will negotiate it away.',
  },
  achievement: {
    title: 'A small shift this week · toward Achievement',
    body: 'Pick the one project that, if it moved, would make the rest of the week feel different. Block 90 minutes for it tomorrow morning — before email, before anything else.',
  },
  connection: {
    title: 'A small shift this week · toward Connection',
    body: 'Text one person you keep meaning to call. Not to schedule something — just to say the thing you would have said if they were in the room.',
  },
  enjoyment: {
    title: 'A small shift this week · toward Enjoyment',
    body: 'Put one thing on the calendar this week that has no purpose other than being good. Treat it as non-negotiable as a meeting.',
  },
  meaning: {
    title: 'A small shift this week · toward Meaning',
    body: 'At the end of each day this week, write one sentence: what did I do today that I would do again if I had the choice? Patterns surface in five days.',
  },
  contribution: {
    title: 'A small shift this week · toward Contribution',
    body: 'Find one small way to help someone where you cannot be paid back. Fifteen minutes. The size of the act is irrelevant — the unilateralness is the point.',
  },
  stability: {
    title: 'A small shift this week · toward Stability',
    body: 'Pick the one financial or logistical thing you keep avoiding because it feels heavier than it is. Spend 20 minutes on it tomorrow. The relief is usually disproportionate.',
  },
  autonomy: {
    title: 'A small shift this week · toward Autonomy',
    body: 'Find one recurring obligation you said yes to out of habit. This week, renegotiate it or drop it — even a small one. The muscle is in the choosing.',
  },
};

export function Paywall({ onBack, sampleValue }: Props) {
  const key = sampleValue ?? 'aliveness';
  const sample = SAMPLE_ACTIONS[key];

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

      {/* Sample action card */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 pt-5 pb-3 flex items-center gap-2">
          <ValueIcon value={key} size={16} />
          <p className="text-[11px] font-display uppercase tracking-widest text-accent">
            {sample.title}
          </p>
        </div>
        <p className="px-5 pb-4 text-sm md:text-base text-foreground/90 leading-relaxed font-body">
          {sample.body}
        </p>
        <div className="px-5 py-3 border-t border-border/60 bg-muted/30 flex items-center gap-2 text-xs text-muted-foreground font-display">
          <Lock size={12} />
          <span>Continue reading after unlock →</span>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground -mt-6">
        One sample, drawn from your top gap — {getValueByKey(key).label}.
      </p>

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
