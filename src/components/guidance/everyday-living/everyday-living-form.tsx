"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { IncomeSection } from "@/components/guidance/everyday-living/income-section";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CurrencyInput,
  parseCurrencyValue,
} from "@/components/ui/currency-input";
import { CurrencyInputWithPeriod } from "@/components/ui/currency-input-with-period";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { RadioGroup } from "@/components/ui/radio-group";
import {
  EVERYDAY_LIVING_REVIEW_PATH,
  type EverydayLivingData,
  type HousingType,
  getEverydayLivingData,
  isCouncilTaxEntered,
  isEverydayLivingComplete,
  isHousingAmountValid,
  isIncomeSectionComplete,
  isMortgageZero,
  saveEverydayLivingData,
} from "@/lib/everyday-living-storage";

const COUNCIL_TAX_DISCOUNT_URL =
  "https://www.gov.uk/apply-for-council-tax-discount";

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

export function EverydayLivingForm() {
  const [data, setData] = useState<EverydayLivingData>(() =>
    getEverydayLivingData(),
  );

  useEffect(() => {
    saveEverydayLivingData(data);
  }, [data]);

  function updateData(patch: Partial<EverydayLivingData>) {
    setData((current) => ({ ...current, ...patch }));
  }

  function handleHousingTypeChange(value: string) {
    updateData({
      housingType: value as HousingType,
      housingAmount: null,
      mortgagePaidOffConfirmed: false,
      utilitiesIncluded: false,
      water: null,
      gasElectric: null,
      councilTax: null,
      livesAlone: null,
      appliedCouncilTaxReduction: null,
    });
  }

  function handleUtilitiesIncluded(checked: boolean) {
    updateData({
      utilitiesIncluded: checked,
      water: checked ? 0 : null,
      gasElectric: checked ? 0 : null,
    });
  }

  const showHousing = isIncomeSectionComplete(data);
  const housingAmountLabel =
    data.housingType === "rent"
      ? "How much is your rent?"
      : data.housingType === "mortgage"
        ? "How much is your mortgage?"
        : "How much is your rent/mortgage?";

  const showMortgageConfirm = isMortgageZero(data);
  const showUtilities = showHousing && isHousingAmountValid(data);
  const showCouncilTaxFollowUp = isCouncilTaxEntered(data);
  const showReductionQuestion = data.livesAlone === true;
  const showCouncilTaxLink =
    data.livesAlone === true && data.appliedCouncilTaxReduction === false;

  return (
    <form className="space-y-8" onSubmit={(event) => event.preventDefault()}>
      <IncomeSection data={data} onUpdate={updateData} />

      {showHousing ? (
        <>
          <RadioGroup
            name="housing-type"
            legend="Are you renting or do you have a mortgage?"
            options={[
              { value: "rent", label: "Renting" },
              { value: "mortgage", label: "Mortgage" },
            ]}
            value={data.housingType}
            onChange={handleHousingTypeChange}
          />

          {data.housingType ? (
            <CurrencyInput
              id="housing-amount"
              label={housingAmountLabel}
              value={toInputValue(data.housingAmount)}
              onChange={(value) =>
                updateData({
                  housingAmount: parseCurrencyValue(value),
                  mortgagePaidOffConfirmed: false,
                })
              }
            />
          ) : null}

          {showMortgageConfirm ? (
            <Checkbox
              label="I confirm I've paid off my mortgage"
              checked={data.mortgagePaidOffConfirmed}
              onChange={(event) =>
                updateData({ mortgagePaidOffConfirmed: event.target.checked })
              }
            />
          ) : null}

          {showUtilities ? (
            <UtilitiesSection
              data={data}
              onUtilitiesIncluded={handleUtilitiesIncluded}
              onUpdate={updateData}
            />
          ) : null}

          {showCouncilTaxFollowUp ? (
            <CouncilTaxSection
              data={data}
              showReductionQuestion={showReductionQuestion}
              showCouncilTaxLink={showCouncilTaxLink}
              onUpdate={updateData}
            />
          ) : null}
        </>
      ) : null}

      {isEverydayLivingComplete(data) ? (
        <Link
          href={EVERYDAY_LIVING_REVIEW_PATH}
          className="inline-flex h-12 items-center justify-center rounded-lg bg-sand-800 px-8 text-base font-medium text-white transition-colors hover:bg-sand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand-800 focus-visible:ring-offset-2"
        >
          Review your everyday living
        </Link>
      ) : null}
    </form>
  );
}

