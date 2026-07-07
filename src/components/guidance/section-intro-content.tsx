"use client";

import Link from "next/link";
import { useEffect } from "react";

import { JourneyProgressCup } from "@/components/guidance/journey-progress-cup";
import { ContentCard } from "@/components/layout/page-shell";
import { FinanceJourneyShell } from "@/components/layout/finance-journey-shell";
import { useFinanceJourneyGuard } from "@/hooks/use-finance-journey-guard";
import { setJourneyProgress } from "@/lib/journey-progress";
import {
  getSectionQuestionsPath,
  type JourneySection,
} from "@/lib/journey-sections";
import { getSectionIntro } from "@/lib/section-intros";

interface SectionIntroContentProps {
  section: JourneySection;
}

export function SectionIntroContent({ section }: SectionIntroContentProps) {
  const isReady = useFinanceJourneyGuard();
  const intro = getSectionIntro(section.slug);

  useEffect(() => {
    if (!isReady) return;
    setJourneyProgress(section.step);
  }, [isReady, section.step]);

  const header = (
    <div className="space-y-3">
      <p className="text-sm font-medium uppercase tracking-wide text-sand-700">
        Step {section.step} of 6
      </p>
      <h1 className="text-3xl font-semibold text-sand-900 sm:text-4xl">
        {section.title}
      </h1>
    </div>
  );

  if (!isReady || !intro) {
    return (
      <FinanceJourneyShell activeSlug={section.slug} header={header}>
        <ContentCard>
          <p className="text-sand-700">Loading…</p>
        </ContentCard>
      </FinanceJourneyShell>
    );
  }

  return (
    <FinanceJourneyShell activeSlug={section.slug} header={header}>
      <ContentCard className="space-y-6">
        <JourneyProgressCup
          currentStep={section.step}
          showYouAreHere
          className="mb-2"
        />

        <div className="space-y-4 text-sand-700">
          {intro.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div>
          <Link
            href={getSectionQuestionsPath(section.slug)}
            className="inline-flex h-12 items-center justify-center rounded-lg bg-sand-800 px-8 text-base font-medium text-white transition-colors hover:bg-sand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand-800 focus-visible:ring-offset-2"
          >
            Continue
          </Link>
        </div>
      </ContentCard>
    </FinanceJourneyShell>
  );
}
