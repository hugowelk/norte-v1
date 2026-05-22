import { Link } from 'react-router-dom';
import { VALUES } from '@/lib/values';
import { VALUE_EXPLANATIONS } from '@/lib/valueExplanations';

export default function Methodology() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-5 border-b border-border/60">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-display font-semibold text-lg tracking-tight text-foreground">
            Norte
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 py-16 md:py-24">
        <article className="max-w-2xl mx-auto space-y-16">
          <header className="space-y-4">
            <p className="text-xs font-display uppercase tracking-widest text-accent">Methodology</p>
            <h1 className="text-4xl md:text-5xl font-display font-semibold text-foreground leading-[1.1]">
              How Norte reads your values.
            </h1>
          </header>

          <section className="space-y-5">
            <h2 className="text-2xl font-display font-semibold text-foreground">The methodology</h2>
            <p className="text-foreground/85 leading-relaxed text-lg">
              Norte is built on three research foundations: ACT (Acceptance and Commitment Therapy), the Valued Living Questionnaire, and the Bull's Eye Values Survey. Each contributes a different piece to how we understand and measure values.
            </p>
          </section>

          <section className="space-y-8">
            <h2 className="text-2xl font-display font-semibold text-foreground">The 8 values</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {VALUES.map((v) => {
                const Icon = v.icon;
                return (
                  <div
                    key={v.key}
                    className="rounded-2xl border border-border bg-card/40 p-5 space-y-3 hover:border-accent/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-accent/15 text-accent shrink-0">
                        <Icon size={22} strokeWidth={1.5} />
                      </span>
                      <h3 className="font-display font-semibold text-foreground text-lg">{v.label}</h3>
                    </div>
                    <p className="text-foreground/80 leading-relaxed text-sm">
                      {VALUE_EXPLANATIONS[v.key].definition}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl font-display font-semibold text-foreground">Disclaimer</h2>
            <p className="text-foreground/85 leading-relaxed">
              Norte is a wellness product, not a clinical tool. It's designed to give you a useful frame for self-reflection, not a diagnostic assessment. If you're working with a therapist or coach, your results may be a productive conversation starter.
            </p>
          </section>
        </article>
      </main>

      <footer className="px-6 py-10 border-t border-border/60">
        <div className="max-w-3xl mx-auto text-center text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">← Back to Norte</Link>
        </div>
      </footer>
    </div>
  );
}
