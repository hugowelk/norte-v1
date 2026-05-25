import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { VALUES, type ValueKey } from '@/lib/values';
import { tValueLabel, tValueDescription, tValueLongDescription } from '@/lib/i18nHelpers';

interface Props {
  chosen: ValueKey[];
}

export function ChosenValuesHero({ chosen }: Props) {
  const { t } = useTranslation();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const values = chosen
    .map((k) => VALUES.find((v) => v.key === k))
    .filter((v): v is (typeof VALUES)[number] => Boolean(v));

  if (values.length === 0) return null;

  return (
    <section className="mb-14 md:mb-20 print:mb-8">
      <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
        {t('report.hero.eyebrow')}
      </p>

      <div className="space-y-4">
        {values.map((v, i) => {
          const Icon = v.icon;
          const isOpen = openIdx === i;
          return (
            <div key={v.key} className={`rounded-2xl border transition-all overflow-hidden ${isOpen ? 'border-accent/60 bg-accent/5 shadow-sm' : 'border-border bg-card/40 hover:border-accent/40'}`}>
              <button type="button" onClick={() => setOpenIdx(isOpen ? null : i)} className="w-full flex items-center gap-4 md:gap-5 p-5 md:p-6 text-left" aria-expanded={isOpen}>
                <span className="flex-shrink-0 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-accent/15 text-accent">
                  <Icon size={28} strokeWidth={1.5} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3">
                    <span className="font-sans text-xs text-muted-foreground tabular-nums">0{i + 1}</span>
                    <h3 className="font-display text-[22px] md:text-[26px] leading-tight text-primary truncate">
                      {tValueLabel(t, v.key)}
                    </h3>
                  </div>
                  <p className="font-sans text-[14px] md:text-[15px] text-muted-foreground mt-1 line-clamp-1">
                    {tValueDescription(t, v.key)}
                  </p>
                </div>
                <ChevronDown size={20} className={`flex-shrink-0 text-muted-foreground transition-transform duration-200 no-print ${isOpen ? 'rotate-180 text-accent' : ''}`} />
              </button>
              <div className={`px-5 md:px-6 pb-6 md:pb-7 pl-[88px] md:pl-[100px] ${isOpen ? 'block animate-accordion-down' : 'hidden print:block'}`}>
                <p className="font-sans text-[16px] md:text-[17px] leading-[1.65] text-foreground">
                  {tValueLongDescription(t, v.key)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
