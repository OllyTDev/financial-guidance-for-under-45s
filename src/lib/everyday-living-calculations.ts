import type { EverydayLivingData, PaymentPeriod } from "@/lib/everyday-living-storage";
import {
  getTotalGrossAnnual,
  toAnnualAmount,
} from "@/lib/everyday-living-storage";
import {
  calculateAnnualUkIncomeTax,
  type AnnualTaxResult,
} from "@/lib/uk-income-tax";

const JSA_WEEKLY_UNDER_25 = 75.65;
const JSA_WEEKLY_25_AND_OVER = 95.55;
const WEEKS_PER_MONTH = 52 / 12;

export interface BreakdownLine {
  label: string;
  amount: number;
  detail?: string;
}

export interface EverydayLivingBreakdown {
  incomeLines: BreakdownLine[];
  incomeTotal: number;
  expenditureLines: BreakdownLine[];
  expenditureTotal: number;
  balance: number;
  taxLines: BreakdownLine[];
}

export function toMonthlyAmount(
  amount: number,
  period: PaymentPeriod,
): number {
  if (period === "year") return amount / 12;
  return amount;
}

export function getJsaWeeklyAmount(age: number | null): number {
  if (age !== null && age <= 24) return JSA_WEEKLY_UNDER_25;
  return JSA_WEEKLY_25_AND_OVER;
}

export function getJsaMonthlyAmount(age: number | null): number {
  return getJsaWeeklyAmount(age) * WEEKS_PER_MONTH;
}

