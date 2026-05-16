const KEY = 'norte_pending_session';
const TTL_MS = 24 * 60 * 60 * 1000;

interface Pending { id: string; startedAt: number; }

export function setPendingSession(id: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ id, startedAt: Date.now() } satisfies Pending));
  } catch { /* noop */ }
}

export function getPendingSession(): Pending | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Pending;
    if (!parsed?.id || !parsed?.startedAt) return null;
    if (Date.now() - parsed.startedAt > TTL_MS) {
      localStorage.removeItem(KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearPendingSession() {
  try { localStorage.removeItem(KEY); } catch { /* noop */ }
}
