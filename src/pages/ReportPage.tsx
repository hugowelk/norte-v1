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
        return;
      }
      setReport(data as Report);
      setStatus('ok');
      // fire-and-forget view increment
      supabase.rpc('increment_report_view', { p_id: reportId }).then(() => {});
    })();
    return () => { cancelled = true; };
  }, [reportId]);

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

  return (
    <div className="min-h-screen bg-background">
      {!isOwner && <ShareHeader reportId={report.id} />}

      <article className="max-w-[640px] mx-auto px-6 md:px-0 pt-20 pb-16">
        {isOwner && <PrivacyNotice reportId={report.id} />}

        <ReportMarkdown markdown={report.report_markdown} />

        <div className="mt-[72px]">
          <ReportActions />
        </div>

        <p className="mt-16 text-center text-sm text-muted-foreground italic">
          Norte · Anyone with this link can read this report.
        </p>
      </article>
    </div>
  );
}
