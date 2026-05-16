import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { readPostPaywall, clearPostPaywall } from '@/lib/postPaywallStore';
import { TIME_OPTIONS, MONEY_OPTIONS } from '@/lib/values';
import { Button } from '@/components/ui/button';

const STATUS_LINES = [
  'Reading your trade-offs…',
  'Connecting the pattern to what you said about your life…',
  'Writing your report. This usually takes about 30 seconds.',
];

const LINE_DURATION_MS = 8000;
const MAX_RETRIES = 3;

function buildRequestBody() {
  const state = readPostPaywall();
  const a = state.assessment;
  if (!state.paymentSessionId || !a) return null;

  const gaps = findAspirationalGaps(a.aspirational_top_5, a.revealed_top_3);
  const loudest = gaps[0]
    ? { value: gaps[0].value, aspirational_rank: a.aspirational_top_5.indexOf(gaps[0].value) + 1, revealed_rank: gaps[0].rank }
    : null;
  const otherGaps = gaps.slice(1).map(g => ({
    value: g.value,
    aspirational_rank: a.aspirational_top_5.indexOf(g.value) + 1,
    revealed_rank: g.rank,
  }));

  // time/money picks may already be labels (set at paywall handoff) or indices — normalize.
  const toLabels = (arr: string[], options: typeof TIME_OPTIONS) =>
    arr.map(v => {
      const n = Number(v);
      if (!Number.isNaN(n) && options[n]) return options[n].label;
      return v;
    });

  return {
    paymentSessionId: state.paymentSessionId,
    assessmentResults: {
      revealed_top_3: a.revealed_top_3,
      revealed_full_ranking: a.revealed_full_ranking,
      aspirational_top_5: a.aspirational_top_5,
      loudest_gap: loudest,
      other_gaps: otherGaps,
      time_picks: toLabels(a.time_picks, TIME_OPTIONS),
      money_picks: toLabels(a.money_picks, MONEY_OPTIONS),
    },
    postPaywallAnswers: {
      name: state.name,
      current_chapter: state.current_chapter,
      blocker_answer: state.blocker_answer ?? '',
      blocker_custom_text: state.blocker_custom_text,
      wont_give_up: state.wont_give_up,
    },
  };
}

export function LoadingPlaceholder() {
  const navigate = useNavigate();
  const [lineIdx, setLineIdx] = useState(0);
  const [status, setStatus] = useState<'loading' | 'error' | 'final-error'>('loading');
  const [retries, setRetries] = useState(0);
  const startedRef = useRef(false);

  const run = async () => {
    setStatus('loading');
    setLineIdx(0);
    const body = buildRequestBody();
    if (!body) {
      setStatus('final-error');
      return;
    }
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 90_000);
      const { data, error } = await supabase.functions.invoke('generate-report', { body });
      clearTimeout(timeout);

      if (error) throw error;
      if (data?.success && data?.report_id) {
        clearPostPaywall();
        navigate(`/r/${data.report_id}`, { replace: true });
        return;
      }
      throw new Error(data?.error || 'Generation failed');
    } catch (err) {
      console.error('generate-report failed:', err);
      setRetries(r => {
        const next = r + 1;
        setStatus(next >= MAX_RETRIES ? 'final-error' : 'error');
        return next;
      });
    }
  };

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rotate status lines while loading
  useEffect(() => {
    if (status !== 'loading') return;
    const t = setInterval(() => {
      setLineIdx(i => (i < STATUS_LINES.length - 1 ? i + 1 : i));
    }, LINE_DURATION_MS);
    return () => clearInterval(t);
  }, [status]);

  if (status === 'final-error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-4">
          <p className="text-lg font-display text-foreground">
            We're having trouble generating your report right now.
          </p>
          <p className="text-base text-muted-foreground">
            Please contact{' '}
            <a href="mailto:support@norte.app" className="underline">
              support@norte.app
            </a>{' '}
            — your payment is safe and we'll get this to you.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-6">
          <div className="space-y-2">
            <p className="text-lg font-display text-foreground">
              Something interrupted the generation.
            </p>
            <p className="text-base text-muted-foreground">
              We've saved your answers — try again?
            </p>
          </div>
          <Button onClick={run} size="lg">Retry →</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <motion.div
        className="w-12 h-12 rounded-full border-2 border-accent"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="mt-8 h-6 relative w-full max-w-md text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={lineIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 text-base text-foreground font-sans"
          >
            {STATUS_LINES[lineIdx]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
