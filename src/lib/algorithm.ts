import { VALUES, type ValueKey } from './values';

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
    prompt: "It's Friday night. You're worn out from the week. A friend texts asking if you want to come over for dinner and drinks.",
    optionA: { label: 'I stay in. Sleep tonight, energy tomorrow.', values: ['aliveness'] },
    optionB: { label: "I go. Rest can wait, this evening can't.", values: ['enjoyment'] },
  },
  {
    id: 'C2', index: 1, tier: 'warmup', weight: 1.0,
    prompt: "You've been training hard for something that matters to you. A close friend you rarely see is in town this weekend and wants to spend time together. Sticking to your training plan means seeing them briefly, if at all.",
    optionA: { label: "I stick to the plan. Showing up for myself isn't optional.", values: ['achievement'] },
    optionB: { label: "I clear the weekend. People I care about don't pass through often.", values: ['connection'] },
  },
  {
    id: 'C3', index: 2, tier: 'warmup', weight: 1.0,
    prompt: "You're offered an arrangement that would give you full control over your time and how you spend your days. The catch: less reliable income, no clear safety net.",
    optionA: { label: 'I stay with what I have. Peace of mind is worth more than the upside.', values: ['stability'] },
    optionB: { label: 'I take it. Owning my time matters more than the cushion right now.', values: ['autonomy'] },
  },
  {
    id: 'C4', index: 3, tier: 'warmup', weight: 1.0,
    prompt: "You're in a relationship that works. But something in you keeps asking what you'd be like outside of it, whether parts of you are still in there.",
    optionA: { label: 'I stay. What we have is real. The questions can be answered together.', values: ['connection'] },
    optionB: { label: 'I ask for space. I need to know who I am before I can fully be with someone.', values: ['meaning'] },
    transitionAfter: 'The next ones get a little harder.',
  },
  {
    id: 'C5', index: 4, tier: 'revealing', weight: 1.5,
    prompt: "You can take on something that would meaningfully accelerate a personal goal you've been chasing for years. Doing it well means stepping back from a community group where people count on you.",
    optionA: { label: "I take it. Hitting this matters to me and I've waited long enough.", values: ['achievement'] },
    optionB: { label: "I stay with the group. People are counting on me now and that's not interchangeable.", values: ['contribution'] },
  },
  {
    id: 'C6', index: 5, tier: 'revealing', weight: 1.5,
    prompt: "You have a chunk of money you didn't expect. Enough for a trip you've been dreaming about, or enough to fund something you actually believe in.",
    optionA: { label: "The trip. Time I won't get back, in a body that won't always do this.", values: ['enjoyment'] },
    optionB: { label: 'The cause. Money does more there than it does on a beach.', values: ['meaning'] },
  },
  {
    id: 'C7', index: 6, tier: 'revealing', weight: 1.5,
    prompt: "You're deep in a stretch where everything is clicking. Sleep has been thin, your back hurts, but you're producing the best work of your year. Stopping now breaks the spell.",
    optionA: { label: "I stop. The body isn't a negotiating partner.", values: ['aliveness'] },
    optionB: { label: 'I keep going. This kind of flow is rare and the work is worth it.', values: ['achievement'] },
  },
  {
    id: 'C8', index: 7, tier: 'revealing', weight: 1.5,
    prompt: "Your partner suggests moving in together. You want this with them. You also know your routines, your space, your way of being alone will change in ways you can't preview.",
    optionA: { label: 'I ask to wait. I need my own space to keep being myself.', values: ['autonomy'] },
    optionB: { label: 'I say yes. Building a life with someone means giving up some of the room you had.', values: ['connection'] },
  },
  {
    id: 'C14', index: 8, tier: 'hard', weight: 2.0,
    prompt: "A neighbour you barely know is going through a rough stretch and has started leaning on you, hard. Errands, late-night calls, small favours that aren't small anymore. Pulling back means leaving them more alone. Not pulling back means losing real chunks of your week.",
    optionA: { label: "I keep showing up. Walking away from someone who needs help isn't the person I want to be.", values: ['contribution'] },
    optionB: { label: "I pull back. I can't be the safety net for someone if I lose myself doing it.", values: ['autonomy'] },
  },
  {
    id: 'C15', index: 9, tier: 'revealing', weight: 1.5,
    prompt: "You've been saving methodically for a long time. Something you've always wanted to do becomes possible right now, this season, and it would cost most of what you've put aside.",
    optionA: { label: 'I do it. The cushion exists to be spent on a life, not just kept for a rainy day.', values: ['enjoyment'] },
    optionB: { label: 'I let it pass. The peace of having that money there is worth more than any one experience.', values: ['stability'] },
    transitionAfter: 'Almost at the hardest choices.',
  },
  {
    id: 'C9', index: 10, tier: 'hard', weight: 2.0,
    prompt: 'You witness something wrong happening in a place you depend on. Speaking up will create real friction and might cost you your standing there.',
    optionA: { label: "I speak up. Staying quiet about this isn't a version of me I can live with.", values: ['contribution'] },
    optionB: { label: "I stay quiet for now. I can't help anyone from a worse position than this.", values: ['stability'] },
  },
  {
    id: 'C10', index: 11, tier: 'hard', weight: 2.0,
    prompt: "You've found something that matters to you in a way nothing has for years. Going deep into it requires time and money you don't actually have.",
    optionA: { label: "I go in anyway. Meaning doesn't wait for the right conditions.", values: ['meaning'] },
    optionB: { label: "I wait until I have margin. I can't pour from an empty cup.", values: ['stability'] },
  },
  {
    id: 'C11', index: 12, tier: 'hard', weight: 2.0,
    prompt: "A close family member is going through something serious and they need you present. At the same time, you're in a defining stretch of a long-term goal, disappearing now has a real cost.",
    optionA: { label: "I show up for them. Goals can be rebuilt. Trust often can't.", values: ['connection'] },
    optionB: { label: 'I stay focused. Being absent for a season now lets me show up better later.', values: ['achievement'] },
  },
  {
    id: 'C12', index: 13, tier: 'hard-split', weight: 1.0, split: true,
    prompt: "You're offered three open months. No schedule, no obligations. Travel, read, rest, follow what catches you. The cost: walking away from something you've been building that could mark a turning point.",
    optionA: { label: "I take the three months. A good life isn't deferred forever.", values: ['enjoyment', 'autonomy'] },
    optionB: { label: 'I stay with what I am building. The thing that gives me a reason to get up is the thing worth finishing.', values: ['achievement', 'meaning'] },
  },
  {
    id: 'C13', index: 14, tier: 'hard', weight: 2.0,
    prompt: "You're inside something that genuinely matters to you. Your body has been waving red flags for weeks: bad sleep, low energy, pain that doesn't pass. Slowing down to handle it pauses something you've been waiting years to be inside of.",
    optionA: { label: "I slow down and take care of it. There's no version of this that works without a body that works.", values: ['aliveness'] },
    optionB: { label: 'I push through. This window is rare and my body has held up for less.', values: ['meaning'] },
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

export const MAX_SCORES: Record<ValueKey, number> = (() => {
  const m = ZERO_SCORES();
  for (const v of VALUES) m[v.key] = v.maxScore;
  return m;
})();

export function computeScores(answers: Answer[]): ScoreResult {
  if (answers.length !== SCENARIOS.length) {
    throw new Error(`Expected ${SCENARIOS.length} answers, got ${answers.length}`);
  }

  const raw = ZERO_SCORES();

  // Scenario answers
  for (const scenario of SCENARIOS) {
    const ans = answers[scenario.index];
    if (ans !== 'A' && ans !== 'B') {
      throw new Error(`Missing answer at scenario ${scenario.id}`);
    }
    const chosen = ans === 'A' ? scenario.optionA : scenario.optionB;
    for (const v of chosen.values) {
      raw[v] += scenario.weight;
    }
  }

  const normalized = ZERO_SCORES();
  for (const v of VALUES) {
    normalized[v.key] = Math.round((raw[v.key] / MAX_SCORES[v.key]) * 100);
  }

  const ranking = [...VALUES.map(v => v.key)].sort((a, b) => {
    if (normalized[b] !== normalized[a]) return normalized[b] - normalized[a];
    return highestWinningWeight(b, answers) - highestWinningWeight(a, answers);
  });

  const revealed: ScoreResult['revealed'] = {
    primary: ranking[0],
    secondary: ranking[1],
    tertiary: ranking[2],
  };

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
