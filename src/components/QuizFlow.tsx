import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUIZ_QUESTIONS, calculateValueScores, getTopValues, type QuizAnswers, type ValueKey } from '@/lib/values';
import { QuizSection } from './quiz/QuizSection';
import { ValueResults } from './quiz/ValueResults';
import { ValueSorting } from './quiz/ValueSorting';
import { ValueRanking } from './quiz/ValueRanking';
import { AlignmentReflection } from './quiz/AlignmentReflection';
import { ActionPlanning } from './quiz/ActionPlanning';
import { FinalInsights } from './quiz/FinalInsights';

type Phase = 'quiz' | 'results' | 'sorting' | 'ranking' | 'alignment' | 'actions' | 'insights';

export interface UserData {
  answers: QuizAnswers;
  scores: Record<ValueKey, number>;
  inferredValues: ValueKey[];
  coreValues: ValueKey[];
  rankedValues: ValueKey[];
  alignmentScores: Record<ValueKey, number>;
  actions: { value: ValueKey; action: string; when: string }[];
}

const pageVariants = {
  enter: { opacity: 0, y: 30 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
};

export function QuizFlow() {
  const [phase, setPhase] = useState<Phase>('quiz');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userData, setUserData] = useState<UserData>({
    answers: {},
    scores: {} as Record<ValueKey, number>,
    inferredValues: [],
    coreValues: [],
    rankedValues: [],
    alignmentScores: {} as Record<ValueKey, number>,
    actions: [],
  });

  const totalQuestions = QUIZ_QUESTIONS.length;
  const progress = phase === 'quiz' ? ((questionIndex) / totalQuestions) * 100 : 100;

  const handleQuizAnswer = (questionId: string, selectedIndices: number[]) => {
    const newAnswers = { ...userData.answers, [questionId]: selectedIndices };
    setUserData(prev => ({ ...prev, answers: newAnswers }));

    if (questionIndex < totalQuestions - 1) {
      setQuestionIndex(prev => prev + 1);
    } else {
      const scores = calculateValueScores(newAnswers);
      const inferred = getTopValues(scores, 7);
      setUserData(prev => ({ ...prev, answers: newAnswers, scores, inferredValues: inferred }));
      setPhase('results');
    }
  };

  const handleResultsContinue = () => setPhase('sorting');

  const handleSortingComplete = (core: ValueKey[]) => {
    setUserData(prev => ({ ...prev, coreValues: core }));
    setPhase('ranking');
  };

  const handleRankingComplete = (ranked: ValueKey[]) => {
    setUserData(prev => ({ ...prev, rankedValues: ranked }));
    setPhase('alignment');
  };

  const handleAlignmentComplete = (scores: Record<ValueKey, number>) => {
    setUserData(prev => ({ ...prev, alignmentScores: scores }));
    setPhase('actions');
  };

  const handleActionsComplete = (actions: { value: ValueKey; action: string; when: string }[]) => {
    setUserData(prev => ({ ...prev, actions }));
    setPhase('insights');
  };

  const handleGoBack = () => {
    if (phase === 'quiz' && questionIndex > 0) {
      setQuestionIndex(prev => prev - 1);
    } else if (phase === 'results') setPhase('quiz');
    else if (phase === 'sorting') setPhase('results');
    else if (phase === 'ranking') setPhase('sorting');
    else if (phase === 'alignment') setPhase('ranking');
    else if (phase === 'actions') setPhase('alignment');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      {phase !== 'insights' && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-1 bg-secondary">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      )}

      {/* Back button */}
      {phase !== 'insights' && (phase !== 'quiz' || questionIndex > 0) && (
        <button
          onClick={handleGoBack}
          className="fixed top-6 left-6 z-50 text-muted-foreground hover:text-foreground transition-colors text-sm font-display flex items-center gap-1"
        >
          ← Back
        </button>
      )}

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase === 'quiz' ? `quiz-${questionIndex}` : phase}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full max-w-2xl"
          >
            {phase === 'quiz' && (
              <QuizSection
                question={QUIZ_QUESTIONS[questionIndex]}
                currentStep={questionIndex + 1}
                totalSteps={totalQuestions}
                onAnswer={handleQuizAnswer}
                existingAnswer={userData.answers[QUIZ_QUESTIONS[questionIndex].id]}
              />
            )}
            {phase === 'results' && (
              <ValueResults
                inferredValues={userData.inferredValues}
                scores={userData.scores}
                onContinue={handleResultsContinue}
              />
            )}
            {phase === 'sorting' && (
              <ValueSorting
                inferredValues={userData.inferredValues}
                onComplete={handleSortingComplete}
              />
            )}
            {phase === 'ranking' && (
              <ValueRanking
                coreValues={userData.coreValues}
                onComplete={handleRankingComplete}
              />
            )}
            {phase === 'alignment' && (
              <AlignmentReflection
                rankedValues={userData.rankedValues}
                onComplete={handleAlignmentComplete}
              />
            )}
            {phase === 'actions' && (
              <ActionPlanning
                rankedValues={userData.rankedValues}
                onComplete={handleActionsComplete}
              />
            )}
            {phase === 'insights' && (
              <FinalInsights userData={userData} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
