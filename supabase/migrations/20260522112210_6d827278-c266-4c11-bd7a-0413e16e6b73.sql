
-- 1. Hide Stripe payment_session_id from public reads on reports.
-- The reports table is publicly readable by anyone with the (unguessable) report id,
-- which is intentional for shareable readings. But payment_session_id is sensitive
-- internal billing data and should not be exposed.
REVOKE SELECT (payment_session_id) ON public.reports FROM anon, authenticated;

-- 2. Tighten the report_reviews insert policy: cap rating to 1..5 and feedback length.
DROP POLICY IF EXISTS "Anyone can submit a review" ON public.report_reviews;
CREATE POLICY "anyone can submit a review"
ON public.report_reviews
FOR INSERT
TO anon, authenticated
WITH CHECK (
  rating BETWEEN 1 AND 5
  AND (feedback IS NULL OR length(feedback) <= 2000)
  AND (report_id IS NULL OR (length(report_id) >= 1 AND length(report_id) <= 64))
);

-- 3. Harden increment_report_view: pin search_path so it can't be hijacked.
CREATE OR REPLACE FUNCTION public.increment_report_view(p_id text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.reports
  SET view_count = view_count + 1
  WHERE id = p_id;
$$;
