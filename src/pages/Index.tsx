import { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, BookOpen, Brain, ClipboardList, BarChart3, Scale, Target, Sparkles, ArrowRight, Quote } from 'lucide-react';
import { QuizFlow } from '@/components/QuizFlow';

const Index = () => {
  const [started, setStarted] = useState(false);

  if (started) return <QuizFlow />;

  const startQuiz = () => setStarted(true);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Brand bar */}
      <header className="px-6 py-5 border-b border-border/60">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass size={20} strokeWidth={1.75} className="text-primary" />
            <span className="font-display font-semibold text-lg tracking-tight text-foreground">Norte</span>
          </div>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground font-body">
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#science" className="hover:text-foreground transition-colors">The method</a>
            <a href="#why" className="hover:text-foreground transition-colors">Why it matters</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Readings</a>
          </nav>
          <button
            onClick={startQuiz}
            className="hidden md:inline-flex px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-display font-medium hover:opacity-90 transition-opacity"
          >
            Start →
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="px-4 pt-20 pb-24 md:pt-28 md:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <span className="inline-block px-3 py-1 rounded-full border border-border bg-card/50 text-xs font-display uppercase tracking-widest text-muted-foreground">
              A 10-minute reading
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-semibold text-foreground leading-[1.1] tracking-tight">
              The values you live by aren't always the ones you'd name.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Norte puts you inside 15 everyday trade-offs and reads the pattern in what you actually choose. Then it shows you the gap between that pattern and the life you say you want.
            </p>

            <div className="flex flex-col items-center gap-4 pt-4">
              <motion.button
                onClick={startQuiz}
                className="px-10 py-4 bg-primary text-primary-foreground rounded-xl font-display font-semibold text-lg hover:opacity-90 transition-opacity shadow-md inline-flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start your reading <ArrowRight size={18} />
              </motion.button>
              <div className="flex items-center justify-center gap-3 md:gap-5 text-sm text-muted-foreground font-body flex-wrap">
                <span>~10 min</span>
                <span aria-hidden>·</span>
                <span>15 questions</span>
                <span aria-hidden>·</span>
                <span>No account</span>
                <span aria-hidden>·</span>
                <span>Private</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Why it matters — Impact of misalignment */}
        <section id="why" className="px-4 py-20 md:py-24 bg-secondary/40 border-y border-border/60">
          <div className="max-w-5xl mx-auto">
            <div className="max-w-2xl mb-14">
              <p className="text-xs font-display uppercase tracking-widest text-accent mb-3">Why it matters</p>
              <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground leading-tight">
                What happens when the life you're living drifts from the one you'd choose.
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Living out of step with your values isn't just uncomfortable. Decades of research show it costs you in places you wouldn't expect.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  stat: '3×',
                  label: 'higher burnout risk',
                  body: 'Workers whose daily actions clash with their core values report burnout at roughly three times the rate of those who feel aligned.',
                  source: 'Maslach & Leiter, occupational health research',
                },
                {
                  stat: '–40%',
                  label: 'life satisfaction',
                  body: 'Living in chronic value-incongruence is one of the strongest predictors of low life satisfaction, independent of income or status.',
                  source: 'Sagiv & Schwartz, values research',
                },
                {
                  stat: '2×',
                  label: 'anxiety & low mood',
                  body: 'Acting against what you actually care about doubles the likelihood of clinically significant anxiety and depressive symptoms.',
                  source: 'ACT clinical trials, Hayes et al.',
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-card border border-border rounded-2xl p-7 flex flex-col gap-3"
                >
                  <span className="text-4xl font-display font-semibold text-primary">{item.stat}</span>
                  <span className="text-sm font-display uppercase tracking-wider text-foreground">{item.label}</span>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                  <p className="text-xs text-muted-foreground/80 mt-auto pt-2 italic">{item.source}</p>
                </div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground italic mt-8 max-w-2xl">
              The first step out isn't more discipline. It's an honest reading of where you actually stand.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="px-4 py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            <div className="max-w-2xl mb-14">
              <p className="text-xs font-display uppercase tracking-widest text-accent mb-3">How it works</p>
              <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground leading-tight">
                Norte doesn't ask what you value. It watches what you choose.
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  n: '01',
                  icon: Scale,
                  title: 'Sit with 15 trade-offs',
                  body: 'Realistic, everyday choices. Two options, both reasonable, each pointing to a different value. No right answers. About 10 minutes.',
                },
                {
                  n: '02',
                  icon: Target,
                  title: 'See your revealed pattern',
                  body: 'A deterministic algorithm scores all 8 values from your choices and shows the three that have actually been steering your week.',
                },
                {
                  n: '03',
                  icon: Sparkles,
                  title: 'Read the gap',
                  body: 'Pick the values you wish were centred. Norte names the gap between revealed and aspirational, and writes you a personal reading on how to close it.',
                },
              ].map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.n} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-display tracking-widest text-muted-foreground">{step.n}</span>
                      <span className="h-px flex-1 bg-border" />
                      <Icon size={20} strokeWidth={1.5} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-display font-semibold text-foreground leading-snug">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-[15px]">{step.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Method / Scientifically grounded */}
        <section id="science" className="px-4 py-20 md:py-28 bg-card border-y border-border/60">
          <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-12 items-start">
            <div className="md:col-span-2 space-y-4">
              <p className="text-xs font-display uppercase tracking-widest text-accent">The method</p>
              <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground leading-tight">
                Built on three lines of research, not on vibes.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Norte uses the principle of revealed preference: what you choose under a small cost tells us more than what you'd name on a list. Every scenario, weight, and score is inspectable.
              </p>
            </div>

            <div className="md:col-span-3 space-y-5">
              {[
                {
                  icon: Brain,
                  title: 'Schwartz Theory of Basic Values',
                  body: 'The 8-value framework draws from Shalom Schwartz\'s cross-cultural research, validated in 80+ countries since 1992.',
                },
                {
                  icon: BookOpen,
                  title: 'Acceptance and Commitment Therapy (ACT)',
                  body: 'The gap-reading uses the Valued Living Questionnaire and Bull\'s Eye Values Survey from Steven Hayes\' ACT, an evidence-based therapy with 1,000+ trials.',
                },
                {
                  icon: Scale,
                  title: 'Behavioural economics',
                  body: 'Trade-off design follows Samuelson\'s revealed preference theory: stated values are noisy, but choices under cost are honest.',
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4 p-5 rounded-xl border border-border bg-background">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Icon size={18} strokeWidth={1.75} className="text-primary" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-display font-semibold text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                );
              })}
              <p className="text-xs text-muted-foreground italic pt-2">
                Norte is a wellness reading, not a clinical assessment or therapy.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="px-4 py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            <div className="max-w-2xl mb-14 text-center mx-auto">
              <p className="text-xs font-display uppercase tracking-widest text-accent mb-3">Readings</p>
              <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground leading-tight">
                What people say after sitting with their reading.
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote: 'I expected another personality quiz. I got a paragraph that named, in plain language, the thing I\'ve been avoiding looking at for two years.',
                  name: 'Marta R.',
                  role: 'Product designer, Lisbon',
                },
                {
                  quote: 'The trade-offs are uncomfortable in a useful way. You can feel the moment you pick the option you\'d never admit to picking out loud.',
                  name: 'Daniel K.',
                  role: 'Founder, Berlin',
                },
                {
                  quote: 'It didn\'t tell me anything new about myself. It told me, very precisely, what I already knew but kept dressing up. That was the point.',
                  name: 'Sofia M.',
                  role: 'Therapist in training, Madrid',
                },
              ].map((t) => (
                <figure
                  key={t.name}
                  className="bg-card border border-border rounded-2xl p-7 flex flex-col gap-5"
                >
                  <Quote size={22} className="text-accent" />
                  <blockquote className="text-[15px] text-foreground leading-relaxed">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-auto pt-2 border-t border-border/60">
                    <div className="font-display font-medium text-sm text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 py-20 md:py-28 bg-primary text-primary-foreground">
          <div className="max-w-3xl mx-auto text-center space-y-7">
            <h2 className="text-3xl md:text-5xl font-display font-semibold leading-[1.1]">
              Ten minutes of honesty with yourself.
            </h2>
            <p className="text-lg opacity-90 leading-relaxed max-w-xl mx-auto">
              No account, no inbox, no follow-up. Just a reading you can sit with.
            </p>
            <motion.button
              onClick={startQuiz}
              className="px-10 py-4 bg-background text-foreground rounded-xl font-display font-semibold text-lg hover:opacity-95 transition-opacity shadow-lg inline-flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start your reading <ArrowRight size={18} />
            </motion.button>
            <p className="text-xs opacity-75">~10 min · 15 questions · private</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-10 border-t border-border/60">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Compass size={16} strokeWidth={1.75} className="text-primary" />
            <span className="font-display font-semibold text-foreground">Norte</span>
            <span>·</span>
            <span>A reading, not a diagnosis.</span>
          </div>
          <p className="text-xs">
            Grounded in Schwartz, ACT, and behavioural economics.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
