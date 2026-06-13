import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SCENARIOS, computeScores, findAspirationalGaps, type Answer, type ScoreResult } from '@/lib/algorithm';
import { VALUES, getValueByKey, type ValueKey } from '@/lib/values';
import { writePostPaywall, genPaymentSessionId, type AssessmentSnapshot, type LoudestGap } from '@/lib/postPaywallStore';

// Mock data for designer preview when jumping past the quiz
const MOCK_ANSWERS: Answer[] = SCENARIOS.map((_, i) => (i % 2 === 0 ? 'A' : 'B'));
function mockResult(): ScoreResult { return computeScores(MOCK_ANSWERS); }
function mockCore(result: ScoreResult): { slots: { kind: 'core'; key: ValueKey }[] } {
  const keys = [result.ranking[0], result.ranking[1], result.ranking[2]];
  return { slots: keys.map(key => ({ kind: 'core' as const, key })) };
}
function mockAlignment(slots: { key: ValueKey }[], result: ScoreResult): Record<string, number> {
  const out: Record<string, number> = {};
  const allKeys = new Set<ValueKey>([...slots.map(s => s.key), ...VALUES.slice(0, 3).map(v => v.key)]);
  allKeys.forEach(k => { out[k] = Math.round((result.normalized[k] ?? 50) * 0.6); });
  return out;
}
import { TradeoffIntro } from './quiz/TradeoffIntro';
import { ChapterSelection } from './quiz/ChapterSelection';

import { TradeoffScenario } from './quiz/TradeoffScenario';
import { TradeoffTransition } from './quiz/TradeoffTransition';
import { ProcessingTransition } from './quiz/ProcessingTransition';
import { ValueResults } from './quiz/ValueResults';
import { CoreValuesSelection, type CoreValuesResult } from './quiz/CoreValuesSelection';
import { ValueCompass } from './quiz/ValueCompass';
import { Paywall } from './quiz/Paywall';
import { NameEmailCapture } from './quiz/NameEmailCapture';

type Phase =
  | 'chapter'
  | 'tradeoffIntro'
  | 'tradeoffs'
  | 'tradeoffTransition'
  | 'nameEmail'
  | 'processing'
  | 'results'
  | 'coreValues'
  | 'alignment'
  | 'compass'
  | 'paywall';

