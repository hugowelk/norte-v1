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
import { ChosenValuesHero } from '@/components/report/ChosenValuesHero';
import { ReviewDialog } from '@/components/report/ReviewDialog';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { track } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
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
  // Unique title + canonical per report ID so each URL is distinguishable.
  const shortId = reportId ? reportId.slice(0, 8) : '';
  useDocumentMeta(
    reportId ? [
      { name: 'robots', content: 'noindex' },
      { name: 'description', content: `A personal Norte values reading (${shortId}). Someone's revealed and aspirational values, and the gap between them.` },
      { property: 'og:title', content: `A Norte reading · ${shortId}` },
      { property: 'og:description', content: "Someone's values, behaviour, and the gap between them." },
      { property: 'og:image', content: 'https://findmyvalues.app/og-default.png' },
      { property: 'og:url', content: `https://findmyvalues.app/r/${reportId}` },
    ] : [],
    reportId ? {
      title: `Norte reading · ${shortId}`,
      canonical: `https://findmyvalues.app/r/${reportId}`,
    } : undefined
  );

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
  const revealedFullRanking = Array.isArray((report.input_data as any)?.revealed_full_ranking)
    ? ((report.input_data as any).revealed_full_ranking as string[]) as ValueKey[]
    : [];


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
          <div className="pdf-header-title">Norte</div>
          <div className="pdf-header-date">findmyvalues.app</div>
        </div>

        {/* Hero: chosen (aspirational) values — expandable */}
        {aspirationalKeys.length > 0 && (
          <ChosenValuesHero chosen={aspirationalKeys} />
        )}

        {/* Visual gap comparison */}
        {revealedKeys.length > 0 && aspirationalKeys.length > 0 && (
          <GapVisualization revealedFull={revealedFullRanking} aspirational={aspirationalKeys} />
        )}

        {/* Large visual divider into the written reading */}
        <div className="my-12 md:my-16 flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-accent/15 text-accent mb-4">
            <Sparkles size={22} strokeWidth={1.5} />
          </div>
          <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-2">
            Your reading
          </p>
          <p className="font-display text-[22px] md:text-[26px] leading-[1.3] text-primary max-w-md">
            What your trade-offs revealed, and what to do about it.
          </p>
        </div>

        <ReportMarkdown markdown={report.report_markdown} />

        {/* Visual closing divider */}
        <div className="mt-16 mb-12 flex items-center gap-4">
          <hr className="flex-1 border-0 border-t border-border" />
          <span className="font-display text-sm uppercase tracking-[0.22em] text-muted-foreground">
            Norte
          </span>
          <hr className="flex-1 border-0 border-t border-border" />
        </div>

        <div className="no-print">
          <ReportActions reportId={report.id} />
        </div>

        <div className="no-print mt-16 flex flex-col items-center gap-3 text-center">
          <ReviewDialog reportId={report.id} />
          <p className="text-sm text-muted-foreground italic">
            Norte - 2026© - findmyvalues.app
          </p>
        </div>
      </article>
    </div>
  );
}

