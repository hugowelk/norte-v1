import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getValueByKey, type ValueKey } from '@/lib/values';
import { SCENARIOS, type Answer, type ScoreResult } from '@/lib/algorithm';
import { VALUE_EXPLANATIONS } from '@/lib/valueExplanations';
import { ValueIcon } from '../ValueIcon';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface Props {
  result: ScoreResult;
  answers: Answer[];
  onContinue: () => void;
}

// Truncate at word boundary near `max` chars.
function truncate(text: string, max = 100): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastSpace > 40 ? slice.slice(0, lastSpace) : slice;
  return cut.replace(/[,.;:]$/, '') + '…';
}

// Return the user-chosen option labels that scored for this value.
function receiptsFor(value: ValueKey, answers: Answer[]): string[] {
  const out: string[] = [];
  for (const s of SCENARIOS) {
    const ans = answers[s.index];
    if (ans !== 'A' && ans !== 'B') continue;
    const chosen = ans === 'A' ? s.optionA : s.optionB;
    if (chosen.values.includes(value)) {
      // Strip a leading "I " for cleaner reading and drop trailing period.
      const label = chosen.label.replace(/\.$/, '');
      out.push(truncate(label, 100));
    }
  }
  return out;
}

export function ValueResults({ result, answers, onContinue }: Props) {
  const top3 = [result.revealed.primary, result.revealed.secondary, result.revealed.tertiary];
  const rest = result.ranking.slice(3);
  

  return (
    <div className="space-y-10 pb-12">
      <div className="space-y-3 text-center">
        <p className="text-xs font-display uppercase tracking-widest text-accent">Your Results</p>
        <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground leading-tight">
          Here's what came up.
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Across the 15 trade-offs you just made, these are the three values that showed up most often.
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-display uppercase tracking-widest text-muted-foreground px-1">
          Your revealed top 3
        </p>
        {top3.map((key, i) => (
          <TopValueCard
            key={key}
            valueKey={key}
            rank={i + 1}
            receipts={receiptsFor(key, answers)}
          />
        ))}
      </div>

      <div>
        <p className="px-1 pb-3 text-xs font-display uppercase tracking-widest text-muted-foreground">
          Other values that came up
        </p>
        <div className="space-y-2">
          {rest.map((key, i) => (
            <RestRow key={key} valueKey={key} rank={i + 4} />
          ))}
        </div>
      </div>


      <div className="border-t border-border pt-6 text-center space-y-2">
        <p className="text-sm text-muted-foreground font-body leading-relaxed">
          These results come from a deterministic algorithm grounded in ACT, the Valued Living Questionnaire, and the Bull's Eye Values Survey. No AI guessing.
        </p>
        <Link
          to="/methodology"
          className="inline-block text-sm font-display text-accent hover:text-accent/80 transition-colors"
        >
          Read the methodology →
        </Link>
      </div>

      <button
        onClick={onContinue}
        className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-display font-medium hover:opacity-90 transition-opacity"
      >
        Next: choose the values you want at the centre →
      </button>
    </div>
  );
}

function TopValueCard({
  valueKey, rank, receipts,
}: {
  valueKey: ValueKey;
  rank: number;
  receipts: string[];
}) {
  const value = getValueByKey(valueKey);
  const explanation = VALUE_EXPLANATIONS[valueKey];
  const [open, setOpen] = useState(false);

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
        <p className="font-display font-medium text-foreground text-lg">{value.label}</p>
      </div>

      <div className="px-5 pb-5 pt-4 border-t border-border/60 space-y-4">
        <p className="text-sm text-foreground/85 leading-relaxed font-body">
          {explanation.definition}
        </p>
        <p className="text-sm text-foreground/75 leading-relaxed font-body">
          {explanation.pattern}
        </p>
        <div className="rounded-lg bg-secondary/40 border border-border/60 px-4 py-3">
          <p className="text-xs font-display uppercase tracking-widest text-muted-foreground mb-1.5">
            The cost when this dominates
          </p>
          <p className="text-sm text-foreground/80 leading-relaxed font-body">
            {explanation.cost}
          </p>
        </div>

        {receipts.length > 0 && (
          <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger className="flex items-center gap-1.5 text-xs font-display uppercase tracking-widest text-accent hover:text-accent/80 transition-colors">
              <ChevronRight size={14} className={cn('transition-transform', open && 'rotate-90')} />
              Why this value?
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <p className="text-xs text-muted-foreground font-body mb-2">
                You picked:
              </p>
              <ul className="space-y-1.5">
                {receipts.map((r, idx) => (
                  <li key={idx} className="text-sm text-foreground/75 font-body leading-snug pl-3 border-l-2 border-accent/40">
                    "{r}"
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </motion.div>
  );
}

function RestRow({ valueKey, rank }: { valueKey: ValueKey; rank: number }) {
  const value = getValueByKey(valueKey);
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-card">
      <span className="w-6 h-6 rounded-full bg-secondary text-foreground/70 flex items-center justify-center font-display text-xs">
        {rank}
      </span>
      <ValueIcon value={valueKey} size={18} />
      <span className="font-display text-foreground">{value.label}</span>
    </div>
  );
}
