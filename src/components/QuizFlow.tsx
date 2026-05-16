import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Heart, Users as UsersIcon, HeartPulse, BookOpen, Gamepad2, HandHeart as HandHeartIcon,
  Moon, Sparkles as SparklesIcon, Bed,
  Plane, ShoppingBag, GraduationCap, Home, PiggyBank, Activity, Gift, Palette, Sofa, Wrench,
} from 'lucide-react';
import {
  TIME_OPTIONS, MONEY_OPTIONS, type BehaviourAnswer,
} from '@/lib/values';
import { SCENARIOS, computeScores, type Answer, type ScoreResult } from '@/lib/algorithm';
import { BehaviourQuiz } from './quiz/BehaviourQuiz';
import { TradeoffIntro } from './quiz/TradeoffIntro';
import { TradeoffScenario } from './quiz/TradeoffScenario';
import { TradeoffTransition } from './quiz/TradeoffTransition';
import { ValueResults } from './quiz/ValueResults';
import { CoreValuesSelection, type CoreValuesResult } from './quiz/CoreValuesSelection';
import { AlignmentReflection, type AlignmentScores } from './quiz/AlignmentReflection';
import { ValueCompass } from './quiz/ValueCompass';
import { Paywall } from './quiz/Paywall';

type Phase =
  | 'time'
  | 'money'
  | 'tradeoffIntro'
  | 'tradeoffs'
  | 'tradeoffTransition'
  | 'results'
  | 'coreValues'
  | 'alignment'
  | 'compass'
  | 'paywall';

const TIME_ICONS = [Briefcase, Heart, UsersIcon, HeartPulse, BookOpen, Gamepad2, HandHeartIcon, Moon, SparklesIcon, Bed];
const MONEY_ICONS = [Plane, ShoppingBag, GraduationCap, Home, PiggyBank, Activity, Gift, Palette, Sofa, Wrench];

const pageVariants = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export function QuizFlow() {
  const [phase, setPhase] = useState<Phase>('time');
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [pendingTransition, setPendingTransition] = useState<string | null>(null);

  const [timeAnswer, setTimeAnswer] = useState<BehaviourAnswer>();
  const [moneyAnswer, setMoneyAnswer] = useState<BehaviourAnswer>();
  const [tradeoffAnswers, setTradeoffAnswers] = useState<Answer[]>([]);
  const [result, setResult] = useState<ScoreResult>();
  const [core, setCore] = useState<CoreValuesResult>();
  const [alignmentScores, setAlignmentScores] = useState<AlignmentScores>({});

  // Progress: rough estimate across the whole flow
  const totalSteps = 2 /*time+money*/ + 1 /*intro*/ + SCENARIOS.length + 4 /*results,core,align,compass*/;
  let completed = 0;
  if (phase === 'time') completed = 0;
  else if (phase === 'money') completed = 1;
  else if (phase === 'tradeoffIntro') completed = 2;
  else if (phase === 'tradeoffs' || phase === 'tradeoffTransition') completed = 3 + scenarioIdx;
  else if (phase === 'results') completed = 3 + SCENARIOS.length;
  else if (phase === 'coreValues') completed = 4 + SCENARIOS.length;
  else if (phase === 'alignment') completed = 5 + SCENARIOS.length;
  else if (phase === 'compass') completed = 6 + SCENARIOS.length;
  else if (phase === 'paywall') completed = totalSteps;
  const progress = Math.min(100, (completed / totalSteps) * 100);

  const handleTime = (a: BehaviourAnswer) => {
    setTimeAnswer(a);
    setPhase('money');
  };

  const handleMoney = (a: BehaviourAnswer) => {
    setMoneyAnswer(a);
    setPhase('tradeoffIntro');
  };

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
      const r = computeScores(answers, timeAnswer, moneyAnswer);
      setResult(r);
      setPhase('results');
    }
  };

  const handleTransitionContinue = () => {
    setPendingTransition(null);
    advanceTradeoff(tradeoffAnswers);
  };

  const showBack =
    (phase === 'money') ||
    (phase === 'tradeoffIntro') ||
    (phase === 'coreValues');

  const handleBack = () => {
    if (phase === 'money') setPhase('time');
    else if (phase === 'tradeoffIntro') setPhase('money');
    else if (phase === 'coreValues') setPhase('results');
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
            {phase === 'time' && (
              <BehaviourQuiz
                title="Time"
                stepLabel="Time · Part 1 of 3"
                subtitle="Where your time goes is one of the strongest signals of what you've been prioritising."
                question="In a typical week, where does most of your time actually go?"
                options={TIME_OPTIONS}
                optionIcons={TIME_ICONS}
                maxSelections={3}
                existing={timeAnswer}
                onContinue={handleTime}
              />
            )}
            {phase === 'money' && (
              <BehaviourQuiz
                title="Money"
                stepLabel="Money · Part 2 of 3"
                subtitle="Where your money has been going often says something different than what you'd planned for it."
                question="Looking back at the past year — where did most of your non-essential spending actually go?"
                options={MONEY_OPTIONS}
                optionIcons={MONEY_ICONS}
                maxSelections={3}
                existing={moneyAnswer}
                onContinue={handleMoney}
              />
            )}
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
            {phase === 'results' && result && (
              <ValueResults
                result={result}
                timeAnswer={timeAnswer}
                moneyAnswer={moneyAnswer}
                onContinue={() => setPhase('coreValues')}
              />
            )}
            {phase === 'coreValues' && (
              <CoreValuesSelection
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
              <Paywall onBack={() => setPhase('compass')} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
