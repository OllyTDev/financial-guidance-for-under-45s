"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  ContentCard,
  PageShell,
} from "@/components/layout/page-shell";
import { RestartButton } from "@/components/layout/restart-button";
import { getUserAge } from "@/lib/session-storage";

const PLACEHOLDER_LINK_COUNT = 2;

export function GuidanceOver45Content() {
  const router = useRouter();
  const [age, setAge] = useState<number | null>(null);

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
        <h1 className="text-3xl font-semibold text-sand-900">Ages 45+</h1>
        <p className="mt-4 text-lg text-sand-700">
          You&apos;re over 45, you might be interested in these:
        </p>

        <ul className="mt-6 space-y-3">
          {Array.from({ length: PLACEHOLDER_LINK_COUNT }, (_, index) => (
            <li
              key={index}
              className="rounded-lg border border-dashed border-sand-700/20 bg-cream-50 px-4 py-3 text-sand-700"
            >
              Link coming soon
            </li>
          ))}
        </ul>
      </ContentCard>
    </PageShell>
  );
}
