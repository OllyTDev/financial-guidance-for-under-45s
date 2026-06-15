"use client";

import Link from "next/link";
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
import { getSectionPath } from "@/lib/journey-sections";

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

        <ContentCard className="flex flex-col gap-8">
          <JourneyProgressCup currentStep={0} className="w-full" />

          <div className="space-y-4 text-sand-700">
            <p>
              Your financial picture is split into six areas, from everyday
              spending at the bottom to long-term investments at the top. Each
              step fills in as you go.
            </p>
            <p>
              Remember: no information you enter ever leaves this device. You
              can start over at any time to clear everything.
            </p>
          </div>

          <div>
            <Link
              href={getSectionPath("everyday-living")}
              className="inline-flex h-12 items-center justify-center rounded-lg bg-sand-800 px-8 text-base font-medium text-white transition-colors hover:bg-sand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand-800 focus-visible:ring-offset-2"
            >
              Begin with Everyday living
            </Link>
          </div>
        </ContentCard>
      </div>
    </PageShell>
  );
}
