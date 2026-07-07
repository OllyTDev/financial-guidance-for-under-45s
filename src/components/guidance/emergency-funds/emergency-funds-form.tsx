"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { IncomeSection } from "@/components/guidance/everyday-living/income-section";
import {
  CurrencyInput,
  parseCurrencyValue,
} from "@/components/ui/currency-input";
import { ExternalLink } from "@/components/ui/external-link";
import { RadioGroup } from "@/components/ui/radio-group";
import { formatPounds } from "@/lib/everyday-living-calculations";
import {
  EMPTY_EVERYDAY_LIVING,
  getEverydayLivingData,
  type EverydayLivingData,
} from "@/lib/everyday-living-storage";
import {
  getMonthlyIncomeForEmergencyFunds,
  hasUsableIncomeFromEverydayLiving,
} from "@/lib/emergency-funds-calculations";
import {
  EMERGENCY_FUNDS_REVIEW_PATH,
  EMPTY_EMERGENCY_FUNDS,
  type EmergencyFundsData,
  getEmergencyFundsData,
  isSavingsSectionComplete,
  saveEmergencyFundsData,
  toIncomeCaptureData,
} from "@/lib/emergency-funds-storage";
import { MSE_SAVINGS_ACCOUNTS_URL } from "@/lib/security/allowed-external-urls";
import { getUserAge } from "@/lib/session-storage";

function toInputValue(value: number | null): string {
  if (value === null) return "";
  return String(value);
}

function boolToRadio(value: boolean | null): string | null {
  if (value === null) return null;
  return value ? "yes" : "no";
}

function radioToBool(value: string): boolean {
  return value === "yes";
}

export function EmergencyFundsForm() {
  const [everydayData, setEverydayData] = useState<EverydayLivingData>(
    EMPTY_EVERYDAY_LIVING,
  );
  const [data, setData] = useState<EmergencyFundsData>(EMPTY_EMERGENCY_FUNDS);
  const [age, setAge] = useState<number | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setEverydayData(getEverydayLivingData());
    setData(getEmergencyFundsData());
    setAge(getUserAge());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    saveEmergencyFundsData(data);
  }, [data, isHydrated]);

  function updateData(patch: Partial<EmergencyFundsData>) {
    setData((current) => ({ ...current, ...patch }));
  }

  const hasEverydayIncome = hasUsableIncomeFromEverydayLiving(everydayData);
  const monthlyIncome = getMonthlyIncomeForEmergencyFunds(
    everydayData,
    data,
    age,
  );
  const showIncomeFallback = !hasEverydayIncome;
  const showTargetInfo = monthlyIncome !== null;
  const showSavingsSection = monthlyIncome !== null;

  const incomeCaptureData: EverydayLivingData = {
    ...EMPTY_EVERYDAY_LIVING,
    ...toIncomeCaptureData(data),
  };

  function handleFallbackIncomeUpdate(patch: Partial<EverydayLivingData>) {
    updateData({
      fallbackIncomes: patch.incomes ?? data.fallbackIncomes,
      receivingBenefits:
        patch.receivingBenefits !== undefined
          ? patch.receivingBenefits
          : data.receivingBenefits,
      usingJsaAsIncome:
        patch.usingJsaAsIncome !== undefined
          ? patch.usingJsaAsIncome
          : data.usingJsaAsIncome,
    });
  }

  return (
    <form className="space-y-8" onSubmit={(event) => event.preventDefault()}>
      <section className="space-y-3 rounded-xl border border-sand-700/10 bg-cream-50 p-4">
        <h2 className="text-sm font-medium text-sand-800">Your emergency fund target</h2>
        <p className="text-sm text-sand-700">
          We recommend saving roughly <strong>one month&apos;s income</strong> for
          emergencies — enough to cover a sudden bill or short gap without
          turning to debt.
        </p>
        {showTargetInfo ? (
          <p className="text-sm text-sand-900">
            Based on your income, that&apos;s about{" "}
            <span className="font-semibold">{formatPounds(monthlyIncome)}</span>
            .
          </p>
        ) : (
          <p className="text-sm text-sand-700">
            Tell us your income below so we can work out your target.
          </p>
        )}
      </section>

      {showIncomeFallback ? (
        <IncomeSection
          data={incomeCaptureData}
          onUpdate={handleFallbackIncomeUpdate}
          incomeOnly
        />
      ) : null}

      {showSavingsSection ? (
        <fieldset className="space-y-6">
          <legend className="text-sm font-medium text-sand-800">
            Your savings
          </legend>

          <RadioGroup
            name="has-savings-account"
            legend="Do you have a savings account already?"
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
            value={boolToRadio(data.hasSavingsAccount)}
            onChange={(value) =>
              updateData({
                hasSavingsAccount: radioToBool(value),
                amountSaved: null,
              })
            }
          />

          {data.hasSavingsAccount ? (
            <CurrencyInput
              id="amount-saved"
              label="How much do you have saved?"
              value={toInputValue(data.amountSaved)}
              onChange={(value) =>
                updateData({ amountSaved: parseCurrencyValue(value) })
              }
            />
          ) : null}

          {data.hasSavingsAccount === false ? (
            <SavingsAccountInfoPanel />
          ) : null}
        </fieldset>
      ) : null}

      {isSavingsSectionComplete(data) && showTargetInfo ? (
        <Link
          href={EMERGENCY_FUNDS_REVIEW_PATH}
          className="inline-flex h-12 items-center justify-center rounded-lg bg-sand-800 px-8 text-base font-medium text-white transition-colors hover:bg-sand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand-800 focus-visible:ring-offset-2"
        >
          Review your emergency fund
        </Link>
      ) : null}
    </form>
  );
}

function SavingsAccountInfoPanel() {
  return (
    <div className="space-y-4 rounded-xl border border-sand-700/10 bg-cream-50 p-4 text-sm text-sand-700">
      <p>
        If you don&apos;t have a savings account yet, two common options are an{" "}
        <strong>easy access savings account</strong> and a{" "}
        <strong>regular saver account</strong>.
      </p>
      <p>
        <strong>Easy access</strong> accounts let you withdraw money whenever
        you need it — useful for an emergency fund you might tap at short notice.
      </p>
      <p>
        <strong>Regular savers</strong> often pay higher interest, but you
        usually commit to paying in a set amount each month and may face
        restrictions on withdrawals.
      </p>
      <p>
        <ExternalLink href={MSE_SAVINGS_ACCOUNTS_URL}>
          Compare easy access savings accounts on MoneySavingExpert
        </ExternalLink>
      </p>
      <p className="text-xs text-sand-600">
        We have no association with MoneySavingExpert. We link to them because
        we think they generally do good work, and that page is regularly
        updated.
      </p>
    </div>
  );
}
