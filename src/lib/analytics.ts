// Lightweight analytics shim for v1. Replace with PostHog/Plausible later.
export type AnalyticsEvent =
  | 'report_generated'
  | 'report_viewed'
  | 'report_pdf_downloaded'
  | 'report_link_copied'
  | 'report_upsell_clicked'
  | 'report_404'
  | 'report_review_submitted';

export function track(event: AnalyticsEvent, props: Record<string, unknown> = {}) {
  // eslint-disable-next-line no-console
  console.log(`[analytics] ${event}`, props);
}
