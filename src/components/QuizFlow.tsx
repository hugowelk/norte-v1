import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { HowItWorksSlide } from './quiz/HowItWorksSlide';
import { TradeoffScenario } from './quiz/TradeoffScenario';
import { TradeoffTransition } from './quiz/TradeoffTransition';
import { ValueResults } from './quiz/ValueResults';
import { CoreValuesSelection, type CoreValuesResult } from './quiz/CoreValuesSelection';
import { AlignmentReflection, type AlignmentScores } from './quiz/AlignmentReflection';
import { ValueCompass } from './quiz/ValueCompass';
import { Paywall } from './quiz/Paywall';

type Phase =
  | 'tradeoffIntro'
  | 'howItWorks'
  | 'tradeoffs'
  | 'tradeoffTransition'
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
  const [result, setResult] = useState<ScoreResult>();
  const [core, setCore] = useState<CoreValuesResult>();
  const [alignmentScores, setAlignmentScores] = useState<AlignmentScores>({});

  // Reset scroll whenever the visible step changes — without this each new
  // screen inherits the previous scroll position and feels glitchy.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [phase, scenarioIdx]);

  // Progress: rough estimate across the whole flow
  const totalSteps = 1 /*intro*/ + SCENARIOS.length + 4 /*results,core,align,compass*/;
  let completed = 0;
  if (phase === 'tradeoffIntro') completed = 0;
  else if (phase === 'tradeoffs' || phase === 'tradeoffTransition') completed = 1 + scenarioIdx;
  else if (phase === 'results') completed = 1 + SCENARIOS.length;
  else if (phase === 'coreValues') completed = 2 + SCENARIOS.length;
  else if (phase === 'alignment') completed = 3 + SCENARIOS.length;
  else if (phase === 'compass') completed = 4 + SCENARIOS.length;
  else if (phase === 'paywall') completed = totalSteps;
  const progress = Math.min(100, (completed / totalSteps) * 100);

  const handleTradeoffAnswer = (a: Answer) => {
    const next = [...tradeoffAnswers];
    next[scenarioIdx] = a;
    setTradeoffAnswers(next);
    const current = SCENARIOS[scenarioIdx];
    if (current.transitionAfter) {
      setPendingTransition(current.transitionAfter);
      setPhase('tradeoffTransition');
      return;
    }
    advanceTradeoff(next);
  };

  const advanceTradeoff = (answers: Answer[]) => {
    if (scenarioIdx < SCENARIOS.length - 1) {
      setScenarioIdx(scenarioIdx + 1);
      setPhase('tradeoffs');
    } else {
      const r = computeScores(answers);
      setResult(r);
      setPhase('results');
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

  const handleJump = (val: string) => {
    if (val === 'tradeoffIntro') { setScenarioIdx(0); setPhase('tradeoffIntro'); }
    else if (val === 'howItWorks') { setScenarioIdx(0); setPhase('howItWorks'); }
    else if (val.startsWith('tradeoff-')) {
      const idx = parseInt(val.replace('tradeoff-', ''), 10);
      setScenarioIdx(idx);
      setPhase('tradeoffs');
    }
    else if (val === 'results') { ensureResult(); setPhase('results'); }
    else if (val === 'coreValues') { ensureResult(); setPhase('coreValues'); }
    else if (val === 'alignment') {
      const r = ensureResult();
      const c = ensureCore(r);
      if (Object.keys(alignmentScores).length === 0) setAlignmentScores(mockAlignment(c.slots, r));
      setPhase('alignment');
    }
    else if (val === 'compass') {
      const r = ensureResult();
      const c = ensureCore(r);
      if (Object.keys(alignmentScores).length === 0) setAlignmentScores(mockAlignment(c.slots, r));
      setPhase('compass');
    }
    else if (val === 'paywall') { ensureResult(); setPhase('paywall'); }
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

      {/* Designer nav */}
      <div className="fixed top-3 right-4 z-[60]">
        <Select onValueChange={handleJump} value={phase === 'tradeoffs' ? `tradeoff-${scenarioIdx}` : phase}>
          <SelectTrigger className="w-44 h-8 text-xs bg-background/80 backdrop-blur border-border/60">
            <SelectValue placeholder="Jump to page…" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tradeoffIntro">1 · Trade-off Intro</SelectItem>
            <SelectItem value="howItWorks">1b · How it works</SelectItem>
            {SCENARIOS.map((s, i) => (
              <SelectItem key={s.id} value={`tradeoff-${i}`}>
                1.{i + 1} · {s.id}
              </SelectItem>
            ))}
            <SelectItem value="results">2 · Results</SelectItem>
            <SelectItem value="coreValues">3 · Core Values</SelectItem>
            <SelectItem value="alignment">4 · Alignment</SelectItem>
            <SelectItem value="compass">5 · Compass</SelectItem>
            <SelectItem value="paywall">6 · Paywall</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
              <TradeoffIntro onBegin={() => setPhase('howItWorks')} />
            )}
            {phase === 'howItWorks' && (
              <HowItWorksSlide onContinue={() => { setScenarioIdx(0); setPhase('tradeoffs'); }} />
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
                onComplete={r => { setCore(r); setPhase('alignment'); }}
              />
            )}
            {phase === 'alignment' && core && result && (
              <AlignmentReflection
                slots={core.slots}
                result={result}
                onComplete={s => { setAlignmentScores(s); setPhase('compass'); }}
              />
            )}
            {phase === 'compass' && core && result && (
              <ValueCompass
                result={result}
                slots={core.slots}
                alignmentScores={alignmentScores}
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
                    name: '',
                    current_chapter: '',
                    blocker_answer: null,
                    blocker_custom_text: '',
                    wont_give_up: '',
                    loudest_gap: loudest,
                    assessment: snapshot,
                  });
                  navigate('/post-paywall/q1');
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
