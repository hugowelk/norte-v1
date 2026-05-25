import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { QuizFlow } from '@/components/QuizFlow';
import { useDocumentMeta } from '@/lib/useDocumentMeta';

const Index = () => {
  const { t } = useTranslation();
  const [started, setStarted] = useState(false);

  const steps = t('pages.index.howSteps', { returnObjects: true }) as { title: string; body: string }[];

  useDocumentMeta(
    [
      { name: 'description', content: t('pages.index.meta.description') },
      { property: 'og:title', content: t('pages.index.meta.ogTitle') },
      { property: 'og:description', content: t('pages.index.meta.ogDescription') },
      { property: 'og:url', content: 'https://findmyvalues.app/' },
      { name: 'twitter:title', content: t('pages.index.meta.ogTitle') },
      { name: 'twitter:description', content: t('pages.index.meta.ogDescription') },
    ],
    { title: t('pages.index.meta.title'), canonical: 'https://findmyvalues.app/' }
  );

  if (started) return <QuizFlow />;
  const startQuiz = () => setStarted(true);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-5 border-b border-border/60">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-display font-semibold text-lg tracking-tight text-foreground">Norte</span>
        </div>
      </header>

      <main className="flex-1">
        <section className="px-4 pt-24 pb-28 md:pt-32 md:pb-36">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <h1 className="text-4xl md:text-6xl font-display font-semibold text-foreground leading-[1.05] tracking-tight">
              {t('pages.index.heroTitle')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {t('pages.index.heroBody')}
            </p>
            <div className="pt-2">
              <motion.button
                onClick={startQuiz}
                className="px-10 py-4 bg-primary text-primary-foreground rounded-xl font-display font-semibold text-lg hover:opacity-90 transition-opacity shadow-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('common.actions.start')}
              </motion.button>
            </div>
          </motion.div>
        </section>

        <section className="px-4 py-20 md:py-24 bg-secondary/40 border-y border-border/60">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-display uppercase tracking-widest text-accent mb-5 text-center">{t('pages.index.problemEyebrow')}</p>
            <p className="text-2xl md:text-3xl font-display text-foreground leading-snug text-center">
              {t('pages.index.problemBody')}
            </p>
          </div>
        </section>

        <section id="how" className="px-4 py-20 md:py-28">
          <div className="max-w-5xl mx-auto text-left">
            <div className="max-w-2xl mb-14 mx-auto">
              <p className="text-xs font-display uppercase tracking-widest text-accent mb-3 text-center">{t('pages.index.howEyebrow')}</p>
              <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground leading-tight text-center">
                {t('pages.index.howTitle')}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {steps.map((step, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-display tracking-widest text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                    <span className="h-px flex-1 bg-border" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-foreground leading-snug">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-[15px]">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 md:py-28">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-display uppercase tracking-widest text-accent mb-5 text-center">{t('pages.index.whoEyebrow')}</p>
            <p className="text-2xl md:text-3xl font-display text-foreground leading-snug text-center">
              {t('pages.index.whoBody')}
            </p>
            <div className="pt-10 text-center">
              <motion.button
                onClick={startQuiz}
                className="px-10 py-4 bg-primary text-primary-foreground rounded-xl font-display font-semibold text-lg hover:opacity-90 transition-opacity shadow-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('common.actions.start')}
              </motion.button>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-6 py-10 border-t border-border/60">
        <div className="max-w-3xl mx-auto text-center text-sm text-muted-foreground leading-relaxed">
          {t('common.footer.basedOn')}
        </div>
      </footer>
    </div>
  );
};

export default Index;
