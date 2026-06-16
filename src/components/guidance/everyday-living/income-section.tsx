"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { Dialog } from "@/components/ui/dialog";
import { ExternalLink } from "@/components/ui/external-link";
import {
  CurrencyInput,
  parseCurrencyValue,
} from "@/components/ui/currency-input";
import { CurrencyInputWithPeriod } from "@/components/ui/currency-input-with-period";
import { RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  formatPounds,
  getJsaMonthlyAmount,
  getJsaWeeklyAmount,
} from "@/lib/everyday-living-calculations";
import {
  type EverydayLivingData,
  type IncomeEntry,
  type PaymentPeriod,
  type PensionContributionType,
  createIncomeEntry,
  getPensionValidationError,
  getTotalGrossAnnual,
  isIncomeEntriesComplete,
  isZeroIncome,
  MAX_PENSION_PERCENT,
  MIN_PENSION_PERCENT,
} from "@/lib/everyday-living-storage";
import { GOVUK_JSA_URL } from "@/lib/security/allowed-external-urls";
import { getUserAge } from "@/lib/session-storage";
import { cn } from "@/lib/utils";

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

function sanitizePercentInput(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length <= 1) return cleaned;
  return `${parts[0]}.${parts.slice(1).join("")}`;
}

export function IncomeSection({ data, onUpdate }: IncomeSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const age = getUserAge();
  const monthlyGross = getTotalGrossAnnual(data) / 12;
  const pensionError = getPensionValidationError(data, monthlyGross);

  const showBenefitsQuestion = isZeroIncome(data);
  const showJsaInfo =
    showBenefitsQuestion && data.receivingBenefits === false;
  const showPensionSection = isIncomeEntriesComplete(data);
  const showGroceriesSection =
    showPensionSection &&
    data.hasWorkplacePension !== null &&
    (data.hasWorkplacePension === false || pensionError === null);

  const jsaWeekly = getJsaWeeklyAmount(age);
  const jsaMonthly = getJsaMonthlyAmount(age);

  function updateIncomeEntry(id: string, patch: Partial<IncomeEntry>) {
    onUpdate({
      incomes: data.incomes.map((entry) =>
        entry.id === id ? { ...entry, ...patch } : entry,
      ),
      receivingBenefits: null,
      usingJsaAsIncome: false,
    });
  }

  function addIncomeEntry() {
    onUpdate({ incomes: [...data.incomes, createIncomeEntry()] });
  }

  function removeIncomeEntry(id: string) {
    if (data.incomes.length <= 1) return;
    onUpdate({ incomes: data.incomes.filter((entry) => entry.id !== id) });
  }

  function handleBenefitsChange(value: string) {
    const receivingBenefits = radioToBool(value);
    onUpdate({ receivingBenefits, usingJsaAsIncome: false });
    if (!receivingBenefits) setDialogOpen(true);
  }

  function confirmJsaIncome() {
    onUpdate({ usingJsaAsIncome: true });
    setDialogOpen(false);
  }

  return (
    <fieldset className="space-y-6">
      <legend className="text-sm font-medium text-sand-800">
        What is your income?
      </legend>

      <div className="space-y-6">
        {data.incomes.map((entry, index) => (
          <IncomeEntryFields
            key={entry.id}
            entry={entry}
            index={index}
            canRemove={data.incomes.length > 1}
            onUpdate={(patch) => updateIncomeEntry(entry.id, patch)}
            onRemove={() => removeIncomeEntry(entry.id)}
          />
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addIncomeEntry}
        className="gap-2"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add another income
      </Button>

      {showBenefitsQuestion ? (
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
        <JsaInfoPanel
          jsaWeekly={jsaWeekly}
          jsaMonthly={jsaMonthly}
          usingJsa={data.usingJsaAsIncome}
          onUseJsa={() => setDialogOpen(true)}
        />
      ) : null}

      {showPensionSection ? (
        <PensionSection
          data={data}
          monthlyGross={monthlyGross}
          pensionError={pensionError}
          onUpdate={onUpdate}
        />
      ) : null}

      {showGroceriesSection ? (
        <CurrencyInput
          id="groceries"
          label="Roughly how much a month do you spend on groceries?"
          value={toInputValue(data.groceriesMonthly)}
          onChange={(value) =>
            onUpdate({ groceriesMonthly: parseCurrencyValue(value) })
          }
        />
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

interface IncomeEntryFieldsProps {
  entry: IncomeEntry;
  index: number;
  canRemove: boolean;
  onUpdate: (patch: Partial<IncomeEntry>) => void;
  onRemove: () => void;
}

function IncomeEntryFields({
  entry,
  index,
  canRemove,
  onUpdate,
  onRemove,
}: IncomeEntryFieldsProps) {
  const showPreTax = entry.amount !== null && entry.amount > 0;

  return (
    <div className="space-y-4 rounded-xl border border-sand-700/10 bg-cream-50 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-sand-800">
          Income {index + 1}
        </p>
        {canRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1 text-sm text-sand-700 hover:text-sand-900"
            aria-label={`Remove income ${index + 1}`}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Remove
          </button>
        ) : null}
      </div>

      <CurrencyInputWithPeriod
        id={`income-${entry.id}`}
        label="Amount"
        value={toInputValue(entry.amount)}
        period={entry.period}
        onValueChange={(value) =>
          onUpdate({
            amount: parseCurrencyValue(value),
            isPreTax: parseCurrencyValue(value) === 0 ? null : entry.isPreTax,
          })
        }
        onPeriodChange={(period: PaymentPeriod) => onUpdate({ period })}
      />

      {showPreTax ? (
        <RadioGroup
          name={`income-tax-${entry.id}`}
          legend="Is this pre-tax?"
          options={[
            { value: "yes", label: "Yes (pre-tax)" },
            { value: "no", label: "No (post-tax)" },
          ]}
          value={boolToRadio(entry.isPreTax)}
          onChange={(value) => onUpdate({ isPreTax: radioToBool(value) })}
        />
      ) : null}
    </div>
  );
}

interface PensionSectionProps {
  data: EverydayLivingData;
  monthlyGross: number;
  pensionError: string | null;
  onUpdate: (patch: Partial<EverydayLivingData>) => void;
}

function PensionSection({
  data,
  monthlyGross,
  pensionError,
  onUpdate,
}: PensionSectionProps) {
  return (
    <div className="space-y-4 rounded-xl border border-sand-700/10 p-4">
      <RadioGroup
        name="workplace-pension"
        legend="Do you have a private pension with your workplace?"
        options={[
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ]}
        value={boolToRadio(data.hasWorkplacePension)}
        onChange={(value) =>
          onUpdate({
            hasWorkplacePension: radioToBool(value),
            pensionContributionType: null,
            pensionContributionAmount: null,
          })
        }
      />

      {data.hasWorkplacePension ? (
        <>
          <RadioGroup
            name="pension-contribution-type"
            legend="How much do you contribute? (An estimate will do)"
            options={[
              { value: "monthly", label: "Monthly amount (£)" },
              { value: "percent", label: "Percentage of income (%)" },
            ]}
            value={data.pensionContributionType}
            onChange={(value) =>
              onUpdate({
                pensionContributionType: value as PensionContributionType,
                pensionContributionAmount: null,
              })
            }
          />

          {data.pensionContributionType === "monthly" ? (
            <CurrencyInput
              id="pension-monthly"
              label="Monthly contribution"
              value={toInputValue(data.pensionContributionAmount)}
              onChange={(value) =>
                onUpdate({
                  pensionContributionAmount: parseCurrencyValue(value),
                })
              }
            />
          ) : null}

          {data.pensionContributionType === "percent" ? (
            <PercentInput
              id="pension-percent"
              label="Percentage of income"
              value={toInputValue(data.pensionContributionAmount)}
              onChange={(value) =>
                onUpdate({
                  pensionContributionAmount: parseCurrencyValue(value),
                })
              }
            />
          ) : null}

          {pensionError ? (
            <p className="text-sm text-red-700" role="alert">
              {pensionError}
            </p>
          ) : null}

          {data.pensionContributionType === "monthly" &&
          data.pensionContributionAmount !== null ? (
            <p className="text-xs text-sand-700">
              Your total monthly income: {formatPounds(monthlyGross)}
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

interface PercentInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function PercentInput({ id, label, value, onChange }: PercentInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-sand-800">
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) =>
            onChange(sanitizePercentInput(event.target.value))
          }
          className={cn(
            "flex h-11 w-full rounded-lg border border-sand-700/15 bg-white px-4 py-2 pr-8",
            "text-base text-sand-900 shadow-sm focus-visible:outline-none",
            "focus-visible:ring-2 focus-visible:ring-sand-800 focus-visible:ring-offset-2",
          )}
        />
        <span
          className="pointer-events-none absolute right-4 text-sand-700"
          aria-hidden="true"
        >
          %
        </span>
      </div>
      <p className="text-xs text-sand-700">
        Enter a value between {MIN_PENSION_PERCENT}% and {MAX_PENSION_PERCENT}%
      </p>
    </div>
  );
}

interface JsaInfoPanelProps {
  jsaWeekly: number;
  jsaMonthly: number;
  usingJsa: boolean;
  onUseJsa: () => void;
}

function JsaInfoPanel({
  jsaWeekly,
  jsaMonthly,
  usingJsa,
  onUseJsa,
}: JsaInfoPanelProps) {
  return (
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
        <ExternalLink href={GOVUK_JSA_URL}>
          Find out about Jobseeker&apos;s Allowance on GOV.UK
        </ExternalLink>
      </p>
      {!usingJsa ? (
        <button
          type="button"
          className="text-sm font-medium text-sand-800 underline decoration-sand-700/30 underline-offset-4 hover:decoration-sand-800"
          onClick={onUseJsa}
        >
          Use JSA as my income
        </button>
      ) : (
        <p className="font-medium text-sand-800">
          Using {formatPounds(jsaMonthly)} per month as your income.
        </p>
      )}
    </div>
  );
}
