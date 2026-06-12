"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  ContentCard,
  PageShell,
} from "@/components/layout/page-shell";
import { RestartButton } from "@/components/layout/restart-button";
import { AGE_BANDS } from "@/lib/age-bands";
import { getUserAge } from "@/lib/session-storage";

const PLACEHOLDER_LINKS = [
  { label: "Pension guidance (placeholder)", href: "#pension-guidance" },
  { label: "Later-life planning (placeholder)", href: "#later-life-planning" },
];

export function Guidance45PlusContent() {
  const router = useRouter();
  const [age, setAge] = useState<number | null>(null);
  const bandInfo = AGE_BANDS["45-plus"];

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
        <p className="mt-4 text-sand-700">
          This tool focuses on guidance for people under 45. For pension and
          later-life planning, please use the dedicated resources below.
        </p>
        <p className="mt-4 rounded-xl bg-cream-100 px-4 py-3 text-sand-800">
          Age entered: <span className="font-semibold">{age}</span>
        </p>

        <div className="mt-8 space-y-3">
          <h2 className="text-lg font-medium text-sand-900">
            Other guidance tools
          </h2>
          <ul className="space-y-2">
            {PLACEHOLDER_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sand-800 underline decoration-sand-700/30 underline-offset-4 hover:decoration-sand-800"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </ContentCard>
    </PageShell>
  );
}
