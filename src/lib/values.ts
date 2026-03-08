export type ValueKey =
  | 'achievement'
  | 'relationships'
  | 'friendships'
  | 'health'
  | 'fun'
  | 'spirituality'
  | 'growth'
  | 'social_responsibility'
  | 'financial'
  | 'approval'
  | 'kindness'
  | 'freedom'
  | 'love'
  | 'forgiveness';

export interface Value {
  key: ValueKey;
  label: string;
  description: string;
  emoji: string;
}

export const VALUES: Value[] = [
  { key: 'achievement', label: 'Professional Achievement', description: 'Excelling in your career and accomplishing meaningful goals', emoji: '🏆' },
  { key: 'relationships', label: 'Relationships & Family', description: 'Deep connections with loved ones and family bonds', emoji: '👨‍👩‍👧‍👦' },
  { key: 'friendships', label: 'Friendships', description: 'Meaningful bonds with friends and community', emoji: '🤝' },
  { key: 'health', label: 'Physical Health', description: 'Taking care of your body and wellbeing', emoji: '💪' },
  { key: 'fun', label: 'Fun & Enjoyment', description: 'Experiencing joy, play, and pleasure in life', emoji: '🎉' },
  { key: 'spirituality', label: 'Spirituality', description: 'Connection to something greater than yourself', emoji: '🧘' },
  { key: 'growth', label: 'Personal Growth', description: 'Continuous learning and self-improvement', emoji: '🌱' },
  { key: 'social_responsibility', label: 'Social Responsibility', description: 'Contributing to society and helping others', emoji: '🌍' },
  { key: 'financial', label: 'Financial Success', description: 'Building wealth and financial security', emoji: '💰' },
  { key: 'approval', label: 'Approval from Others', description: 'Being recognised and valued by others', emoji: '👏' },
  { key: 'kindness', label: 'Kindness', description: 'Treating others with compassion and care', emoji: '💝' },
  { key: 'freedom', label: 'Personal Freedom', description: 'Independence and autonomy in your choices', emoji: '🦅' },
  { key: 'love', label: 'Love', description: 'Giving and receiving deep emotional connection', emoji: '❤️' },
  { key: 'forgiveness', label: 'Forgiveness', description: 'Letting go and offering grace to yourself and others', emoji: '🕊️' },
];

export function getValueByKey(key: ValueKey): Value {
  return VALUES.find(v => v.key === key)!;
}

