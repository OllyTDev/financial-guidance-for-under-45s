"use client";

import { useEffect } from "react";

import { EverydayLivingForm } from "@/components/guidance/everyday-living/everyday-living-form";
import { JourneyProgressCup } from "@/components/guidance/journey-progress-cup";
import {
  ContentCard,
  PageShell,
} from "@/components/layout/page-shell";
import { RestartButton } from "@/components/layout/restart-button";
import { useFinanceJourneyGuard } from "@/hooks/use-finance-journey-guard";
import { setJourneyProgress } from "@/lib/journey-progress";

export function EverydayLivingContent() {
  const isReady = useFinanceJourneyGuard();

  useEffect(() => {
    if (!isReady) return;
    setJourneyProgress(1);
  }, [isReady]);

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
      <div className="flex flex-1 flex-col gap-8">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wide text-sand-700">
            Step 1 of 6
          </p>
          <h1 className="text-3xl font-semibold text-sand-900 sm:text-4xl">
            Everyday living
          </h1>
        </div>

        <ContentCard>
          <JourneyProgressCup
            currentStep={1}
            showYouAreHere
            className="mb-8"
          />
          <EverydayLivingForm />
        </ContentCard>
      </div>
    </PageShell>
  );
}
