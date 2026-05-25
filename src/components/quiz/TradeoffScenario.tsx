import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { type Scenario, type Answer } from '@/lib/algorithm';
import { tScenarioPrompt, tScenarioOption } from '@/lib/i18nHelpers';

interface Props {
  scenario: Scenario;
  onAnswer: (answer: Answer) => void;
}

export function TradeoffScenario({ scenario, onAnswer }: Props) {
  const { t } = useTranslation();
  const isSplit = scenario.split === true;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-xs font-display uppercase tracking-widest text-accent">
          {t('quiz.scenario.counter', { n: scenario.index + 1 })}
        </p>
        {isSplit && (
          <p className="text-xs font-display uppercase tracking-widest text-muted-foreground">
            {t('quiz.scenario.biggerOne')}
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
        {tScenarioPrompt(t, scenario)}
      </motion.h2>

      <div className={isSplit ? 'grid md:grid-cols-2 gap-3' : 'space-y-3'}>
        <ChoiceButton label={tScenarioOption(t, scenario, 'A')} showAB={!isSplit} letter="A" onClick={() => onAnswer('A')} />
        <ChoiceButton label={tScenarioOption(t, scenario, 'B')} showAB={!isSplit} letter="B" onClick={() => onAnswer('B')} />
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
