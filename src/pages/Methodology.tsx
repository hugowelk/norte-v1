import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { VALUES } from '@/lib/values';
import { tValueLabel, tValueExplanation } from '@/lib/i18nHelpers';
import { useDocumentMeta } from '@/lib/useDocumentMeta';

export default function Methodology() {
  const { t } = useTranslation();

  useDocumentMeta(
    [
      { name: 'description', content: t('pages.methodology.meta.description') },
      { property: 'og:title', content: t('pages.methodology.meta.ogTitle') },
      { property: 'og:description', content: t('pages.methodology.meta.description') },
      { property: 'og:url', content: 'https://findmyvalues.app/methodology' },
      { name: 'twitter:title', content: t('pages.methodology.meta.ogTitle') },
      { name: 'twitter:description', content: t('pages.methodology.meta.description') },
    ],
    { title: t('pages.methodology.meta.title'), canonical: 'https://findmyvalues.app/methodology' }
  );

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": t('pages.methodology.meta.ogTitle'),
      "description": t('pages.methodology.meta.description'),
      "author": { "@type": "Organization", "name": "Norte" },
      "publisher": { "@type": "Organization", "name": "Norte" },
      "mainEntityOfPage": "https://findmyvalues.app/methodology"
    });
    script.dataset.jsonldArticle = 'methodology';
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, [t]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-5 border-b border-border/60">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-display font-semibold text-lg tracking-tight text-foreground">
            Norte
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t('common.actions.back')}
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 py-16 md:py-24">
        <article className="max-w-2xl mx-auto space-y-16">
          <header className="space-y-4">
            <p className="text-xs font-display uppercase tracking-widest text-accent">{t('pages.methodology.eyebrow')}</p>
            <h1 className="text-4xl md:text-5xl font-display font-semibold text-foreground leading-[1.1]">
              {t('pages.methodology.title')}
            </h1>
          </header>

          <section className="space-y-5">
            <h2 className="text-2xl font-display font-semibold text-foreground">{t('pages.methodology.methodologyHeading')}</h2>
            <p className="text-foreground/85 leading-relaxed text-lg">
              {t('pages.methodology.methodologyBody')}
            </p>
          </section>

          <section className="space-y-8">
            <h2 className="text-2xl font-display font-semibold text-foreground">{t('pages.methodology.valuesHeading')}</h2>
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
                      <h3 className="font-display font-semibold text-foreground text-lg">{tValueLabel(t, v.key)}</h3>
                    </div>
                    <p className="text-foreground/80 leading-relaxed text-sm">
                      {tValueExplanation(t, v.key).definition}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl font-display font-semibold text-foreground">{t('pages.methodology.disclaimerHeading')}</h2>
            <p className="text-foreground/85 leading-relaxed">
              {t('pages.methodology.disclaimerBody')}
            </p>
          </section>
        </article>
      </main>

      <footer className="px-6 py-10 border-t border-border/60">
        <div className="max-w-3xl mx-auto text-center text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">{t('pages.methodology.backToNorte')}</Link>
        </div>
      </footer>
    </div>
  );
}
