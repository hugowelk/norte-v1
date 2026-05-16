const OWNED_KEY = 'norte_owned_reports';

function readOwned(): string[] {
  try {
    const raw = localStorage.getItem(OWNED_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function isOwnedReport(id: string): boolean {
  return readOwned().includes(id);
}

export function markOwnedReport(id: string) {
  const owned = readOwned();
  if (!owned.includes(id)) {
    owned.push(id);
    localStorage.setItem(OWNED_KEY, JSON.stringify(owned));
  }
}

export function isShareHeaderDismissed(id: string): boolean {
  return localStorage.getItem(`norte_dismissed_share_header_${id}`) === '1';
}

export function dismissShareHeader(id: string) {
  localStorage.setItem(`norte_dismissed_share_header_${id}`, '1');
}

export function hasSeenPrivacyNotice(id: string): boolean {
  return localStorage.getItem(`norte_seen_privacy_notice_${id}`) === '1';
}

export function markPrivacyNoticeSeen(id: string) {
  localStorage.setItem(`norte_seen_privacy_notice_${id}`, '1');
}
