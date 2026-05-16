import { VALUES, TIME_OPTIONS, MONEY_OPTIONS, type ValueKey, type BehaviourAnswer, type BehaviourOption } from './values';

export type Answer = 'A' | 'B';
export type Tier = 'warmup' | 'revealing' | 'hard' | 'hard-split';

export interface Scenario {
  id: string;                 // C1..C13
  index: number;              // 0..12
  tier: Tier;
  weight: number;
  prompt: string;
  optionA: { label: string; values: ValueKey[] }; // values = winners if chosen
  optionB: { label: string; values: ValueKey[] };
  split?: boolean;            // C12 only
  // Optional transition shown AFTER this scenario
  transitionAfter?: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'C1', index: 0, tier: 'warmup', weight: 1.0,
    prompt: "It's Friday night. You're tired after a heavy week. A friend invites you out.",
    optionA: { label: 'I stay in, sleep early, wake up rested tomorrow.', values: ['aliveness'] },
    optionB: { label: 'I go — rest I can recover, this moment I can\'t.', values: ['enjoyment'] },
  },
  {
    id: 'C2', index: 1, tier: 'warmup', weight: 1.0,
    prompt: 'You have an important deadline Monday. A family lunch you rarely get to attend just came up this weekend.',
    optionA: { label: 'I keep working — deliver well, no guilt.', values: ['achievement'] },
    optionB: { label: 'I go to the lunch — work will find a way, family won\'t wait.', values: ['connection'] },
  },
  {
    id: 'C3', index: 2, tier: 'warmup', weight: 1.0,
    prompt: "You got a job offer: 30% lower salary, but you'd be your own boss, with full control of your hours.",
    optionA: { label: 'I stay where I am — predictability gives me peace of mind.', values: ['stability'] },
    optionB: { label: 'I take it — control of my time matters more than financial safety right now.', values: ['autonomy'] },
  },
  {
    id: 'C4', index: 3, tier: 'warmup', weight: 1.0,
    prompt: "You're in a stable relationship, but you feel you need time alone to understand who you are outside of it.",
    optionA: { label: 'I stay — what we have is real and worth protecting.', values: ['connection'] },
    optionB: { label: 'I ask for space — I need to find myself before I can fully be with someone.', values: ['meaning'] },
    transitionAfter: 'The next ones get a little harder.',
  },
  {
    id: 'C5', index: 4, tier: 'revealing', weight: 1.5,
    prompt: "You can take on a project that will significantly accelerate your career — but it'll consume the time you'd reserved for the volunteer work you lead.",
    optionA: { label: 'I take the project — growing professionally opens doors to make bigger impact later.', values: ['achievement'] },
    optionB: { label: 'I keep the volunteer work — real impact now matters more than future potential.', values: ['contribution'] },
  },
  {
    id: 'C6', index: 5, tier: 'revealing', weight: 1.5,
    prompt: "You have $1,000 saved. You can spend it on a trip you've always wanted to take, or on a course that could change your career direction.",
    optionA: { label: 'The trip — life experiences shape me as much as qualifications do.', values: ['enjoyment'] },
    optionB: { label: 'The course — this money needs to work for my future right now.', values: ['meaning'] },
  },
  {
    id: 'C7', index: 6, tier: 'revealing', weight: 1.5,
    prompt: "You're in a peak productivity stretch on an important project. Your body is asking for rest, but stopping now breaks the rhythm.",
    optionA: { label: "I stop — my body isn't negotiable, the project can wait until tomorrow.", values: ['aliveness'] },
    optionB: { label: 'I keep going — this momentum is rare and the project matters.', values: ['achievement'] },
  },
  {
    id: 'C8', index: 7, tier: 'revealing', weight: 1.5,
    prompt: "Your partner wants to move in together. You really like them, but you know sharing a space will change your routine and your autonomy in ways you can't control.",
    optionA: { label: 'Keep separate apartments for now — I need my space to be who I am.', values: ['autonomy'] },
    optionB: { label: 'Move in — a real relationship requires giving up some space.', values: ['connection'] },
    transitionAfter: 'Almost at the hardest choices.',
  },
  {
    id: 'C9', index: 8, tier: 'hard', weight: 2.0,
    prompt: 'You witness an injustice at work. Reporting it could create real tension with leadership and affect your position.',
    optionA: { label: "I report it — staying silent in the face of injustice isn't a choice I can make.", values: ['contribution'] },
    optionB: { label: "I don't report it now — I need to protect myself before I can help anyone else.", values: ['stability'] },
  },
  {
    id: 'C10', index: 9, tier: 'hard', weight: 2.0,
    prompt: "You've found a cause you deeply believe in. Engaging with it seriously requires time and money you don't have to spare.",
    optionA: { label: "I get involved — meaning doesn't wait for the perfect moment.", values: ['meaning'] },
    optionB: { label: "I wait until my life stabilises — I can't give what I don't have.", values: ['stability'] },
  },
  {
    id: 'C11', index: 10, tier: 'hard', weight: 2.0,
    prompt: "A close family member is going through something hard and needs you. At the same time, you're in a decisive moment in your career — being absent now has a real cost.",
    optionA: { label: "I prioritise my family — careers can be rebuilt, trust can't always be.", values: ['connection'] },
    optionB: { label: "I prioritise my career right now — I'm more useful to everyone from a solid position.", values: ['achievement'] },
  },
  {
    id: 'C12', index: 11, tier: 'hard-split', weight: 1.0, split: true,
    prompt: 'You have the chance to spend 3 months doing exactly what you want — travel, reading, rest, no obligations. The cost: losing an important project that could define your professional trajectory.',
    optionA: { label: "I take the 3 months — a good life isn't postponed forever.", values: ['enjoyment', 'autonomy'] },
    optionB: { label: 'I stay on the project — building something that matters is what makes me feel alive.', values: ['achievement', 'meaning'] },
  },
  {
    id: 'C13', index: 12, tier: 'hard', weight: 2.0,
    prompt: "You're in an intense stretch on a project that genuinely matters to you. Your body has been sending clear signals for weeks: bad sleep, low energy, physical pain. Stopping to take care of your health now means slowing down something that has real meaning in your life.",
    optionA: { label: 'I stop to take care of myself — sustainable meaning requires a body that works.', values: ['aliveness'] },
    optionB: { label: 'I keep going — this project is a rare window, my body can hold on a bit longer.', values: ['meaning'] },
  },
];

