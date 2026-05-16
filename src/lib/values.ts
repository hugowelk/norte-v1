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
    longDescription: 'You care about how you feel — sleep, movement, energy, rest. Without aliveness, nothing else lands.',
    icon: Flame,
    maxScore: 4.5,
  },
  {
    key: 'enjoyment',
    label: 'Enjoyment',
    description: 'Pleasure, fun, the texture of a good day.',
    longDescription: 'Life is meant to be enjoyed in the moment. You make room for play, beauty, and small pleasures, not just productivity.',
    icon: Sparkles,
    maxScore: 3.5,
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
    longDescription: 'You measure a good life partly by what it gives back — to people, causes, or community. Helping is not a side activity.',
    icon: HandHeart,
    maxScore: 3.5,
  },
  {
    key: 'stability',
    label: 'Stability',
    description: 'Safety, predictability, solid ground.',
    longDescription: 'You build from a place of security. Knowing what to expect — financially, emotionally, structurally — is what frees you to act.',
    icon: Shield,
    maxScore: 5.0,
  },
  {
    key: 'autonomy',
    label: 'Autonomy',
    description: 'Owning your time and your choices.',
    longDescription: 'Independence is oxygen. You need control over your hours, your decisions, and the shape of your days.',
    icon: Feather,
    maxScore: 3.5,
  },
];

export function getValueByKey(key: ValueKey): Value {
  return VALUES.find(v => v.key === key)!;
}

// ============ Time / Money option catalogues (feed the behaviour narrative) ============

export interface BehaviourOption {
  label: string;
  // Which values this option is a behavioural signal *for* — used to build the
  // narrative on the Results page (not the scoring algorithm).
  signals: ValueKey[];
}

export const TIME_OPTIONS: BehaviourOption[] = [
  { label: 'Work & career',                       signals: ['achievement', 'meaning'] },
  { label: 'Family or partner',                   signals: ['connection'] },
  { label: 'Friends & social life',               signals: ['connection', 'enjoyment'] },
  { label: 'Health, sleep & exercise',            signals: ['aliveness'] },
  { label: 'Learning & self-development',         signals: ['meaning', 'achievement'] },
  { label: 'Hobbies, play & fun',                 signals: ['enjoyment', 'autonomy'] },
  { label: 'Community, volunteering, helping',    signals: ['contribution'] },
  { label: 'Solo time & personal space',          signals: ['autonomy'] },
  { label: 'Reflection or spiritual practice',    signals: ['meaning'] },
  { label: 'Rest & recovery',                     signals: ['aliveness', 'stability'] },
];

export const MONEY_OPTIONS: BehaviourOption[] = [
  { label: 'Travel & experiences',                signals: ['enjoyment', 'autonomy'] },
  { label: 'Lifestyle, comfort, going out',       signals: ['enjoyment'] },
  { label: 'Education & courses',                 signals: ['meaning', 'achievement'] },
  { label: 'Family support',                      signals: ['connection'] },
  { label: 'Investments & savings',               signals: ['stability'] },
  { label: 'Health, fitness, therapy',            signals: ['aliveness'] },
  { label: 'Donations & causes',                  signals: ['contribution'] },
  { label: 'Hobbies & creative projects',         signals: ['enjoyment', 'autonomy'] },
  { label: 'Home & living space',                 signals: ['stability', 'connection'] },
  { label: 'Tools that grow my work',             signals: ['achievement', 'meaning'] },
];

export interface BehaviourAnswer {
  selectedIndices: number[];
  custom: string[]; // free-text the user added
}

/**
 * Build a behaviour-grounded narrative paragraph for a single value, from the
 * user's time + money answers. Returns null if no signal is present.
 */
export function buildBehaviourNarrative(
  valueKey: ValueKey,
  time: BehaviourAnswer | undefined,
  money: BehaviourAnswer | undefined,
): string {
  const timeHits = (time?.selectedIndices ?? [])
    .map(i => TIME_OPTIONS[i])
    .filter(o => o && o.signals.includes(valueKey))
    .map(o => o.label.toLowerCase());

  const moneyHits = (money?.selectedIndices ?? [])
    .map(i => MONEY_OPTIONS[i])
    .filter(o => o && o.signals.includes(valueKey))
    .map(o => o.label.toLowerCase());

  const parts: string[] = [];
  if (timeHits.length) {
    parts.push(`your week tends to flow toward ${joinPhrase(timeHits)}`);
  }
  if (moneyHits.length) {
    parts.push(`your money has been going to ${joinPhrase(moneyHits)}`);
  }

  if (parts.length === 0) {
    return `Your time and money haven't pointed strongly at ${getValueByKey(valueKey).label} recently — but it still showed up in the trade-offs you made.`;
  }

  return `You've been prioritising ${getValueByKey(valueKey).label.toLowerCase()} — ${parts.join(', and ')}.`;
}

function joinPhrase(items: string[]): string {
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}
