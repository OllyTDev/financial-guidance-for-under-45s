"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  ContentCard,
  PageShell,
} from "@/components/layout/page-shell";
import { RestartButton } from "@/components/layout/restart-button";
import { type AgeBand, AGE_BANDS } from "@/lib/age-bands";
import { getUserAge } from "@/lib/session-storage";

interface GuidancePageContentProps {
  band: AgeBand;
}

export function GuidancePageContent({ band }: GuidancePageContentProps) {
  const router = useRouter();
  const [age, setAge] = useState<number | null>(null);
  const bandInfo = AGE_BANDS[band];

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
      </ContentCard>
    </PageShell>
  );
}