const pageVariants = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export function QuizFlow() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('tradeoffIntro');
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [pendingTransition, setPendingTransition] = useState<string | null>(null);

  const [tradeoffAnswers, setTradeoffAnswers] = useState<Answer[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<ScoreResult>();
  const [core, setCore] = useState<CoreValuesResult>();

  // Reset scroll whenever the visible step changes — without this each new
  // screen inherits the previous scroll position and feels glitchy.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [phase, scenarioIdx]);

  // Progress: rough estimate across the whole flow
  const totalSteps = 1 /*intro*/ + SCENARIOS.length + 1 /*nameEmail*/ + 4 /*results,core,align,compass*/;
  let completed = 0;
  if (phase === 'tradeoffIntro') completed = 0;
  else if (phase === 'tradeoffs' || phase === 'tradeoffTransition') completed = 1 + scenarioIdx;
  else if (phase === 'nameEmail') completed = 1 + SCENARIOS.length;
  else if (phase === 'results') completed = 2 + SCENARIOS.length;
  else if (phase === 'coreValues') completed = 3 + SCENARIOS.length;
  else if (phase === 'alignment') completed = 4 + SCENARIOS.length;
  else if (phase === 'compass') completed = 5 + SCENARIOS.length;
  else if (phase === 'paywall') completed = totalSteps;
  const progress = Math.min(100, (completed / totalSteps) * 100);

  const handleTradeoffAnswer = (a: Answer) => {
    const next = [...tradeoffAnswers];
    next[scenarioIdx] = a;
    setTradeoffAnswers(next);
    advanceTradeoff(next);

  };

  const advanceTradeoff = (answers: Answer[]) => {
    if (scenarioIdx < SCENARIOS.length - 1) {
      setScenarioIdx(scenarioIdx + 1);
      setPhase('tradeoffs');
    } else {
      const r = computeScores(answers);
      setResult(r);
      setPhase('nameEmail');
    }
  };

  const handleTransitionContinue = () => {
    setPendingTransition(null);
    advanceTradeoff(tradeoffAnswers);
  };

  const showBack = (phase === 'coreValues');

  const handleBack = () => {
    if (phase === 'coreValues') setPhase('results');
  };

  const ensureResult = (): ScoreResult => {
    if (result) return result;
    const r = mockResult();
    setResult(r);
    if (tradeoffAnswers.length === 0) setTradeoffAnswers(MOCK_ANSWERS);
    return r;
  };
  const ensureCore = (r: ScoreResult) => {
    if (core) return core;
    const c = mockCore(r);
    setCore(c);
    return c;
  };




  return (
    <div className="min-h-screen bg-background flex flex-col">
      {phase !== 'paywall' && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-1.5 bg-secondary">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      )}


      {showBack && (
        <button
          onClick={handleBack}
          className="fixed top-6 left-6 z-50 text-muted-foreground hover:text-foreground transition-colors text-sm font-display flex items-center gap-1"
        >
          ← Back
        </button>
      )}

      <div className="flex-1 flex items-start md:items-center justify-center px-4 py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase === 'tradeoffs' ? `t-${scenarioIdx}` : phase}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full max-w-2xl"
          >
            {phase === 'tradeoffIntro' && (
              <TradeoffIntro onBegin={() => { setScenarioIdx(0); setPhase('tradeoffs'); }} />
            )}
            {phase === 'tradeoffs' && (
              <TradeoffScenario
                scenario={SCENARIOS[scenarioIdx]}
                onAnswer={handleTradeoffAnswer}
              />
            )}
            {phase === 'tradeoffTransition' && pendingTransition && (
              <TradeoffTransition message={pendingTransition} onContinue={handleTransitionContinue} />
            )}
            {phase === 'nameEmail' && (
              <NameEmailCapture
                initialName={name}
                initialEmail={email}
                onContinue={(n, e) => { setName(n); setEmail(e); setPhase('processing'); }}
              />
            )}
            {phase === 'processing' && (
              <ProcessingTransition onComplete={() => setPhase('results')} />
            )}
            {phase === 'results' && result && (
              <ValueResults
                result={result}
                answers={tradeoffAnswers}
                onContinue={() => setPhase('coreValues')}
              />
            )}
            {phase === 'coreValues' && result && (
              <CoreValuesSelection
                revealedTop3={[result.revealed.primary, result.revealed.secondary, result.revealed.tertiary]}
                onComplete={r => { setCore(r); setPhase('compass'); }}
              />
            )}
            {phase === 'compass' && core && result && (
              <ValueCompass
                result={result}
                slots={core.slots}
                onContinue={() => setPhase('paywall')}
              />
            )}
            {phase === 'paywall' && (
              <Paywall
                onBack={() => setPhase('compass')}
                sampleValue={(() => {
                  if (!core || !result) return undefined;
                  const top3 = new Set([result.revealed.primary, result.revealed.secondary, result.revealed.tertiary]);
                  const firstGap = core.slots.map(s => s.key).find(k => !top3.has(k));
                  return firstGap ?? result.revealed.primary;
                })()}
                onUnlock={() => {
                  const r = result ?? mockResult();
                  const c = core ?? mockCore(r);
                  const aspirational = c.slots.map(s => s.key);
                  const top3: ValueKey[] = [r.revealed.primary, r.revealed.secondary, r.revealed.tertiary];
                  const gaps = findAspirationalGaps(aspirational, r);
                  let loudest: LoudestGap | null = null;
                  if (gaps.length > 0) {
                    loudest = { value: gaps[0].value, label: getValueByKey(gaps[0].value).label, isFallback: false };
                  } else if (aspirational.length > 0) {
                    loudest = { value: aspirational[0], label: getValueByKey(aspirational[0]).label, isFallback: true };
                  }
                  const snapshot: AssessmentSnapshot = {
                    revealed_top_3: top3,
                    revealed_full_ranking: r.ranking,
                    aspirational_top_3: aspirational,
                    loudest_gap: gaps[0]
                      ? { value: gaps[0].value, aspirational_rank: aspirational.indexOf(gaps[0].value) + 1, revealed_rank: gaps[0].rank }
                      : null,
                    other_gaps: gaps.slice(1).map(g => ({
                      value: g.value,
                      aspirational_rank: aspirational.indexOf(g.value) + 1,
                      revealed_rank: g.rank,
                    })),
                  };
                  writePostPaywall({
                    paymentSessionId: genPaymentSessionId(),
                    name,
                    email,
                    current_chapter: '',
                    blocker_answer: null,
                    blocker_custom_text: '',
                    wont_give_up: '',
                    loudest_gap: loudest,
                    assessment: snapshot,
                  });
                  navigate('/post-paywall/q2');
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
