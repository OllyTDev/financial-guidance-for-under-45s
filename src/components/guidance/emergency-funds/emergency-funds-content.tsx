"use client";

import { useEffect } from "react";

import { EmergencyFundsForm } from "@/components/guidance/emergency-funds/emergency-funds-form";
import { JourneyProgressCup } from "@/components/guidance/journey-progress-cup";
import { ContentCard } from "@/components/layout/page-shell";
import { FinanceJourneyShell } from "@/components/layout/finance-journey-shell";
import { useFinanceJourneyGuard } from "@/hooks/use-finance-journey-guard";
import { setJourneyProgress } from "@/lib/journey-progress";

export function EmergencyFundsContent() {
  const isReady = useFinanceJourneyGuard();

  useEffect(() => {
    if (!isReady) return;
    setJourneyProgress(2);
  }, [isReady]);

  const header = (
    <div className="space-y-3">
      <p className="text-sm font-medium uppercase tracking-wide text-sand-700">
        Step 2 of 6
      </p>
      <h1 className="text-3xl font-semibold text-sand-900 sm:text-4xl">
        Emergency Funds
      </h1>
    </div>
  );

  if (!isReady) {
    return (
      <FinanceJourneyShell activeSlug="emergency-funds" header={header}>
        <ContentCard>
          <p className="text-sand-700">Loading…</p>
        </ContentCard>
      </FinanceJourneyShell>
    );
  }

  return (
    <FinanceJourneyShell activeSlug="emergency-funds" header={header}>
      <ContentCard>
        <JourneyProgressCup
          currentStep={2}
          showYouAreHere
          className="mb-8"
        />
        <EmergencyFundsForm />
      </ContentCard>
    </FinanceJourneyShell>
  );
}
