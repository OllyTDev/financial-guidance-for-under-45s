"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  getRedirectPathForAge,
  isFinanceJourneyBand,
} from "@/lib/journey-routes";
import { getAgeBand } from "@/lib/age-bands";
import { getUserAge } from "@/lib/session-storage";

export function useFinanceJourneyGuard(): boolean {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const age = getUserAge();
    if (age === null) {
      router.replace("/start/");
      return;
    }

    const band = getAgeBand(age);
    if (!isFinanceJourneyBand(band)) {
      router.replace(getRedirectPathForAge(age));
      return;
    }

    setIsReady(true);
  }, [router]);

  return isReady;
}