export interface QuizQuestion {
  id: string;
  section: string;
  sectionTitle: string;
  sectionSubtitle: string;
  question: string;
  type: 'multi-select' | 'single-select' | 'forced-choice';
  maxSelections?: number;
  options: {
    label: string;
    scores: Partial<Record<ValueKey, number>>;
  }[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'time',
    section: 'time',
    sectionTitle: 'Time Reality',
    sectionSubtitle: 'How you spend your time reveals what you truly prioritise',
    question: 'Where does most of your time go during a typical week?',
    type: 'multi-select',
    maxSelections: 3,
    options: [
      { label: 'Work & career', scores: { achievement: 3, financial: 1 } },
      { label: 'Family or partner', scores: { relationships: 3, love: 2 } },
      { label: 'Friends', scores: { friendships: 3, fun: 1 } },
      { label: 'Health & exercise', scores: { health: 3 } },
      { label: 'Learning & self-development', scores: { growth: 3 } },
      { label: 'Hobbies & fun', scores: { fun: 3, freedom: 1 } },
      { label: 'Community & helping others', scores: { social_responsibility: 3, kindness: 1 } },
      { label: 'Spiritual or reflective practices', scores: { spirituality: 3 } },
    ],
  },
  {
    id: 'money',
    section: 'money',
    sectionTitle: 'Money Behaviour',
    sectionSubtitle: 'Where your money goes shows what you value in practice',
    question: 'Where did most of your discretionary spending go in the past year?',
    type: 'multi-select',
    maxSelections: 3,
    options: [
      { label: 'Travel & experiences', scores: { fun: 2, freedom: 2 } },
      { label: 'Lifestyle & comfort', scores: { fun: 1, approval: 1, financial: 1 } },
      { label: 'Education & courses', scores: { growth: 3 } },
      { label: 'Family support', scores: { relationships: 2, love: 2, kindness: 1 } },
      { label: 'Investments & savings', scores: { financial: 3 } },
      { label: 'Social activities', scores: { friendships: 2, fun: 1 } },
      { label: 'Health & fitness', scores: { health: 3 } },
      { label: 'Donations & helping others', scores: { social_responsibility: 3, kindness: 2 } },
    ],
  },
  {
    id: 'tradeoff1',
    section: 'tradeoffs',
    sectionTitle: 'Trade-off Decisions',
    sectionSubtitle: 'When values conflict, your choice reveals what matters most',
    question: 'Which would you choose?',
    type: 'forced-choice',
    options: [
      { label: 'Higher salary but more stress', scores: { financial: 3, achievement: 2 } },
      { label: 'Lower salary but more freedom', scores: { freedom: 3, health: 1 } },
    ],
  },
  {
    id: 'tradeoff2',
    section: 'tradeoffs',
    sectionTitle: 'Trade-off Decisions',
    sectionSubtitle: 'When values conflict, your choice reveals what matters most',
    question: 'Which would you choose?',
    type: 'forced-choice',
    options: [
      { label: 'A prestigious role with long hours', scores: { achievement: 3, approval: 2 } },
      { label: 'A flexible role with more family time', scores: { relationships: 3, freedom: 2 } },
    ],
  },
  {
    id: 'tradeoff3',
    section: 'tradeoffs',
    sectionTitle: 'Trade-off Decisions',
    sectionSubtitle: 'When values conflict, your choice reveals what matters most',
    question: 'Which would you choose?',
    type: 'forced-choice',
    options: [
      { label: 'A chance to help many people but sacrifice personal goals', scores: { social_responsibility: 3, kindness: 2 } },
      { label: 'Pursue your own dream even if it benefits fewer people', scores: { freedom: 2, growth: 2, achievement: 1 } },
    ],
  },
  {
    id: 'pride',
    section: 'pride',
    sectionTitle: 'Moments of Pride',
    sectionSubtitle: 'What makes you proud reveals your deepest values',
    question: 'What moments make you most proud?',
    type: 'multi-select',
    maxSelections: 2,
    options: [
      { label: 'Achieving something difficult', scores: { achievement: 3 } },
      { label: 'Supporting someone I care about', scores: { relationships: 2, kindness: 2, love: 1 } },
      { label: 'Learning something new', scores: { growth: 3 } },
      { label: 'Financial stability', scores: { financial: 3 } },
      { label: 'Standing up for something important', scores: { social_responsibility: 2, freedom: 2 } },
      { label: 'Helping others succeed', scores: { kindness: 3, social_responsibility: 1 } },
    ],
  },
  {
    id: 'regret',
    section: 'regret',
    sectionTitle: 'Patterns of Regret',
    sectionSubtitle: 'What you regret reveals what you wish you valued more',
    question: 'What do you regret most in the past five years?',
    type: 'multi-select',
    maxSelections: 2,
    options: [
      { label: 'Working too much', scores: { relationships: 2, fun: 2, health: 1 } },
      { label: 'Not taking risks', scores: { freedom: 2, growth: 2 } },
      { label: 'Neglecting relationships', scores: { relationships: 3, love: 2 } },
      { label: 'Ignoring my health', scores: { health: 3 } },
      { label: 'Not learning enough', scores: { growth: 3 } },
      { label: 'Not contributing more', scores: { social_responsibility: 3, kindness: 1 } },
    ],
  },
  {
    id: 'triggers',
    section: 'triggers',
    sectionTitle: 'Emotional Triggers',
    sectionSubtitle: 'What bothers you reveals what you believe matters',
    question: 'What behaviours bother you most in others?',
    type: 'multi-select',
    maxSelections: 2,
    options: [
      { label: 'Dishonesty', scores: { forgiveness: 1, relationships: 1, love: 1 } },
      { label: 'Selfishness', scores: { kindness: 3, social_responsibility: 1 } },
      { label: 'Laziness', scores: { achievement: 2, growth: 1 } },
      { label: 'Lack of ambition', scores: { achievement: 2, growth: 2 } },
      { label: 'Disrespect', scores: { relationships: 2, approval: 1 } },
      { label: 'Intolerance', scores: { forgiveness: 2, kindness: 2, social_responsibility: 1 } },
    ],
  },
];

export type QuizAnswers = Record<string, number[]>;

export function calculateValueScores(answers: QuizAnswers): Record<ValueKey, number> {
  const scores: Record<ValueKey, number> = {
    achievement: 0, relationships: 0, friendships: 0, health: 0,
    fun: 0, spirituality: 0, growth: 0, social_responsibility: 0,
    financial: 0, approval: 0, kindness: 0, freedom: 0, love: 0, forgiveness: 0,
  };

  for (const [questionId, selectedIndices] of Object.entries(answers)) {
    const question = QUIZ_QUESTIONS.find(q => q.id === questionId);
    if (!question) continue;
    for (const idx of selectedIndices) {
      const option = question.options[idx];
      if (!option) continue;
      for (const [key, val] of Object.entries(option.scores)) {
        scores[key as ValueKey] += val;
      }
    }
  }

  return scores;
}

export function getTopValues(scores: Record<ValueKey, number>, count: number = 5): ValueKey[] {
  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([key]) => key as ValueKey);
}
