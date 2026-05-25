import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { type ValueKey } from '@/lib/values';
import { SCENARIOS, type Answer, type ScoreResult } from '@/lib/algorithm';
import { tValueLabel, tValueLabelLower, tValueExplanation } from '@/lib/i18nHelpers';
import { ValueIcon } from '../ValueIcon';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface Props {
  result: ScoreResult;
  answers: Answer[];
  onContinue: () => void;
}

function countReceiptsFor(value: ValueKey, answers: Answer[]): number {
  let n = 0;
  for (const s of SCENARIOS) {
    const ans = answers[s.index];
    if (ans !== 'A' && ans !== 'B') continue;
    const chosen = ans === 'A' ? s.optionA : s.optionB;
    if (chosen.values.includes(value)) n++;
  }
  return n;
}

export function ValueResults({ result, answers, onContinue }: Props) {
  const { t } = useTranslation();
  const top3 = [result.revealed.primary, result.revealed.secondary, result.revealed.tertiary];
  const rest = result.ranking.slice(3);

  return (
    <div className="space-y-10 pb-12">
      <div className="space-y-3 text-center">
        <p className="text-xs font-display uppercase tracking-widest text-accent">{t('quiz.results.eyebrow')}</p>
        <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground leading-tight">
          {t('quiz.results.title')}
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">{t('quiz.results.body')}</p>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-display uppercase tracking-widest text-muted-foreground px-1">
          {t('quiz.results.topThreeLabel')}
        </p>
        {top3.map((key, i) => (
          <TopValueCard key={key} valueKey={key} rank={i + 1} receiptsCount={countReceiptsFor(key, answers)} />
        ))}
      </div>

      <div>
        <p className="px-1 pb-3 text-xs font-display uppercase tracking-widest text-muted-foreground">
          {t('quiz.results.otherValuesLabel')}
        </p>
        <div className="space-y-2">
          {rest.map((key, i) => (
            <RestRow key={key} valueKey={key} rank={i + 4} />
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-6 text-center space-y-2">
        <p className="text-sm text-muted-foreground font-body leading-relaxed">
          {t('quiz.results.disclaimer')}
        </p>
        <Link to="/methodology" className="inline-block text-sm font-display text-accent hover:text-accent/80 transition-colors">
          {t('quiz.results.readMethodology')}
        </Link>
      </div>

      <button
        onClick={onContinue}
        className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-display font-medium hover:opacity-90 transition-opacity"
      >
        {t('quiz.results.continue')}
      </button>
    </div>
  );
}

function TopValueCard({ valueKey, rank, receiptsCount }: { valueKey: ValueKey; rank: number; receiptsCount: number }) {
  const { t } = useTranslation();
  const explanation = tValueExplanation(t, valueKey);
  const [open, setOpen] = useState(false);

  const themesArr = explanation.themes;
  const sep = t('quiz.results.themesSeparator');
  const last = t('quiz.results.themesLast');
  const themesStr = themesArr.length <= 1
    ? (themesArr[0] ?? '')
    : themesArr.slice(0, -1).join(sep) + last + themesArr[themesArr.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-primary/30 bg-card shadow-sm overflow-hidden"
    >
      <div className="flex items-center gap-4 px-5 py-4">
        <span className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-sm font-medium">
          {rank}
        </span>
        <ValueIcon value={valueKey} size={22} />
        <p className="font-display font-medium text-foreground text-lg">{tValueLabel(t, valueKey)}</p>
      </div>

      <div className="px-5 pb-5 pt-4 border-t border-border/60 space-y-4">
        <p className="text-sm text-foreground/85 leading-relaxed font-body">{explanation.definition}</p>
        <p className="text-sm text-foreground/75 leading-relaxed font-body">{explanation.pattern}</p>
        <div className="rounded-lg bg-secondary/40 border border-border/60 px-4 py-3">
          <p className="text-xs font-display uppercase tracking-widest text-muted-foreground mb-1.5">
            {t('quiz.results.costLabel')}
          </p>
          <p className="text-sm text-foreground/80 leading-relaxed font-body">{explanation.cost}</p>
        </div>

        {receiptsCount > 0 && (
          <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger className="flex items-center gap-1.5 text-xs font-display uppercase tracking-widest text-accent hover:text-accent/80 transition-colors">
              <ChevronRight size={14} className={cn('transition-transform', open && 'rotate-90')} />
              {t('quiz.results.whyToggle')}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <p className="text-sm text-foreground/80 font-body leading-relaxed">
                <Trans
                  i18nKey={receiptsCount === 1 ? 'quiz.results.receiptsTextOne' : 'quiz.results.receiptsTextOther'}
                  values={{ count: receiptsCount, themes: themesStr, label: tValueLabelLower(t, valueKey) }}
                  components={{ strong: <span className="font-display text-foreground" /> }}
                />
              </p>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </motion.div>
  );
}

function RestRow({ valueKey, rank }: { valueKey: ValueKey; rank: number }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-card">
      <span className="w-6 h-6 rounded-full bg-secondary text-foreground/70 flex items-center justify-center font-display text-xs">
        {rank}
      </span>
      <ValueIcon value={valueKey} size={18} />
      <span className="font-display text-foreground">{tValueLabel(t, valueKey)}</span>
    </div>
  );
}
