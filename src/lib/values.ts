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
  // Weighted contribution to value scores (per Norte algorithm v2)
  weights: Array<[ValueKey, number]>;
}

// Helper: derive narrative signals from weights (any value that gets any weight)
export function signalsOf(option: BehaviourOption): ValueKey[] {
  return option.weights.map(([k]) => k);
}

export const TIME_OPTIONS: BehaviourOption[] = [
  { label: 'Work & career',                       weights: [['achievement', 1.0]] },
  { label: 'Family or partner',                   weights: [['connection', 1.0]] },
  { label: 'Friends & social life',               weights: [['connection', 0.5], ['enjoyment', 0.5]] },
  { label: 'Health, sleep & exercise',            weights: [['aliveness', 1.0]] },
  { label: 'Learning & self-development',         weights: [['meaning', 0.5], ['achievement', 0.5]] },
  { label: 'Hobbies, play & fun',                 weights: [['enjoyment', 1.0]] },
  { label: 'Community, volunteering, helping',    weights: [['contribution', 1.0]] },
  { label: 'Solo time & personal space',          weights: [['autonomy', 1.0]] },
  { label: 'Reflection or spiritual practice',    weights: [['meaning', 1.0]] },
  { label: 'Rest & recovery',                     weights: [['aliveness', 1.0]] },
];

export const MONEY_OPTIONS: BehaviourOption[] = [
  { label: 'Travel & experiences',                weights: [['enjoyment', 0.5], ['autonomy', 0.5]] },
  { label: 'Lifestyle, comfort, going out',       weights: [['enjoyment', 1.0]] },
  { label: 'Education & courses',                 weights: [['meaning', 0.5], ['achievement', 0.5]] },
  { label: 'Family support',                      weights: [['connection', 1.0]] },
  { label: 'Investments & savings',               weights: [['stability', 1.0]] },
  { label: 'Health, fitness, therapy',            weights: [['aliveness', 1.0]] },
  { label: 'Donations & causes',                  weights: [['contribution', 1.0]] },
  { label: 'Hobbies & creative projects',         weights: [['enjoyment', 0.5], ['meaning', 0.5]] },
  { label: 'Home & living space',                 weights: [['stability', 0.5], ['connection', 0.5]] },
  { label: 'Tools that grow my work',             weights: [['achievement', 1.0]] },
];

export interface BehaviourAnswer {
  selectedIndices: number[];
  custom: string[]; // free-text the user added (deprecated — no longer scored)
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