interface UtilitiesSectionProps {
  data: EverydayLivingData;
  onUtilitiesIncluded: (checked: boolean) => void;
  onUpdate: (patch: Partial<EverydayLivingData>) => void;
}

function UtilitiesSection({
  data,
  onUtilitiesIncluded,
  onUpdate,
}: UtilitiesSectionProps) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-medium text-sand-800">Utilities</legend>

      {data.housingType === "rent" ? (
        <Checkbox
          label="Utilities are included in my bills"
          checked={data.utilitiesIncluded}
          onChange={(event) => onUtilitiesIncluded(event.target.checked)}
        />
      ) : null}

      <CurrencyInputWithPeriod
        id="water"
        label="Water"
        value={toInputValue(data.water)}
        period={data.waterPeriod}
        disabled={data.utilitiesIncluded}
        onValueChange={(value) =>
          onUpdate({ water: parseCurrencyValue(value) })
        }
        onPeriodChange={(period) => onUpdate({ waterPeriod: period })}
      />

      <CurrencyInputWithPeriod
        id="gas-electric"
        label="Gas/electric"
        value={toInputValue(data.gasElectric)}
        period={data.gasElectricPeriod}
        disabled={data.utilitiesIncluded}
        onValueChange={(value) =>
          onUpdate({ gasElectric: parseCurrencyValue(value) })
        }
        onPeriodChange={(period) => onUpdate({ gasElectricPeriod: period })}
      />

      <CurrencyInputWithPeriod
        id="council-tax"
        label="Council Tax"
        value={toInputValue(data.councilTax)}
        period={data.councilTaxPeriod}
        onValueChange={(value) =>
          onUpdate({
            councilTax: parseCurrencyValue(value),
            livesAlone: null,
            appliedCouncilTaxReduction: null,
          })
        }
        onPeriodChange={(period) => onUpdate({ councilTaxPeriod: period })}
      />
    </fieldset>
  );
}

interface CouncilTaxSectionProps {
  data: EverydayLivingData;
  showReductionQuestion: boolean;
  showCouncilTaxLink: boolean;
  onUpdate: (patch: Partial<EverydayLivingData>) => void;
}

function CouncilTaxSection({
  data,
  showReductionQuestion,
  showCouncilTaxLink,
  onUpdate,
}: CouncilTaxSectionProps) {
  return (
    <div className="space-y-4 rounded-xl border border-sand-700/10 bg-cream-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-sand-800">Do you live alone?</p>
        <InfoTooltip message="We're checking to see if you can get a discount on council tax" />
      </div>

      <RadioGroup
        name="lives-alone"
        ariaLabel="Do you live alone?"
        options={[
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ]}
        value={boolToRadio(data.livesAlone)}
        onChange={(value) =>
          onUpdate({
            livesAlone: radioToBool(value),
            appliedCouncilTaxReduction: null,
          })
        }
      />

      {showReductionQuestion ? (
        <RadioGroup
          name="council-tax-reduction"
          legend="Have you applied for the single person council tax reduction?"
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
          value={boolToRadio(data.appliedCouncilTaxReduction)}
          onChange={(value) =>
            onUpdate({ appliedCouncilTaxReduction: radioToBool(value) })
          }
        />
      ) : null}

      {showCouncilTaxLink ? (
        <p className="text-sm text-sand-700">
          You may be eligible for a discount.{" "}
          <a
            href={COUNCIL_TAX_DISCOUNT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-sand-800 underline decoration-sand-700/30 underline-offset-4 hover:decoration-sand-800"
          >
            Apply for a Council Tax discount on GOV.UK
          </a>
        </p>
      ) : null}
    </div>
  );
}
