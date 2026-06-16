/**
 * UK income tax (England, Wales & Northern Ireland) — 2025/26 tax year.
 * Scotland uses different bands; not modelled here.
 * Simplified: full personal allowance, no taper above £100k.
 */

export interface TaxBandBreakdown {
  label: string;
  taxableInBand: number;
  rate: number;
  tax: number;
}

export interface AnnualTaxResult {
  grossAnnual: number;
  personalAllowance: number;
  totalTax: number;
  netAnnual: number;
  bands: TaxBandBreakdown[];
}

const PERSONAL_ALLOWANCE = 12_570;
const BASIC_RATE_UPPER = 50_270;
const HIGHER_RATE_UPPER = 125_140;

const BASIC_RATE = 0.2;
const HIGHER_RATE = 0.4;
const ADDITIONAL_RATE = 0.45;

export function calculateAnnualUkIncomeTax(
  grossAnnual: number,
): AnnualTaxResult {
  if (grossAnnual <= 0) {
    return {
      grossAnnual,
      personalAllowance: PERSONAL_ALLOWANCE,
      totalTax: 0,
      netAnnual: 0,
      bands: [],
    };
  }

  const bands: TaxBandBreakdown[] = [];
  let totalTax = 0;

  const basicTaxable = Math.max(
    0,
    Math.min(grossAnnual, BASIC_RATE_UPPER) - PERSONAL_ALLOWANCE,
  );
  if (basicTaxable > 0) {
    const tax = basicTaxable * BASIC_RATE;
    bands.push({
      label: "Basic rate (20%)",
      taxableInBand: basicTaxable,
      rate: BASIC_RATE,
      tax,
    });
    totalTax += tax;
  }

  if (grossAnnual > BASIC_RATE_UPPER) {
    const higherTaxable = Math.min(
      grossAnnual - BASIC_RATE_UPPER,
      HIGHER_RATE_UPPER - BASIC_RATE_UPPER,
    );
    const tax = higherTaxable * HIGHER_RATE;
    bands.push({
      label: "Higher rate (40%)",
      taxableInBand: higherTaxable,
      rate: HIGHER_RATE,
      tax,
    });
    totalTax += tax;
  }

  if (grossAnnual > HIGHER_RATE_UPPER) {
    const additionalTaxable = grossAnnual - HIGHER_RATE_UPPER;
    const tax = additionalTaxable * ADDITIONAL_RATE;
    bands.push({
      label: "Additional rate (45%)",
      taxableInBand: additionalTaxable,
      rate: ADDITIONAL_RATE,
      tax,
    });
    totalTax += tax;
  }

  return {
    grossAnnual,
    personalAllowance: PERSONAL_ALLOWANCE,
    totalTax,
    netAnnual: grossAnnual - totalTax,
    bands,
  };
}

export function grossAnnualToNetMonthly(grossAnnual: number): number {
  return calculateAnnualUkIncomeTax(grossAnnual).netAnnual / 12;
}