export function formatPounds(amount: number): string {
  return amount.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getMonthlyGrossFromEntries(data: EverydayLivingData): number {
  return getTotalGrossAnnual(data) / 12;
}

function getMonthlyPensionContribution(
  data: EverydayLivingData,
  monthlyGross: number,
): number {
  if (data.hasWorkplacePension !== true) return 0;
  if (data.pensionContributionAmount === null) return 0;

  if (data.pensionContributionType === "percent") {
    return (monthlyGross * data.pensionContributionAmount) / 100;
  }

  return data.pensionContributionAmount;
}

interface NetIncomeResult {
  netMonthly: number;
  taxResult: AnnualTaxResult | null;
  pensionMonthly: number;
}

function calculateNetIncome(data: EverydayLivingData): NetIncomeResult {
  let preTaxGrossAnnual = 0;
  let postTaxMonthly = 0;

  for (const entry of data.incomes) {
    if (entry.amount === null || entry.amount <= 0) continue;

    if (entry.isPreTax) {
      preTaxGrossAnnual += toAnnualAmount(entry.amount, entry.period);
    } else {
      postTaxMonthly += toMonthlyAmount(entry.amount, entry.period);
    }
  }

  const monthlyGross = getMonthlyGrossFromEntries(data);
  const pensionMonthly = getMonthlyPensionContribution(data, monthlyGross);
  const taxableAnnual = Math.max(0, preTaxGrossAnnual - pensionMonthly * 12);

  const taxResult =
    preTaxGrossAnnual > 0 ? calculateAnnualUkIncomeTax(taxableAnnual) : null;

  const preTaxNetMonthly = taxResult ? taxResult.netAnnual / 12 : 0;

  return {
    netMonthly: preTaxNetMonthly + postTaxMonthly,
    taxResult,
    pensionMonthly,
  };
}

export function getEffectiveMonthlyIncome(
  data: EverydayLivingData,
  age: number | null,
): number {
  if (data.usingJsaAsIncome) return getJsaMonthlyAmount(age);
  return calculateNetIncome(data).netMonthly;
}

export function getMonthlyHousingCost(data: EverydayLivingData): number {
  if (data.housingAmount === null) return 0;
  return data.housingAmount;
}

export function getMonthlyExpenditure(data: EverydayLivingData): number {
  return buildEverydayLivingBreakdown(data, null).expenditureTotal;
}

export function getMonthlyBalance(
  data: EverydayLivingData,
  age: number | null,
): number {
  return getEffectiveMonthlyIncome(data, age) - getMonthlyExpenditure(data);
}

export function buildEverydayLivingBreakdown(
  data: EverydayLivingData,
  age: number | null,
): EverydayLivingBreakdown {
  const incomeLines: BreakdownLine[] = [];
  const taxLines: BreakdownLine[] = [];
  const expenditureLines: BreakdownLine[] = [];

  if (data.usingJsaAsIncome) {
    incomeLines.push({
      label: "Jobseeker's Allowance (estimated)",
      amount: getJsaMonthlyAmount(age),
      detail: "Based on your age",
    });
  } else {
    data.incomes.forEach((entry, index) => {
      if (entry.amount === null || entry.amount <= 0) return;

      incomeLines.push({
        label: `Income ${index + 1}`,
        amount: toMonthlyAmount(entry.amount, entry.period),
        detail: `${formatPounds(entry.amount)} ${entry.period === "year" ? "per year" : "per month"}${
          entry.isPreTax ? ", pre-tax (gross)" : ", post-tax (net)"
        }`,
      });
    });

    const { taxResult, pensionMonthly } = calculateNetIncome(data);

    if (pensionMonthly > 0) {
      taxLines.push({
        label: "Pension (deducted before tax)",
        amount: 0,
        detail: `${formatPounds(pensionMonthly)}/month`,
      });
    }

    if (taxResult && taxResult.totalTax > 0) {
      taxLines.push({
        label: "Income tax (estimated)",
        amount: -(taxResult.totalTax / 12),
        detail: `${formatPounds(taxResult.grossAnnual)}/year taxable, 2025/26 rates`,
      });

      for (const band of taxResult.bands) {
        taxLines.push({
          label: band.label,
          amount: -(band.tax / 12),
          detail: `${formatPounds(band.taxableInBand)} in band`,
        });
      }
    }
  }

  const incomeTotal = getEffectiveMonthlyIncome(data, age);

  if (data.housingAmount !== null) {
    expenditureLines.push({
      label: data.housingType === "rent" ? "Rent" : "Mortgage",
      amount: getMonthlyHousingCost(data),
    });
  }

  if (data.water !== null) {
    expenditureLines.push({
      label: "Water",
      amount: toMonthlyAmount(data.water, data.waterPeriod),
      detail: data.waterPeriod === "year" ? "÷ 12 from yearly" : undefined,
    });
  }

  if (data.gasElectric !== null) {
    expenditureLines.push({
      label: "Gas/electric",
      amount: toMonthlyAmount(data.gasElectric, data.gasElectricPeriod),
      detail:
        data.gasElectricPeriod === "year" ? "÷ 12 from yearly" : undefined,
    });
  }

  if (data.councilTax !== null) {
    expenditureLines.push({
      label: "Council Tax",
      amount: toMonthlyAmount(data.councilTax, data.councilTaxPeriod),
      detail:
        data.councilTaxPeriod === "year" ? "÷ 12 from yearly" : undefined,
    });
  }

  if (data.groceriesMonthly !== null) {
    expenditureLines.push({
      label: "Groceries",
      amount: data.groceriesMonthly,
    });
  }

  const pensionExpenditure = getMonthlyPensionContribution(
    data,
    getMonthlyGrossFromEntries(data),
  );
  if (pensionExpenditure > 0) {
    expenditureLines.push({
      label: "Workplace pension contribution",
      amount: pensionExpenditure,
      detail:
        data.pensionContributionType === "percent"
          ? `${data.pensionContributionAmount}% of income`
          : "Monthly amount",
    });
  }

  const expenditureTotal = expenditureLines.reduce(
    (sum, line) => sum + line.amount,
    0,
  );

  return {
    incomeLines,
    incomeTotal,
    expenditureLines,
    expenditureTotal,
    balance: incomeTotal - expenditureTotal,
    taxLines,
  };
}

export const BUDGET_DEMO_OPTIONS = [
  {
    id: "demo-1",
    label: "Lorem ipsum option one",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: "demo-2",
    label: "Lorem ipsum option two",
    text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: "demo-3",
    label: "Lorem ipsum option three",
    text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  },
];
