import { useState } from 'react';
import { motion } from 'framer-motion';
import { QuizFlow } from '@/components/QuizFlow';
import { useDocumentMeta } from '@/lib/useDocumentMeta';

const Index = () => {
  const [started, setStarted] = useState(false);

  useDocumentMeta([
    { property: 'og:title', content: 'Take the Norte values exercise' },
    { property: 'og:description', content: 'Answer 15 trade-off scenarios and uncover the life values your behaviour actually reveals.' },
    { property: 'og:url', content: 'https://findmyvalues.app/app' },
    { name: 'twitter:title', content: 'Take the Norte values exercise' },
    { name: 'twitter:description', content: 'Answer 15 trade-off scenarios and uncover the life values your behaviour actually reveals.' },
  ]);

  if (started) return <QuizFlow />;

  const startQuiz = () => setStarted(true);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Brand bar */}
      <header className="px-6 py-5 border-b border-border/60">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-display font-semibold text-lg tracking-tight text-foreground">Norte</span>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="px-4 pt-24 pb-28 md:pt-32 md:pb-36">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <h1 className="text-4xl md:text-6xl font-display font-semibold text-foreground leading-[1.05] tracking-tight">
              Your real values aren't what you say. They're what you choose when something's at stake.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Norte uses 15 trade-off scenarios to reveal the values that guide your decisions. Methodology grounded in ACT (Acceptance and Commitment Therapy).
            </p>
            <div className="pt-2">
              <motion.button
                onClick={startQuiz}
                className="px-10 py-4 bg-primary text-primary-foreground rounded-xl font-display font-semibold text-lg hover:opacity-90 transition-opacity shadow-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start
              </motion.button>
            </div>
          </motion.div>

        </section>


        {/* The problem */}
        <section className="px-4 py-20 md:py-24 bg-secondary/40 border-y border-border/60">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-display uppercase tracking-widest text-accent mb-5 text-center">WHAT HAVE YOU BEEN PRIORITISING IN YOUR LIFE?</p>
            <p className="text-2xl md:text-3xl font-display text-foreground leading-snug text-center">
              When someone asks you what matters, you answer with aspirations. But what actually matters shows up in your choices. Especially the small ones. Especially the hard ones.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="px-4 py-20 md:py-28">
          <div className="max-w-5xl mx-auto text-left">
            <div className="max-w-2xl mb-14 mx-auto">
              <p className="text-xs font-display uppercase tracking-widest text-accent mb-3 text-center">How it works</p>
              <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground leading-tight text-center">
                Three ideas Norte is built on.
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  n: '01',
                  title: 'Choices reveal values',
                  body: 'Research in behavioural psychology shows that aspirational values (what we say matters) often diverge from revealed values (what our choices show matters). Norte works with both.',
                },
                {
                  n: '02',
                  title: 'Trade-offs, not preferences',
                  body: "Each scenario puts two values in real tension. There's no right answer. Your choice reveals which value weighs more when you have to decide.",
                },
                {
                  n: '03',
                  title: 'An action plan, not a report',
                  body: 'At the end, you get a personalized plan to close the gap between what you live and what you want to live.',
                },
              ].map((step) => (
                <div key={step.n} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-display tracking-widest text-muted-foreground">{step.n}</span>
                    <span className="h-px flex-1 bg-border" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-foreground leading-snug">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-[15px]">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>



        {/* Who it's for */}
        <section className="px-4 py-20 md:py-28">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-display uppercase tracking-widest text-accent mb-5 text-center">Who it's for</p>
            <p className="text-2xl md:text-3xl font-display text-foreground leading-snug text-center">
              Norte is for people who sense a gap between the life they're building and the one they actually want. People who are doing fine on paper and quietly restless in practice. People who are done with vague self-awareness and want something concrete.
            </p>
            <div className="pt-10 text-center">
              <motion.button
                onClick={startQuiz}
                className="px-10 py-4 bg-primary text-primary-foreground rounded-xl font-display font-semibold text-lg hover:opacity-90 transition-opacity shadow-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start
              </motion.button>
            </div>
          </div>
        </section>
      </main>

      {/* Methodology footer */}
      <footer className="px-6 py-10 border-t border-border/60">
        <div className="max-w-3xl mx-auto text-center text-sm text-muted-foreground leading-relaxed">
          Based on ACT (Acceptance and Commitment Therapy) and the Valued Living Questionnaire, and the Bull's Eye Values Survey. 2026©
        </div>
      </footer>
    </div>
  );
};

export default Index;
