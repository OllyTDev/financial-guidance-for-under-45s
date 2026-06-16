export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getSessionStorage(): Storage | null {
  if (!isBrowser()) return null;
  return window.sessionStorage;
}
