import {
  getSectionFillPercent,
  JOURNEY_TOTAL_STEPS,
} from "@/lib/journey-sections";

const JOURNEY_PROGRESS_KEY = "fg-journey-progress";

export { JOURNEY_TOTAL_STEPS };

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
  return getSectionFillPercent(step);
}

export function clearJourneyProgress(): void {
  sessionStorage.removeItem(JOURNEY_PROGRESS_KEY);
}
