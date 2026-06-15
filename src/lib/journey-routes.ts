import { type AgeBand, getAgeBand, getGuidancePath } from "@/lib/age-bands";

export const FINANCE_JOURNEY_BANDS = ["13-17", "18-45"] as const;

export type FinanceJourneyBand = (typeof FINANCE_JOURNEY_BANDS)[number];

export const FINANCES_INTRO_PATH = "/guidance/finances/intro/";

export function isFinanceJourneyBand(band: AgeBand): band is FinanceJourneyBand {
  return band === "13-17" || band === "18-45";
}

export function getBandForStoredAge(age: number): AgeBand {
  return getAgeBand(age);
}

export function getRedirectPathForAge(age: number): string {
  return getGuidancePath(getAgeBand(age));
}
