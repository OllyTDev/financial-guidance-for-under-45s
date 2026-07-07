export interface JourneySection {
  slug: string;
  title: string;
  color: string;
  step: number;
}

export const JOURNEY_SECTIONS: JourneySection[] = [
  {
    slug: "everyday-living",
    title: "Everyday living",
    color: "#F9D4D4",
    step: 1,
  },
  {
    slug: "emergency-funds",
    title: "Emergency Funds",
    color: "#F9E0D4",
    step: 2,
  },
  {
    slug: "debt",
    title: "Debt",
    color: "#F5E8D4",
    step: 3,
  },
  {
    slug: "easy-access-savings",
    title: "Easy Access Savings",
    color: "#E8F0D4",
    step: 4,
  },
  {
    slug: "life-purchases",
    title: "Life Purchases",
    color: "#D8F0DC",
    step: 5,
  },
  {
    slug: "long-term-investments",
    title: "Long Term Investments",
    color: "#C8F0D8",
    step: 6,
  },
];

export const JOURNEY_TOTAL_STEPS = JOURNEY_SECTIONS.length;

export function getSectionByStep(step: number): JourneySection | undefined {
  return JOURNEY_SECTIONS.find((section) => section.step === step);
}

export function getSectionBySlug(slug: string): JourneySection | undefined {
  return JOURNEY_SECTIONS.find((section) => section.slug === slug);
}

export function getSectionPath(slug: string): string {
  return `/guidance/finances/${slug}/`;
}

export function getSectionQuestionsPath(slug: string): string {
  return `/guidance/finances/${slug}/questions/`;
}

export function getNextSection(step: number): JourneySection | undefined {
  return getSectionByStep(step + 1);
}

export function getSectionFillPercent(step: number): number {
  if (step <= 0) return 0;
  return Math.min(100, (step / JOURNEY_TOTAL_STEPS) * 100);
}
