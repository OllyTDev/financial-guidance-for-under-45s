"use client";

import { useEffect } from "react";

import {
  ContentCard,
  PageShell,
  PrivacyBadge,
} from "@/components/layout/page-shell";
import { RestartButton } from "@/components/layout/restart-button";
import { JourneyProgressCup } from "@/components/guidance/journey-progress-cup";
import { useFinanceJourneyGuard } from "@/hooks/use-finance-journey-guard";
import { setJourneyProgress } from "@/lib/journey-progress";

const INTRO_DEMO_FILL = 18;

export function FinancesIntroContent() {
  const isReady = useFinanceJourneyGuard();

  useEffect(() => {
    if (!isReady) return;
    setJourneyProgress(0);
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
      <div className="flex flex-1 flex-col justify-center gap-8">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wide text-sand-700">
            Your finances
          </p>
          <h1 className="text-3xl font-semibold text-sand-900 sm:text-4xl">
            Building your picture
          </h1>
          <p className="text-lg text-sand-700">
            We&apos;re going to start getting information from you on your
            current finances.
          </p>
        </div>

        <PrivacyBadge />

        <ContentCard className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
          <JourneyProgressCup
            fillPercent={INTRO_DEMO_FILL}
            animateOnMount
            className="shrink-0"
          />

          <div className="space-y-4 text-sand-700">
            <p>
              As you move through this journey, each answer adds to your
              financial picture — like filling a cup from the bottom up.
            </p>
            <p>
              Remember: no information you enter ever leaves this device. You
              can start over at any time to clear everything.
            </p>
          </div>
        </ContentCard>
      </div>
    </PageShell>
  );
}
