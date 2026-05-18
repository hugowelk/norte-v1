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
            <p className="text-muted-foreground italic text-sm">
              [Longer methodology content forthcoming.]
            </p>
          </section>

          <section className="space-y-8">
            <h2 className="text-2xl font-display font-semibold text-foreground">The 8 values</h2>
            <div className="space-y-10">
              {VALUES.map((v) => (
                <div key={v.key} className="space-y-3">
                  <h3 className="text-xl font-display font-semibold text-foreground">{v.label}</h3>
                  <p className="text-foreground/85 leading-relaxed">
                    {VALUE_EXPLANATIONS[v.key].definition}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl font-display font-semibold text-foreground">How the algorithm works</h2>
            <p className="text-foreground/85 leading-relaxed">
              When you answer a scenario, the value behind your choice gets weighted. Early scenarios weigh 1.0, mid-difficulty scenarios weigh 1.5, hard scenarios weigh 2.0. One scenario (C12) splits its weight across two values per side.
            </p>
            <p className="text-foreground/85 leading-relaxed">
              We sum the weights per value, normalize against the maximum possible for each value, and rank all 8. The top 3 are your revealed values.
            </p>
            <p className="text-foreground/85 leading-relaxed">
              The math is fully deterministic. No AI inference, no fuzzy logic. You can audit any score back to your specific choices.
            </p>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl font-display font-semibold text-foreground">Disclaimer</h2>
            <p className="text-foreground/85 leading-relaxed">
              Norte is a wellness product, not a clinical tool. It's designed to give you a useful frame for self-reflection, not a diagnostic assessment. If you're working with a therapist or coach, your results may be a productive conversation starter.
            </p>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl font-display font-semibold text-foreground">About</h2>
            <p className="text-muted-foreground italic text-sm">
              [Short bio from Hugo forthcoming.]
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
