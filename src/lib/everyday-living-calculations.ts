import type { EverydayLivingData, PaymentPeriod } from "@/lib/everyday-living-storage";

const JSA_WEEKLY_UNDER_25 = 75.65;
const JSA_WEEKLY_25_AND_OVER = 95.55;
const WEEKS_PER_MONTH = 52 / 12;

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

export function getEffectiveMonthlyIncome(
  data: EverydayLivingData,
  age: number | null,
): number {
  if (data.usingJsaAsIncome) return getJsaMonthlyAmount(age);
  if (data.income === null) return 0;
  return toMonthlyAmount(data.income, data.incomePeriod);
}

export function getMonthlyHousingCost(data: EverydayLivingData): number {
  if (data.housingAmount === null) return 0;
  return data.housingAmount;
}

export function getMonthlyExpenditure(data: EverydayLivingData): number {
  const housing = getMonthlyHousingCost(data);
  const water =
    data.water === null ? 0 : toMonthlyAmount(data.water, data.waterPeriod);
  const gasElectric =
    data.gasElectric === null
      ? 0
      : toMonthlyAmount(data.gasElectric, data.gasElectricPeriod);
  const councilTax =
    data.councilTax === null
      ? 0
      : toMonthlyAmount(data.councilTax, data.councilTaxPeriod);

  return housing + water + gasElectric + councilTax;
}

export function getMonthlyBalance(
  data: EverydayLivingData,
  age: number | null,
): number {
  return getEffectiveMonthlyIncome(data, age) - getMonthlyExpenditure(data);
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
