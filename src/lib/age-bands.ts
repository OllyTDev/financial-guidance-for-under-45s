export type AgeBand = "7-12" | "13-17" | "18-45" | "over-45";

export interface AgeBandInfo {
  slug: AgeBand;
  title: string;
  description: string;
}

export const AGE_BANDS: Record<AgeBand, AgeBandInfo> = {
  "7-12": {
    slug: "7-12",
    title: "Ages 7–12",
    description: "Guidance for young savers.",
  },
  "13-17": {
    slug: "13-17",
    title: "Ages 13–17",
    description: "Guidance for teenagers.",
  },
  "18-45": {
    slug: "18-45",
    title: "Ages 18–45",
    description: "Guidance for adults building financial foundations.",
  },
  "over-45": {
    slug: "over-45",
    title: "Ages 45+",
    description: "Signposting to pension and later-life guidance.",
  },
};

export type AgeValidationResult =
  | { status: "valid"; band: AgeBand; age: number }
  | { status: "too-young" }
  | { status: "too-wise" };

export function getAgeBand(age: number): AgeBand {
  if (age >= 45) return "over-45";
  if (age >= 18) return "18-45";
  if (age >= 13) return "13-17";
  return "7-12";
}

export function validateAge(age: number): AgeValidationResult {
  if (age < 7) return { status: "too-young" };
  if (age > 100) return { status: "too-wise" };

  return { status: "valid", band: getAgeBand(age), age };
}

export function getGuidancePath(band: AgeBand): string {
  return `/guidance/${band}/`;
}
