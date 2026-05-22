import { useCallback, useEffect, useState } from 'react';
import type { ValueKey } from '@/lib/values';

export type BlockerAnswer =
  | 'not_tried'
  | 'other_priorities_win'
  | 'dont_know_what_it_looks_like'
  | 'hard_right_now'
  | 'not_sure_want_it'
  | 'other'
  | null;

export interface LoudestGap {
  value: ValueKey;
  label: string;
  // true when there's no real gap and we fell back to aspirational #1
  isFallback: boolean;
}

export interface AssessmentSnapshot {
  revealed_top_3: ValueKey[];
  revealed_full_ranking: ValueKey[];
  aspirational_top_3: ValueKey[];
  loudest_gap: { value: ValueKey; aspirational_rank: number; revealed_rank: number } | null;
  other_gaps: Array<{ value: ValueKey; aspirational_rank: number; revealed_rank: number }>;
}

export interface PostPaywallState {
  paymentSessionId: string;
  name: string;
  email: string;
  current_chapter: string;
  blocker_answer: BlockerAnswer;
  blocker_custom_text: string;
  wont_give_up: string;
  loudest_gap: LoudestGap | null;
  assessment: AssessmentSnapshot | null;
}

const STORAGE_KEY = 'norte_post_paywall';

const emptyState = (): PostPaywallState => ({
  paymentSessionId: '',
  name: '',
  email: '',
  current_chapter: '',
  blocker_answer: null,
  blocker_custom_text: '',
  wont_give_up: '',
  loudest_gap: null,
  assessment: null,
});

export function readPostPaywall(): PostPaywallState {
  if (typeof window === 'undefined') return emptyState();
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    return { ...emptyState(), ...JSON.parse(raw) };
  } catch {
    return emptyState();
  }
}

export function writePostPaywall(state: PostPaywallState) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearPostPaywall() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STORAGE_KEY);
}

export function hasPaymentSession(): boolean {
  return !!readPostPaywall().paymentSessionId;
}

export function usePostPaywallStore() {
  const [state, setState] = useState<PostPaywallState>(() => readPostPaywall());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setState(readPostPaywall());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const update = useCallback((patch: Partial<PostPaywallState>) => {
    setState(prev => {
      const next = { ...prev, ...patch };
      writePostPaywall(next);
      return next;
    });
  }, []);

  return { state, update };
}

export function genPaymentSessionId(): string {
  // best-effort uuid; not for security
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}
