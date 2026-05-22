import { motion } from 'framer-motion';
import { useState } from 'react';
import { Sparkles, Compass, Target, MessageCircle, Lock, Check, Share2 } from 'lucide-react';
import { type ValueKey, getValueByKey } from '@/lib/values';
import { ValueIcon } from '../ValueIcon';

interface Props {
  onBack: () => void;
  onUnlock: () => void;
  sampleValue?: ValueKey;
}

const SAMPLE_ACTIONS: Record<ValueKey, { title: string; body: string }> = {
  aliveness: {
    title: 'A small shift this week · toward Aliveness',
    body: 'Move your daily decision about exercise from the morning to the night before. Decide tonight what tomorrow looks like, not in the morning, when your tired brain will negotiate it away.',
  },
  achievement: {
    title: 'A small shift this week · toward Achievement',
    body: 'Pick the one project that, if it moved, would make the rest of the week feel different. Block 90 minutes for it tomorrow morning, before email, before anything else.',
  },
  connection: {
    title: 'A small shift this week · toward Connection',
    body: 'Text one person you keep meaning to call. Not to schedule something. Just to say the thing you would have said if they were in the room.',
  },
  enjoyment: {
    title: 'A small shift this week · toward Enjoyment',
    body: 'Put one thing on the calendar this week that has no purpose other than being good. Treat it as non-negotiable as a meeting.',
  },
  meaning: {
    title: 'A small shift this week · toward Meaning',
    body: 'At the end of each day this week, write one sentence: what did I do today that I would do again if I had the choice? This ',
  },
  contribution: {
    title: 'A small shift this week · toward Contribution',
    body: 'Find one small way to help someone where you cannot be paid back. Fifteen minutes. The size of the act is irrelevant. The unilateralness is the point.',
  },
  stability: {
    title: 'A small shift this week · toward Stability',
    body: 'Pick the one financial or logistical thing you keep avoiding because it feels heavier than it is. Spend 20 minutes on it tomorrow. The relief is usually disproportionate.',
  },
  autonomy: {
    title: 'A small shift this week · toward Autonomy',
    body: 'Find one recurring obligation you said yes to out of habit. This week, renegotiate it or drop it, even a small one. The muscle is in the choosing.',
  },
};

export function Paywall({ onBack, onUnlock, sampleValue }: Props) {
  const key = sampleValue ?? 'aliveness';
  const sample = SAMPLE_ACTIONS[key];
  const [copied, setCopied] = useState(false);

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
          You've seen what's been driving your week, and where you want it to be heading. The next step is understanding your gaps and making the small shifts that close the distance.
        </p>
      </div>

      <div className="rounded-2xl border border-primary/30 bg-card overflow-hidden shadow-sm">
        <div className="px-6 py-5 bg-primary/5 border-b border-primary/20 flex items-baseline justify-between gap-4 flex-wrap">
          <p className="text-xs font-display uppercase tracking-widest text-primary">Your Full Values Report</p>
          <p className="font-display text-sm text-foreground flex items-center gap-2">
            <span className="relative inline-block">
              <span className="font-semibold">$9</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
                style={{ transformOrigin: 'left' }}
                className="absolute left-0 right-0 top-1/2 h-[2px] bg-foreground"
              />
            </span>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, type: 'spring', stiffness: 300 }}
              className="px-2 py-0.5 rounded-full bg-[hsl(20,90%,55%)] text-white text-[11px] font-display font-bold uppercase tracking-wider"
            >
              Free
            </motion.span>
          </p>
        </div>
        <ul className="px-6 py-5 space-y-4">
          <Bullet icon={Target} title="The next steps">
            Norte can guide you through your compass. Get 3 actionable steps you can start this week to help you designing the life you actually want.
          </Bullet>
          <Bullet icon={MessageCircle} title="A real conversation, not a checklist">
            Norte's AI guide works through your compass with you, asking the questions a thoughtful friend would, and helping you design shifts that fit the life you actually have.
          </Bullet>
          <Bullet icon={Sparkles} title="Yours to keep">
            Export your plan, revisit it, share it with someone who knows you.
          </Bullet>
        </ul>
      </div>


      <button
        onClick={onUnlock}
        className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-base hover:opacity-90 transition-opacity shadow-md"
      >
        Get my FREE Full Values Report →
      </button>
      <div className="flex items-center justify-center gap-6 text-sm font-display">
        <button
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Maybe later
        </button>
        <span className="text-border">·</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText('findyourvalues.app');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? <Check size={14} /> : <Share2 size={14} />}
          {copied ? 'Link copied' : 'Share Norte with a friend'}
        </button>
      </div>
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
