import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getPendingSession, clearPendingSession } from '@/lib/pendingSession';
import { markOwnedReport } from '@/lib/reportOwnership';
import { readPostPaywall } from '@/lib/postPaywallStore';

/**
 * On mount, checks whether a previous payment session has a finished report
 * waiting and recovers the user to it.
 */
export function SessionRecovery() {
  const navigate = useNavigate();
  const location = useLocation();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const pending = getPendingSession();
    if (!pending) return;

    // Already on the report or loading screen? Let those pages handle it.
    if (location.pathname.startsWith('/r/') || location.pathname.startsWith('/post-paywall/loading')) {
      return;
    }

    (async () => {
      const { data, error } = await supabase.functions.invoke('check-report-status', {
        body: { paymentSessionId: pending.id },
      });
      if (error || !data) return;
      if (data.status === 'complete' && data.report_id) {
        markOwnedReport(data.report_id);
        clearPendingSession();
        navigate(`/r/${data.report_id}`, { replace: true });
        return;
      }
      if (data.status === 'pending') {
        // Only resume loading if we still have the assessment data in memory.
        const state = readPostPaywall();
        if (state.paymentSessionId && state.assessment) {
          navigate('/post-paywall/loading', { replace: true });
        }
      }
    })().catch(() => { /* silent */ });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
