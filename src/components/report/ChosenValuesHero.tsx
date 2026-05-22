import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { VALUES, type ValueKey } from '@/lib/values';

interface Props {
  chosen: ValueKey[];
}

export function ChosenValuesHero({ chosen }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const values = chosen
    .map((k) => VALUES.find((v) => v.key === k))
    .filter((v): v is (typeof VALUES)[number] => Boolean(v));

  if (values.length === 0) return null;

  return (
    <section className="no-print mb-14 md:mb-20">
      <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
        Your top 3 chosen values
      </p>

      <div className="space-y-4">
        {values.map((v, i) => {
          const Icon = v.icon;
          const isOpen = openIdx === i;
          return (
            <div
              key={v.key}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen
                  ? 'border-accent/60 bg-accent/5 shadow-sm'
                  : 'border-border bg-card/40 hover:border-accent/40'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="w-full flex items-center gap-4 md:gap-5 p-5 md:p-6 text-left"
                aria-expanded={isOpen}
              >
                <span className="flex-shrink-0 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-accent/15 text-accent">
                  <Icon size={28} strokeWidth={1.5} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3">
                    <span className="font-sans text-xs text-muted-foreground tabular-nums">
                      0{i + 1}
                    </span>
                    <h3 className="font-display text-[22px] md:text-[26px] leading-tight text-primary truncate">
                      {v.label}
                    </h3>
                  </div>
                  <p className="font-sans text-[14px] md:text-[15px] text-muted-foreground mt-1 line-clamp-1">
                    {v.description}
                  </p>
                </div>
                <ChevronDown
                  size={20}
                  className={`flex-shrink-0 text-muted-foreground transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-accent' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 md:px-6 pb-6 md:pb-7 pl-[88px] md:pl-[100px] animate-accordion-down">
                  <p className="font-sans text-[16px] md:text-[17px] leading-[1.65] text-foreground">
                    {v.longDescription}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
