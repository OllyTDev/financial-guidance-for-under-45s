"use client";

import Link from "next/link";
import { useEffect } from "react";

import { JourneyProgressCup } from "@/components/guidance/journey-progress-cup";
import {
  ContentCard,
  PageShell,
} from "@/components/layout/page-shell";
import { RestartButton } from "@/components/layout/restart-button";
import { useFinanceJourneyGuard } from "@/hooks/use-finance-journey-guard";
import { setJourneyProgress } from "@/lib/journey-progress";
import {
  getNextSection,
  getSectionPath,
  type JourneySection,
} from "@/lib/journey-sections";

interface FinanceSectionContentProps {
  section: JourneySection;
}

export function FinanceSectionContent({ section }: FinanceSectionContentProps) {
  const isReady = useFinanceJourneyGuard();
  const nextSection = getNextSection(section.step);

  useEffect(() => {
    if (!isReady) return;
    setJourneyProgress(section.step);
  }, [isReady, section.step]);

  if (!isReady) {
    return (
      <PageShell showRestart restartSlot={<RestartButton />}>
        <ContentCard>
          <p className="text-sand-700">Loading…</p>
        </ContentCard>
      </PageShell>
    );
  }

  return (
    <PageShell showRestart restartSlot={<RestartButton />}>
      <div className="flex flex-1 flex-col justify-center gap-8">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wide text-sand-700">
            Step {section.step} of 6
          </p>
          <h1 className="text-3xl font-semibold text-sand-900 sm:text-4xl">
            {section.title}
          </h1>
          <p className="text-lg text-sand-700">
            You&apos;ve crossed into a new part of your financial picture.
          </p>
        </div>

        <ContentCard>
          <JourneyProgressCup
            currentStep={section.step}
            showYouAreHere
            className="mb-6"
          />

          <p className="text-sand-700">
            We&apos;ll gather information about your{" "}
            <span className="font-medium text-sand-900">
              {section.title.toLowerCase()}
            </span>{" "}
            here. Content for this step is coming soon.
          </p>

          {nextSection ? (
            <div className="mt-8">
              <Link
                href={getSectionPath(nextSection.slug)}
                className="inline-flex h-12 items-center justify-center rounded-lg bg-sand-800 px-8 text-base font-medium text-white transition-colors hover:bg-sand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand-800 focus-visible:ring-offset-2"
              >
                Continue to {nextSection.title}
              </Link>
            </div>
          ) : (
            <p className="mt-8 text-sm text-sand-700">
              You&apos;ve reached the top of your financial picture for now.
            </p>
          )}
        </ContentCard>
      </div>
    </PageShell>
  );
}
