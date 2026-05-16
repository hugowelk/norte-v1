import { motion } from 'framer-motion';
import { type Scenario, type Answer } from '@/lib/algorithm';

interface Props {
  scenario: Scenario;
  onAnswer: (answer: Answer) => void;
}

export function TradeoffScenario({ scenario, onAnswer }: Props) {
  const isSplit = scenario.split === true;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-xs font-display uppercase tracking-widest text-accent">
          {scenario.index + 1} of 13
        </p>
        {isSplit && (
          <p className="text-xs font-display uppercase tracking-widest text-muted-foreground">
            The widest choice
          </p>
        )}
      </div>

      <motion.h2
        key={scenario.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className={`font-display font-semibold text-foreground leading-snug ${
          isSplit ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'
        }`}
      >
        {scenario.prompt}
      </motion.h2>

      <div className={isSplit ? 'grid md:grid-cols-2 gap-3' : 'space-y-3'}>
        <ChoiceButton
          label={scenario.optionA.label}
          showAB={!isSplit}
          letter="A"
          onClick={() => onAnswer('A')}
        />
        <ChoiceButton
          label={scenario.optionB.label}
          showAB={!isSplit}
          letter="B"
          onClick={() => onAnswer('B')}
        />
      </div>
    </div>
  );
}

function ChoiceButton({
  label, showAB, letter, onClick,
}: { label: string; showAB: boolean; letter: 'A' | 'B'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left px-6 py-5 rounded-xl border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all duration-200 font-body text-base text-foreground/90 hover:text-foreground"
    >
      <div className="flex gap-4">
        {showAB && (
          <span className="shrink-0 w-8 h-8 rounded-full border-2 border-border group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center font-display text-sm font-medium transition-colors">
            {letter}
          </span>
        )}
        <span className="leading-relaxed">{label}</span>
      </div>
    </button>
  );
}
