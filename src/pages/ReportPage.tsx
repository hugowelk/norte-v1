import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { isOwnedReport } from '@/lib/reportOwnership';
import { ShareHeader } from '@/components/report/ShareHeader';
import { ReportMarkdown } from '@/components/report/ReportMarkdown';
import { ReportActions } from '@/components/report/ReportActions';
import { ReportNotFound } from '@/components/report/ReportNotFound';
import { GapVisualization } from '@/components/report/GapVisualization';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { track } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { VALUES, type ValueKey } from '@/lib/values';


interface Report {
  id: string;
  created_at: string;
  report_markdown: string;
  input_data: Record<string, unknown>;
}

export default function ReportPage() {
  const { reportId } = useParams<{ reportId: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [status, setStatus] = useState<'loading' | 'ok' | 'not-found'>('loading');

  useEffect(() => {
    if (!reportId) { setStatus('not-found'); return; }
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('id, created_at, report_markdown, input_data')
        .eq('id', reportId)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        setStatus('not-found');
        track('report_404', { attempted_id: reportId });
        return;
      }
      setReport(data as Report);
      setStatus('ok');
      track('report_viewed', { report_id: reportId, is_creator: isOwnedReport(reportId) });
      supabase.rpc('increment_report_view', { p_id: reportId }).then(() => {});
    })();
    return () => { cancelled = true; };
  }, [reportId]);

  // SEO / OG — noindex individual reports; vague preview text so we don't leak content.
  useDocumentMeta(reportId ? [
    { name: 'robots', content: 'noindex' },
    { property: 'og:title', content: 'A Norte reading' },
    { property: 'og:description', content: "Someone's values, behaviour, and the gap between them." },
    { property: 'og:image', content: 'https://norte.app/og-default.png' },
    { property: 'og:url', content: `https://norte.app/r/${reportId}` },
  ] : []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          className="w-10 h-10 rounded-full border-2 border-accent"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    );
  }

  if (status === 'not-found' || !report) return <ReportNotFound />;

  const isOwner = isOwnedReport(report.id);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  }).format(new Date(report.created_at));

  const revealedKeys = Array.isArray((report.input_data as any)?.revealed_top_3)
    ? ((report.input_data as any).revealed_top_3 as string[]).slice(0, 3) as ValueKey[]
    : [];
  const aspirationalKeys = Array.isArray((report.input_data as any)?.aspirational_top_3)
    ? ((report.input_data as any).aspirational_top_3 as string[]).slice(0, 3) as ValueKey[]
    : [];
  const revealedValues = revealedKeys
    .map((k) => VALUES.find((v) => v.key === k))
    .filter((v): v is (typeof VALUES)[number] => Boolean(v));

  const handlePrint = () => {
    track('report_pdf_downloaded', { report_id: report.id });
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      {!isOwner && (
        <div className="no-print">
          <ShareHeader reportId={report.id} />
        </div>
      )}

      {/* Sticky top header */}
      <header className="no-print sticky top-0 z-40 w-full bg-background/85 backdrop-blur border-b border-border/60">
        <div className="max-w-[960px] mx-auto px-5 md:px-6 h-14 flex items-center justify-between">
          <span className="font-display font-semibold text-lg tracking-tight text-foreground">Norte</span>
          <Button variant="outline" size="sm" onClick={handlePrint} className="h-9">
            Download as PDF
          </Button>
        </div>
      </header>

      <article className="report-content max-w-[680px] mx-auto px-5 md:px-6 pt-10 md:pt-14 pb-16">
        <div className="pdf-header">
          <div className="pdf-header-title">NORTE. Your reading</div>
          <div className="pdf-header-date">{formattedDate}</div>
        </div>

        {/* Hero: revealed values with icons */}
        {revealedValues.length > 0 && (
          <section className="no-print mb-12 md:mb-16">
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5">
              Your revealed values
            </p>
            <div className="flex flex-wrap gap-3">
              {revealedValues.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div
                    key={v.key}
                    className="flex items-center gap-3 rounded-full border border-accent/60 bg-card/50 pl-3 pr-6 py-2.5"
                  >
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-accent/15 text-accent font-sans text-xs font-semibold">
                      {i + 1}
                    </span>
                    <Icon size={18} className="text-accent" />
                    <span className="font-display text-[18px] md:text-[20px] text-primary leading-none">
                      {v.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Visual gap comparison */}
        {revealedKeys.length > 0 && aspirationalKeys.length > 0 && (
          <div className="no-print">
            <GapVisualization revealed={revealedKeys} aspirational={aspirationalKeys} />
          </div>
        )}

        <ReportMarkdown markdown={report.report_markdown} />

        <hr className="no-print mt-16 mb-12 border-0 border-t border-border" />

        <div className="no-print">
          <ReportActions reportId={report.id} />
        </div>

        <p className="no-print mt-16 text-center text-sm text-muted-foreground italic">
          Norte · Anyone with this link can read this report.
        </p>
      </article>
    </div>
  );
}

