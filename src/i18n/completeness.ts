// Compare a locale's key set against the English source of truth.
// Locales missing any key are considered incomplete and hidden from users.

function collectKeys(obj: unknown, prefix = "", out: Set<string> = new Set()): Set<string> {
  if (obj === null || typeof obj !== "object") return out;
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      collectKeys(v, path, out);
    } else {
      out.add(path);
    }
  }
  return out;
}

export function missingKeys(reference: unknown, candidate: unknown): string[] {
  const ref = collectKeys(reference);
  const cand = collectKeys(candidate);
  const missing: string[] = [];
  ref.forEach((k) => {
    if (!cand.has(k)) missing.push(k);
  });
  return missing;
}

export function isComplete(reference: unknown, candidate: unknown): boolean {
  return missingKeys(reference, candidate).length === 0;
}
