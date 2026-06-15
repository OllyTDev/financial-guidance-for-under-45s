const JOURNEY_PROGRESS_KEY = "fg-journey-progress";

export const JOURNEY_TOTAL_STEPS = 5;

export function getJourneyProgress(): number {
  const value = sessionStorage.getItem(JOURNEY_PROGRESS_KEY);
  if (!value) return 0;

  const progress = Number.parseInt(value, 10);
  return Number.isNaN(progress) ? 0 : progress;
}

export function setJourneyProgress(step: number): void {
  sessionStorage.setItem(JOURNEY_PROGRESS_KEY, String(step));
}

export function getJourneyFillPercent(step: number = getJourneyProgress()): number {
  if (JOURNEY_TOTAL_STEPS <= 0) return 0;
  return Math.min(100, Math.max(0, (step / JOURNEY_TOTAL_STEPS) * 100));
}

export function clearJourneyProgress(): void {
  sessionStorage.removeItem(JOURNEY_PROGRESS_KEY);
}