export interface ScoreResult {
  raw: Record<ValueKey, number>;
  normalized: Record<ValueKey, number>;   // 0-100
  ranking: ValueKey[];                    // 8 entries, highest first
  revealed: {
    primary: ValueKey;
    secondary: ValueKey;
    tertiary: ValueKey;
    coPrimary?: ValueKey;
  };
}

const ZERO_SCORES = (): Record<ValueKey, number> => ({
  achievement: 0, connection: 0, aliveness: 0, enjoyment: 0,
  meaning: 0, contribution: 0, stability: 0, autonomy: 0,
});

export function computeScores(answers: Answer[]): ScoreResult {
  if (answers.length !== SCENARIOS.length) {
    throw new Error(`Expected ${SCENARIOS.length} answers, got ${answers.length}`);
  }

  const raw = ZERO_SCORES();

  for (const scenario of SCENARIOS) {
    const ans = answers[scenario.index];
    if (ans !== 'A' && ans !== 'B') {
      throw new Error(`Missing answer at scenario ${scenario.id}`);
    }
    const chosen = ans === 'A' ? scenario.optionA : scenario.optionB;
    // Split scenarios add the per-value weight to each value on the winning side.
    // Non-split scenarios award the scenario weight to the (single) value.
    for (const v of chosen.values) {
      raw[v] += scenario.weight;
    }
  }

  const normalized = ZERO_SCORES();
  for (const v of VALUES) {
    normalized[v.key] = Math.round((raw[v.key] / v.maxScore) * 100);
  }

  // Ranking with tiebreaker: highest-weight scenario where the value was chosen wins.
  const ranking = [...VALUES.map(v => v.key)].sort((a, b) => {
    if (normalized[b] !== normalized[a]) return normalized[b] - normalized[a];
    return highestWinningWeight(b, answers) - highestWinningWeight(a, answers);
  });

  const revealed: ScoreResult['revealed'] = {
    primary: ranking[0],
    secondary: ranking[1],
    tertiary: ranking[2],
  };

  // Co-primary if normalized scores AND tiebreaker weight are identical.
  if (
    normalized[ranking[0]] === normalized[ranking[1]] &&
    highestWinningWeight(ranking[0], answers) === highestWinningWeight(ranking[1], answers)
  ) {
    revealed.coPrimary = ranking[1];
  }

  return { raw, normalized, ranking, revealed };
}

function highestWinningWeight(key: ValueKey, answers: Answer[]): number {
  let max = 0;
  for (const s of SCENARIOS) {
    const chosen = answers[s.index] === 'A' ? s.optionA : s.optionB;
    if (chosen.values.includes(key) && s.weight > max) max = s.weight;
  }
  return max;
}

/**
 * Gap-reveal helper: given the user's aspirational top-N values, which ones
 * fell *outside* the algorithm's revealed top 3? Returns each with its
 * 1-based ranked position in the algorithm output.
 */
export function findAspirationalGaps(
  aspirational: ValueKey[],
  result: ScoreResult,
): { value: ValueKey; rank: number }[] {
  const topThree = new Set([result.revealed.primary, result.revealed.secondary, result.revealed.tertiary]);
  return aspirational
    .filter(v => !topThree.has(v))
    .map(v => ({ value: v, rank: result.ranking.indexOf(v) + 1 }))
    .filter(x => x.rank > 0);
}
