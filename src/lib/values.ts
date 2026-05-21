import {
  Trophy, Users, Flame, Sparkles, Compass, HandHeart, Shield, Feather,
  type LucideIcon,
} from 'lucide-react';

export type ValueKey =
  | 'achievement'
  | 'connection'
  | 'aliveness'
  | 'enjoyment'
  | 'meaning'
  | 'contribution'
  | 'stability'
  | 'autonomy';

export interface Value {
  key: ValueKey;
  label: string;
  description: string;       // short
  longDescription: string;   // shown in accordion
  icon: LucideIcon;
  maxScore: number;          // per the Norte algorithm
}

export const VALUES: Value[] = [
  {
    key: 'achievement',
    label: 'Achievement',
    description: 'Building, accomplishing, leaving a mark.',
    longDescription: 'You feel most alive when you are making progress, pushing yourself, and getting things done. Recognition for what you build matters to you.',
    icon: Trophy,
    maxScore: 7.0,
  },
  {
    key: 'connection',
    label: 'Connection',
    description: 'Closeness with the people who matter.',
    longDescription: 'Relationships are the thread your life runs on. Time with family, partner, or close friends is non-negotiable to you.',
    icon: Users,
    maxScore: 5.5,
  },
  {
    key: 'aliveness',
    label: 'Aliveness',
    description: 'Energy, health, presence in your own body.',
    longDescription: 'You care about how you feel (sleep, movement, energy, rest). Without aliveness, nothing else lands.',
    icon: Flame,
    maxScore: 4.5,
  },
  {
    key: 'enjoyment',
    label: 'Enjoyment',
    description: 'Pleasure, fun, the texture of a good day.',
    longDescription: 'Life is meant to be enjoyed in the moment. You make room for play, beauty, and small pleasures, not just productivity.',
    icon: Sparkles,
    maxScore: 5.0,
  },
  {
    key: 'meaning',
    label: 'Meaning',
    description: 'A life that points at something bigger.',
    longDescription: 'You want what you do to matter beyond today. Purpose, depth, and significance pull you forward more than comfort does.',
    icon: Compass,
    maxScore: 7.5,
  },
  {
    key: 'contribution',
    label: 'Contribution',
    description: 'Making things better for others.',
    longDescription: 'You measure a good life partly by what it gives back, to people, causes, or community. Helping is not a side activity.',
    icon: HandHeart,
    maxScore: 5.5,
  },
  {
    key: 'stability',
    label: 'Stability',
    description: 'Safety, predictability, solid ground.',
    longDescription: 'You build from a place of security. Knowing what to expect (financially, emotionally, structurally) is what frees you to act.',
    icon: Shield,
    maxScore: 6.5,
  },
  {
    key: 'autonomy',
    label: 'Autonomy',
    description: 'Owning your time and your choices.',
    longDescription: 'Independence is oxygen. You need control over your hours, your decisions, and the shape of your days.',
    icon: Feather,
    maxScore: 5.0,
  },
];

export function getValueByKey(key: ValueKey): Value {
  return VALUES.find(v => v.key === key)!;
}

