"use client";

import { useState } from "react";

import { Dialog } from "@/components/ui/dialog";
import { CurrencyInputWithPeriod } from "@/components/ui/currency-input-with-period";
import { parseCurrencyValue } from "@/components/ui/currency-input";
import { RadioGroup } from "@/components/ui/radio-group";
import {
  formatPounds,
  getJsaMonthlyAmount,
  getJsaWeeklyAmount,
} from "@/lib/everyday-living-calculations";
import {
  type EverydayLivingData,
  type PaymentPeriod,
  isZeroIncome,
} from "@/lib/everyday-living-storage";
import { getUserAge } from "@/lib/session-storage";

const JSA_URL = "https://www.gov.uk/jobseekers-allowance";

interface IncomeSectionProps {
  data: EverydayLivingData;
  onUpdate: (patch: Partial<EverydayLivingData>) => void;
}

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

export function IncomeSection({ data, onUpdate }: IncomeSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const age = getUserAge();
  const showBenefitsQuestion = data.income !== null && isZeroIncome(data);
  const showJsaInfo =
    showBenefitsQuestion && data.receivingBenefits === false;
  const jsaWeekly = getJsaWeeklyAmount(age);
  const jsaMonthly = getJsaMonthlyAmount(age);

  function handleBenefitsChange(value: string) {
    const receivingBenefits = radioToBool(value);
    onUpdate({
      receivingBenefits,
      usingJsaAsIncome: false,
    });

    if (!receivingBenefits) setDialogOpen(true);
  }

  function confirmJsaIncome() {
    onUpdate({ usingJsaAsIncome: true });
    setDialogOpen(false);
  }

  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-medium text-sand-800">
        What is your income?
      </legend>

      <CurrencyInputWithPeriod
        id="income"
        label="Income amount"
        value={toInputValue(data.income)}
        period={data.incomePeriod}
        onValueChange={(value) =>
          onUpdate({
            income: parseCurrencyValue(value),
            receivingBenefits: null,
            usingJsaAsIncome: false,
          })
        }
        onPeriodChange={(period: PaymentPeriod) =>
          onUpdate({ incomePeriod: period })
        }
      />

      {data.income !== null ? (
        <RadioGroup
          name="income-tax"
          legend="Is this pre-tax?"
          options={[
            { value: "yes", label: "Yes (pre-tax)" },
            { value: "no", label: "No (post-tax)" },
          ]}
          value={boolToRadio(data.isPreTax)}
          onChange={(value) => onUpdate({ isPreTax: radioToBool(value) })}
        />
      ) : null}

      {showBenefitsQuestion && data.isPreTax !== null ? (
        <RadioGroup
          name="receiving-benefits"
          legend="Are you currently receiving any benefits?"
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
          value={boolToRadio(data.receivingBenefits)}
          onChange={handleBenefitsChange}
        />
      ) : null}

      {showJsaInfo ? (
        <div className="space-y-3 rounded-xl border border-sand-700/10 bg-cream-50 p-4 text-sm text-sand-700">
          <p>
            You may be eligible for New Style Jobseeker&apos;s Allowance (JSA).
            Based on your age, the weekly amount is up to{" "}
            <span className="font-medium text-sand-900">
              {formatPounds(jsaWeekly)}
            </span>
            , which is about{" "}
            <span className="font-medium text-sand-900">
              {formatPounds(jsaMonthly)} per month
            </span>
            .
          </p>
          <p>
            <a
              href={JSA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-sand-800 underline decoration-sand-700/30 underline-offset-4 hover:decoration-sand-800"
            >
              Find out about Jobseeker&apos;s Allowance on GOV.UK
            </a>
          </p>
          {!data.usingJsaAsIncome ? (
            <button
              type="button"
              className="text-sm font-medium text-sand-800 underline decoration-sand-700/30 underline-offset-4 hover:decoration-sand-800"
              onClick={() => setDialogOpen(true)}
            >
              Use JSA as my income
            </button>
          ) : (
            <p className="font-medium text-sand-800">
              Using {formatPounds(jsaMonthly)} per month as your income.
            </p>
          )}
        </div>
      ) : null}

      <Dialog
        open={dialogOpen && !data.usingJsaAsIncome}
        title="Use JSA as your income"
        confirmLabel="Continue with JSA as my income"
        onConfirm={confirmJsaIncome}
        onClose={() => setDialogOpen(false)}
      >
        You can continue to use this service and we&apos;ll use the JSA amount
        of {formatPounds(jsaMonthly)} per month as your income.
      </Dialog>
    </fieldset>
  );
}
