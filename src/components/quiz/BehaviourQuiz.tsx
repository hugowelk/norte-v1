import { useState } from 'react';
import { Plus, X, type LucideIcon } from 'lucide-react';
import { type BehaviourOption, type BehaviourAnswer } from '@/lib/values';

interface Props {
  title: string;
  subtitle: string;
  question: string;
  options: BehaviourOption[];
  optionIcons: LucideIcon[];
  maxSelections: number;
  stepLabel: string;
  existing?: BehaviourAnswer;
  onContinue: (answer: BehaviourAnswer) => void;
}

export function BehaviourQuiz({
  title, subtitle, question, options, optionIcons, maxSelections, stepLabel, existing, onContinue,
}: Props) {
  const [selected, setSelected] = useState<number[]>(existing?.selectedIndices ?? []);
  const [custom, setCustom] = useState<string[]>(existing?.custom ?? []);
  const [draft, setDraft] = useState('');

  const toggle = (idx: number) => {
    setSelected(prev => {
      if (prev.includes(idx)) return prev.filter(i => i !== idx);
      if (prev.length >= maxSelections) return prev;
      return [...prev, idx];
    });
  };

  const addCustom = () => {
    const t = draft.trim();
    if (!t) return;
    setCustom(prev => [...prev, t]);
    setDraft('');
  };

  const canContinue = selected.length > 0 || custom.length > 0;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-display uppercase tracking-widest text-accent">{stepLabel}</p>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground leading-tight">
        {question}
      </h2>

      <p className="text-sm text-muted-foreground">Pick up to {maxSelections}</p>

      <div className="space-y-2.5">
        {options.map((option, idx) => {
          const Icon = optionIcons[idx];
          const isSelected = selected.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => toggle(idx)}
              className={`w-full text-left px-5 py-4 rounded-lg border-2 transition-all duration-200 font-body text-base flex items-center gap-3 ${
                isSelected
                  ? 'border-primary bg-primary/5 text-foreground shadow-sm'
                  : 'border-border bg-card hover:border-primary/40 text-foreground/80 hover:text-foreground'
              }`}
            >
              {Icon && <Icon size={18} strokeWidth={1.75} className="shrink-0 text-accent" />}
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-2 pt-2">
        <p className="text-xs font-display uppercase tracking-widest text-muted-foreground">Add your own</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustom())}
            placeholder={`Something else that took your ${title.toLowerCase()}…`}
            className="flex-1 px-4 py-3 rounded-lg border-2 border-border bg-card text-base font-body text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
          />
          <button
            onClick={addCustom}
            type="button"
            className="px-4 rounded-lg border-2 border-border bg-card hover:border-primary/40 text-foreground transition-colors"
            aria-label="Add"
          >
            <Plus size={18} />
          </button>
        </div>
        {custom.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {custom.map((c, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-sm">
                {c}
                <button
                  onClick={() => setCustom(prev => prev.filter((_, idx) => idx !== i))}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label={`Remove ${c}`}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => canContinue && onContinue({ selectedIndices: selected, custom })}
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
