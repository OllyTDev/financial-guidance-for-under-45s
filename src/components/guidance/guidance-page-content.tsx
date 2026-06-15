"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  ContentCard,
  PageShell,
} from "@/components/layout/page-shell";
import { RestartButton } from "@/components/layout/restart-button";
import { type AgeBand, AGE_BANDS } from "@/lib/age-bands";
import {
  FINANCES_INTRO_PATH,
  isFinanceJourneyBand,
} from "@/lib/journey-routes";
import { getUserAge } from "@/lib/session-storage";

interface GuidancePageContentProps {
  band: AgeBand;
}

export function GuidancePageContent({ band }: GuidancePageContentProps) {
  const router = useRouter();
  const [age, setAge] = useState<number | null>(null);
  const bandInfo = AGE_BANDS[band];
  const hasFinanceJourney = isFinanceJourneyBand(band);

  useEffect(() => {
    const storedAge = getUserAge();
    if (storedAge === null) {
      router.replace("/start/");
      return;
    }

    setAge(storedAge);
  }, [router]);

  if (age === null) {
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
      <ContentCard>
        <p className="text-sm font-medium uppercase tracking-wide text-sand-700">
          Your journey
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-sand-900">
          {bandInfo.title}
        </h1>
        <p className="mt-4 text-sand-700">{bandInfo.description}</p>
        <p className="mt-6 rounded-xl bg-cream-100 px-4 py-3 text-sand-800">
          Age entered: <span className="font-semibold">{age}</span>
        </p>

        {hasFinanceJourney ? (
          <div className="mt-8">
            <Link
              href={FINANCES_INTRO_PATH}
              className="inline-flex h-12 items-center justify-center rounded-lg bg-sand-800 px-8 text-base font-medium text-white transition-colors hover:bg-sand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand-800 focus-visible:ring-offset-2"
            >
              Continue
            </Link>
          </div>
        ) : null}
      </ContentCard>
    </PageShell>
  );
}
