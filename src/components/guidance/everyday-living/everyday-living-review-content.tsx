"use client";

import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { JourneyProgressCup } from "@/components/guidance/journey-progress-cup";
import {
  ContentCard,
  PageShell,
} from "@/components/layout/page-shell";
import { RestartButton } from "@/components/layout/restart-button";
import { Select } from "@/components/ui/select";
import { useFinanceJourneyGuard } from "@/hooks/use-finance-journey-guard";
import {
  BUDGET_DEMO_OPTIONS,
  formatPounds,
  getEffectiveMonthlyIncome,
  getMonthlyBalance,
  getMonthlyExpenditure,
} from "@/lib/everyday-living-calculations";
import {
  type EverydayLivingData,
  getEverydayLivingData,
  isEverydayLivingComplete,
} from "@/lib/everyday-living-storage";
import { setJourneyProgress } from "@/lib/journey-progress";
import { getSectionPath } from "@/lib/journey-sections";
import { getUserAge } from "@/lib/session-storage";

export function EverydayLivingReviewContent() {
  const router = useRouter();
  const isReady = useFinanceJourneyGuard();
  const [data, setData] = useState<EverydayLivingData | null>(null);
  const [age, setAge] = useState<number | null>(null);

  useEffect(() => {
    setData(getEverydayLivingData());
    setAge(getUserAge());
  }, []);

  useEffect(() => {
    if (!isReady || data === null) return;
    setJourneyProgress(1);

    if (!isEverydayLivingComplete(data)) {
      router.replace("/guidance/finances/everyday-living/");
    }
  }, [isReady, data, router]);

  if (!isReady || data === null || !isEverydayLivingComplete(data)) {
    return (
      <PageShell showRestart restartSlot={<RestartButton />}>
        <ContentCard>
          <p className="text-sand-700">Loading…</p>
        </ContentCard>
      </PageShell>
    );
  }

  const monthlyIncome = getEffectiveMonthlyIncome(data, age);
  const monthlyExpenditure = getMonthlyExpenditure(data);
  const balance = getMonthlyBalance(data, age);
  const isPositive = balance >= 0;

  return (
    <PageShell showRestart restartSlot={<RestartButton />}>
      <div className="flex flex-1 flex-col gap-8">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wide text-sand-700">
            Everyday living review
          </p>
          <h1 className="text-3xl font-semibold text-sand-900 sm:text-4xl">
            Income vs expenditure
          </h1>
          <p className="text-sand-700">
            All figures below are shown on a monthly basis.
          </p>
        </div>

        <ContentCard className="space-y-6">
          <JourneyProgressCup currentStep={1} showYouAreHere className="mb-2" />

          <div className="grid gap-4 sm:grid-cols-2">
            <SummaryCard label="Monthly income" value={formatPounds(monthlyIncome)} />
            <SummaryCard
              label="Monthly expenditure"
              value={formatPounds(monthlyExpenditure)}
            />
          </div>

          <div
            className={`rounded-xl border p-4 ${
              isPositive
                ? "border-emerald-200 bg-emerald-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <div className="flex items-start gap-3">
              {isPositive ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
              ) : (
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-700" />
              )}
              <div>
                <p
                  className={`text-lg font-semibold ${
                    isPositive ? "text-emerald-900" : "text-red-900"
                  }`}
                >
                  {isPositive ? "Positive balance" : "Negative balance"}:{" "}
                  {formatPounds(Math.abs(balance))}
                  {isPositive ? " remaining" : " shortfall"} per month
                </p>
                <p
                  className={`mt-2 text-sm ${
                    isPositive ? "text-emerald-800" : "text-red-800"
                  }`}
                >
                  {isPositive
                    ? "Your everyday living costs are covered by your income. You're ready to move on to the next section."
                    : "Your expenditure is higher than your income. Let's look at ways to help balance your budget."}
                </p>
              </div>
            </div>
          </div>

          {isPositive ? (
            <Link
              href={getSectionPath("emergency-funds")}
              className="inline-flex h-12 items-center justify-center rounded-lg bg-sand-800 px-8 text-base font-medium text-white transition-colors hover:bg-sand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand-800 focus-visible:ring-offset-2"
            >
              Continue to Emergency Funds
            </Link>
          ) : (
            <BudgetHelpSection />
          )}

          <Link
            href="/guidance/finances/everyday-living/"
            className="inline-block text-sm text-sand-700 underline decoration-sand-700/30 underline-offset-4 hover:decoration-sand-800"
          >
            Edit your answers
          </Link>
        </ContentCard>
      </div>
    </PageShell>
  );
}

interface SummaryCardProps {
  label: string;
  value: string;
}

function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-sand-700/10 bg-cream-50 p-4">
      <p className="text-sm text-sand-700">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-sand-900">{value}</p>
    </div>
  );
}

function BudgetHelpSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-sand-900">
        Help balancing your budget
      </h2>
      {BUDGET_DEMO_OPTIONS.map((option) => (
        <Select key={option.id} label={option.label} defaultValue="">
          <option value="" disabled>
            Select an option
          </option>
          <option value={option.id}>{option.text}</option>
        </Select>
      ))}
    </div>
  );
}
