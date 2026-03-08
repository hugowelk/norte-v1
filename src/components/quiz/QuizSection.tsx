import { useState } from 'react';
import { type QuizQuestion } from '@/lib/values';

interface Props {
  question: QuizQuestion;
  currentStep: number;
  totalSteps: number;
  onAnswer: (questionId: string, selectedIndices: number[]) => void;
  existingAnswer?: number[];
}

export function QuizSection({ question, currentStep, totalSteps, onAnswer, existingAnswer }: Props) {
  const [selected, setSelected] = useState<number[]>(existingAnswer || []);

  const toggleOption = (idx: number) => {
    if (question.type === 'forced-choice' || question.type === 'single-select') {
      setSelected([idx]);
      return;
    }
    setSelected(prev => {
      if (prev.includes(idx)) return prev.filter(i => i !== idx);
      if (question.maxSelections && prev.length >= question.maxSelections) return prev;
      return [...prev, idx];
    });
  };

  const canContinue = selected.length > 0;

  const handleContinue = () => {
    if (canContinue) onAnswer(question.id, selected);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-display uppercase tracking-widest text-accent">
          {question.sectionTitle} · {currentStep}/{totalSteps}
        </p>
        <p className="text-sm text-muted-foreground">{question.sectionSubtitle}</p>
      </div>

      <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground leading-tight">
        {question.question}
      </h2>

      {question.maxSelections && (
        <p className="text-sm text-muted-foreground">
          Select up to {question.maxSelections}
        </p>
      )}

      <div className="space-y-3">
        {question.options.map((option, idx) => {
          const isSelected = selected.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => toggleOption(idx)}
              className={`w-full text-left px-5 py-4 rounded-lg border-2 transition-all duration-200 font-body text-base ${
                isSelected
                  ? 'border-primary bg-primary/5 text-foreground shadow-sm'
                  : 'border-border bg-card hover:border-primary/40 text-foreground/80 hover:text-foreground'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleContinue}
        disabled={!canContinue}
        className={`w-full py-4 rounded-lg font-display font-medium text-base transition-all duration-200 ${
          canContinue
            ? 'bg-primary text-primary-foreground hover:opacity-90'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );
}
