const KEY = "verifyEmail";

type VerifyEmailCache = { email: string; ts: number };

export function setVerifyEmailCache(email: string) {
  try {
    const payload: VerifyEmailCache = { email, ts: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(payload));
  } catch {}
}

export function getVerifyEmailCache(maxAgeMs = 1000 * 60 * 60) {
  // 60 phút
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const payload = JSON.parse(raw) as VerifyEmailCache;
    if (Date.now() - payload.ts > maxAgeMs) return null;
    return payload.email;
  } catch {
    return null;
  }
}

export function clearVerifyEmailCache() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}
