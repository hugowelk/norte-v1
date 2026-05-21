import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { isOwnedReport } from '@/lib/reportOwnership';
import { ShareHeader } from '@/components/report/ShareHeader';
import { PrivacyNotice } from '@/components/report/PrivacyNotice';
import { ReportMarkdown } from '@/components/report/ReportMarkdown';
import { ReportActions } from '@/components/report/ReportActions';
import { ReportNotFound } from '@/components/report/ReportNotFound';
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

  return (
    <div className="min-h-screen bg-background">
      {!isOwner && (
        <div className="no-print">
          <ShareHeader reportId={report.id} />
        </div>
      )}

      <article className="report-content max-w-[640px] mx-auto px-6 md:px-0 pt-20 pb-16">
        <div className="pdf-header">
          <div className="pdf-header-title">NORTE. Your reading</div>
          <div className="pdf-header-date">{formattedDate}</div>
        </div>

        {isOwner && (
          <div className="no-print">
            <PrivacyNotice reportId={report.id} />
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
