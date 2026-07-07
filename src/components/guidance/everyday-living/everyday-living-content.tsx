"use client";

import { useEffect } from "react";

import { EverydayLivingForm } from "@/components/guidance/everyday-living/everyday-living-form";
import { JourneyProgressCup } from "@/components/guidance/journey-progress-cup";
import { ContentCard } from "@/components/layout/page-shell";
import { FinanceJourneyShell } from "@/components/layout/finance-journey-shell";
import { useFinanceJourneyGuard } from "@/hooks/use-finance-journey-guard";
import { setJourneyProgress } from "@/lib/journey-progress";

export function EverydayLivingContent() {
  const isReady = useFinanceJourneyGuard();

  useEffect(() => {
    if (!isReady) return;
    setJourneyProgress(1);
  }, [isReady]);

  const header = (
    <div className="space-y-3">
      <p className="text-sm font-medium uppercase tracking-wide text-sand-700">
        Step 1 of 6
      </p>
      <h1 className="text-3xl font-semibold text-sand-900 sm:text-4xl">
        Everyday living
      </h1>
    </div>
  );

  if (!isReady) {
    return (
      <FinanceJourneyShell activeSlug="everyday-living" header={header}>
        <ContentCard>
          <p className="text-sand-700">Loading…</p>
        </ContentCard>
      </FinanceJourneyShell>
    );
  }

  return (
    <FinanceJourneyShell activeSlug="everyday-living" header={header}>
      <ContentCard>
        <JourneyProgressCup
          currentStep={1}
          showYouAreHere
          className="mb-8"
        />
        <EverydayLivingForm />
      </ContentCard>
    </FinanceJourneyShell>
  );
}
