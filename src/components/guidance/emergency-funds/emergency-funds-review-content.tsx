"use client";

import Link from "next/link";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { JourneyProgressCup } from "@/components/guidance/journey-progress-cup";
import { ContentCard } from "@/components/layout/page-shell";
import { FinanceJourneyShell } from "@/components/layout/finance-journey-shell";
import { useFinanceJourneyGuard } from "@/hooks/use-finance-journey-guard";
import { formatPounds } from "@/lib/everyday-living-calculations";
import {
  getEverydayLivingData,
  type EverydayLivingData,
} from "@/lib/everyday-living-storage";
import {
  buildEmergencyFundsSummary,
  isEmergencyFundsComplete,
} from "@/lib/emergency-funds-calculations";
import {
  type EmergencyFundsData,
  getEmergencyFundsData,
} from "@/lib/emergency-funds-storage";
import { setJourneyProgress } from "@/lib/journey-progress";
import {
  getSectionPath,
  getSectionQuestionsPath,
} from "@/lib/journey-sections";
import { getUserAge } from "@/lib/session-storage";

export function EmergencyFundsReviewContent() {
  const router = useRouter();
  const isReady = useFinanceJourneyGuard();
  const [everydayData, setEverydayData] = useState<EverydayLivingData | null>(
    null,
  );
  const [data, setData] = useState<EmergencyFundsData | null>(null);
  const [age, setAge] = useState<number | null>(null);

  useEffect(() => {
    setEverydayData(getEverydayLivingData());
    setData(getEmergencyFundsData());
    setAge(getUserAge());
  }, []);

  useEffect(() => {
    if (!isReady || everydayData === null || data === null) return;
    setJourneyProgress(2);

    if (!isEmergencyFundsComplete(everydayData, data, age)) {
      router.replace(getSectionQuestionsPath("emergency-funds"));
    }
  }, [isReady, everydayData, data, age, router]);

  const header = (
    <div className="space-y-3">
      <p className="text-sm font-medium uppercase tracking-wide text-sand-700">
        Emergency funds review
      </p>
      <h1 className="text-3xl font-semibold text-sand-900 sm:text-4xl">
        Your emergency fund
      </h1>
    </div>
  );

  if (
    !isReady ||
    everydayData === null ||
    data === null ||
    !isEmergencyFundsComplete(everydayData, data, age)
  ) {
    return (
      <FinanceJourneyShell activeSlug="emergency-funds" header={header}>
        <ContentCard>
          <p className="text-sand-700">Loading…</p>
        </ContentCard>
      </FinanceJourneyShell>
    );
  }

  const summary = buildEmergencyFundsSummary(everydayData, data, age);
  if (!summary) {
    return (
      <FinanceJourneyShell activeSlug="emergency-funds" header={header}>
        <ContentCard>
          <p className="text-sand-700">Loading…</p>
        </ContentCard>
      </FinanceJourneyShell>
    );
  }

  const { targetAmount, currentSavings, hasMetTarget } = summary;
  const progressPercent =
    targetAmount > 0
      ? Math.min(100, Math.round((currentSavings / targetAmount) * 100))
      : 100;

  return (
    <FinanceJourneyShell activeSlug="emergency-funds" header={header}>
      <ContentCard className="space-y-6">
        <JourneyProgressCup currentStep={2} showYouAreHere className="mb-2" />

        <div className="overflow-hidden rounded-xl border border-sand-700/10">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-sand-700/5">
                <td className="px-4 py-3 text-sand-800">
                  Emergency fund target
                  <span className="mt-0.5 block text-xs text-sand-600">
                    One month&apos;s income
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-sand-900">
                  {formatPounds(targetAmount)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sand-800">Currently saved</td>
                <td className="px-4 py-3 text-right text-sand-900">
                  {formatPounds(currentSavings)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <SavingsProgressBar
          currentSavings={currentSavings}
          targetAmount={targetAmount}
          progressPercent={progressPercent}
          hasMetTarget={hasMetTarget}
        />

        <div
          className={`rounded-xl border p-4 ${
            hasMetTarget
              ? "border-emerald-200 bg-emerald-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <div className="flex items-start gap-3">
            {hasMetTarget ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
            ) : (
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
            )}
            <div>
              <p
                className={`text-lg font-semibold ${
                  hasMetTarget ? "text-emerald-900" : "text-amber-900"
                }`}
              >
                {formatPounds(currentSavings)} of {formatPounds(targetAmount)}
              </p>
              <p
                className={`mt-2 text-sm ${
                  hasMetTarget ? "text-emerald-800" : "text-amber-800"
                }`}
              >
                {hasMetTarget
                  ? "You've saved at least one month's income for emergencies. You're in a good place to move on."
                  : "You haven't got one month's income saved yet. This should probably be your goal right now."}
              </p>
            </div>
          </div>
        </div>

        <ReviewActions
          continueHref={getSectionPath("debt")}
          continueLabel="Continue to Debt"
          editHref={getSectionQuestionsPath("emergency-funds")}
        />
      </ContentCard>
    </FinanceJourneyShell>
  );
}

interface SavingsProgressBarProps {
  currentSavings: number;
  targetAmount: number;
  progressPercent: number;
  hasMetTarget: boolean;
}

function SavingsProgressBar({
  currentSavings,
  targetAmount,
  progressPercent,
  hasMetTarget,
}: SavingsProgressBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-sand-700">
        <span>Savings progress</span>
        <span className="font-medium text-sand-900">{progressPercent}%</span>
      </div>
      <div
        className="h-3 overflow-hidden rounded-full bg-sand-200"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${formatPounds(currentSavings)} saved of ${formatPounds(targetAmount)} target`}
      >
        <div
          className={`h-full rounded-full transition-all ${
            hasMetTarget ? "bg-emerald-500" : "bg-amber-500"
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}

interface ReviewActionsProps {
  continueHref: string;
  continueLabel: string;
  editHref: string;
}

function ReviewActions({
  continueHref,
  continueLabel,
  editHref,
}: ReviewActionsProps) {
  return (
    <div className="space-y-4 pt-2">
      <Link
        href={continueHref}
        className="inline-flex h-12 items-center justify-center rounded-lg bg-sand-800 px-8 text-base font-medium text-white transition-colors hover:bg-sand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand-800 focus-visible:ring-offset-2"
      >
        {continueLabel}
      </Link>
      <div className="flex justify-end">
        <Link
          href={editHref}
          className="inline-block text-sm text-sand-700 underline decoration-sand-700/30 underline-offset-4 hover:decoration-sand-800"
        >
          Edit your answers
        </Link>
      </div>
    </div>
  );
}
