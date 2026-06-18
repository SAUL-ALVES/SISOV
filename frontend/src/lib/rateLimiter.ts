interface RateLimitEntry {
  timestamps: number[];
  blocked: boolean;
  blockedUntil: number;
}

interface RateLimitRule {
  maxRequests: number;
  windowMs: number;
  blockDurationMs: number;
}

const RULES: Record<string, RateLimitRule> = {
  '/auth/login': { maxRequests: 5, windowMs: 60_000, blockDurationMs: 30_000 },
  '/auth/register': { maxRequests: 3, windowMs: 300_000, blockDurationMs: 60_000 },
  default: { maxRequests: 60, windowMs: 60_000, blockDurationMs: 5_000 },
};

const entries = new Map<string, RateLimitEntry>();

function getRule(url: string): RateLimitRule {
  for (const [pattern, rule] of Object.entries(RULES)) {
    if (pattern !== 'default' && url.includes(pattern)) return rule;
  }
  return RULES.default;
}

function cleanOldEntries(entry: RateLimitEntry, windowMs: number) {
  const cutoff = Date.now() - windowMs;
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
}

export function checkRateLimit(url: string): { allowed: boolean; retryAfterMs: number } {
  const rule = getRule(url);
  const key = url.split('?')[0];

  let entry = entries.get(key);
  if (!entry) {
    entry = { timestamps: [], blocked: false, blockedUntil: 0 };
    entries.set(key, entry);
  }

  if (entry.blocked && Date.now() < entry.blockedUntil) {
    return { allowed: false, retryAfterMs: entry.blockedUntil - Date.now() };
  }
  entry.blocked = false;

  cleanOldEntries(entry, rule.windowMs);

  if (entry.timestamps.length >= rule.maxRequests) {
    entry.blocked = true;
    entry.blockedUntil = Date.now() + rule.blockDurationMs;
    return { allowed: false, retryAfterMs: rule.blockDurationMs };
  }

  entry.timestamps.push(Date.now());
  return { allowed: true, retryAfterMs: 0 };
}

export function resetRateLimit(url: string) {
  entries.delete(url.split('?')[0]);
}

export function resetAllRateLimits() {
  entries.clear();
}
