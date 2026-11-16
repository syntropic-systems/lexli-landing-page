/**
 * Catches misspelt common email domains ("gmial.com", "yahoo.co.n") so the form can ask
 * "Did you mean …?". The browser only checks an address's shape, so these would otherwise go
 * through and we would write to an address that does not exist. A hint, never a block: a
 * domain we do not know is assumed to be right.
 */

/** Providers most of our visitors use, Indian ones included. */
const COMMON_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'yahoo.co.in',
  'yahoo.in',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'icloud.com',
  'rediffmail.com',
  'protonmail.com',
  'proton.me',
  // Real providers a letter or two from the ones above, listed so they are never "corrected".
  'ymail.com',
  'mail.com',
  'aol.com',
  'gmx.com',
  'zoho.com',
  'zohomail.in',
];

/** Edit distance between two short strings; a swap of neighbours counts as one edit. */
function distance(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

/**
 * The corrected address when the domain is one or two edits from a common provider, or null.
 * Only close misses count, and only for domains of similar length, so a real company domain
 * ("gmaps.co.in", "lexli.ai") is never "corrected".
 */
export function suggestEmail(email: string): string | null {
  const at = email.lastIndexOf('@');
  if (at < 1) return null;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1).trim().toLowerCase();
  if (!domain || COMMON_DOMAINS.includes(domain)) return null;

  let best: { domain: string; d: number } | null = null;
  for (const candidate of COMMON_DOMAINS) {
    const d = distance(domain, candidate);
    const allowed = candidate.length > 9 ? 2 : 1;
    if (d <= allowed && (!best || d < best.d)) best = { domain: candidate, d };
  }
  return best ? `${local}@${best.domain}` : null;
}
