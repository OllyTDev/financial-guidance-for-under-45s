import { getSessionStorage } from "@/lib/browser-storage";

export type PaymentPeriod = "month" | "year";

export type HousingType = "rent" | "mortgage";

export type PensionContributionType = "monthly" | "percent";

export interface IncomeEntry {
  id: string;
  amount: number | null;
  period: PaymentPeriod;
  isPreTax: boolean | null;
}

export interface EverydayLivingData {
  incomes: IncomeEntry[];
  receivingBenefits: boolean | null;
  usingJsaAsIncome: boolean;
  hasWorkplacePension: boolean | null;
  pensionContributionType: PensionContributionType | null;
  pensionContributionAmount: number | null;
  groceriesMonthly: number | null;
  housingType: HousingType | null;
  housingAmount: number | null;
  mortgagePaidOffConfirmed: boolean;
  utilitiesIncluded: boolean;
  water: number | null;
  waterPeriod: PaymentPeriod;
  gasElectric: number | null;
  gasElectricPeriod: PaymentPeriod;
  councilTax: number | null;
  councilTaxPeriod: PaymentPeriod;
  livesAlone: boolean | null;
  appliedCouncilTaxReduction: boolean | null;
}

export function createIncomeEntry(): IncomeEntry {
  return {
    id: crypto.randomUUID(),
    amount: null,
    period: "month",
    isPreTax: null,
  };
}

export const EMPTY_EVERYDAY_LIVING: EverydayLivingData = {
  incomes: [createIncomeEntry()],
  receivingBenefits: null,
  usingJsaAsIncome: false,
  hasWorkplacePension: null,
  pensionContributionType: null,
  pensionContributionAmount: null,
  groceriesMonthly: null,
  housingType: null,
  housingAmount: null,
  mortgagePaidOffConfirmed: false,
  utilitiesIncluded: false,
  water: null,
  waterPeriod: "month",
  gasElectric: null,
  gasElectricPeriod: "month",
  councilTax: null,
  councilTaxPeriod: "month",
  livesAlone: null,
  appliedCouncilTaxReduction: null,
};

const STORAGE_KEY = "fg-everyday-living";

interface LegacyEverydayLivingData {
  income?: number | null;
  incomePeriod?: PaymentPeriod;
  isPreTax?: boolean | null;
}

function migrateStoredData(
  parsed: LegacyEverydayLivingData & Partial<EverydayLivingData>,
): EverydayLivingData {
  const base = { ...EMPTY_EVERYDAY_LIVING, ...parsed };

  if (!parsed.incomes && parsed.income !== undefined) {
    base.incomes = [
      {
        id: crypto.randomUUID(),
        amount: parsed.income ?? null,
        period: parsed.incomePeriod ?? "month",
        isPreTax: parsed.isPreTax ?? null,
      },
    ];
  }

  if (!base.incomes?.length) {
    base.incomes = [createIncomeEntry()];
  }

  return base;
}

export function getEverydayLivingData(): EverydayLivingData {
  const raw = getSessionStorage()?.getItem(STORAGE_KEY);
  if (!raw) return { ...EMPTY_EVERYDAY_LIVING, incomes: [createIncomeEntry()] };

  try {
    return migrateStoredData(JSON.parse(raw));
  } catch {
    return { ...EMPTY_EVERYDAY_LIVING, incomes: [createIncomeEntry()] };
  }
}

export function saveEverydayLivingData(data: EverydayLivingData): void {
  getSessionStorage()?.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearEverydayLivingData(): void {
  getSessionStorage()?.removeItem(STORAGE_KEY);
}

export function toAnnualAmount(
  amount: number,
  period: PaymentPeriod,
): number {
  if (period === "year") return amount;
  return amount * 12;
}

export function hasAnyIncomeEntered(data: EverydayLivingData): boolean {
  return data.incomes.every((entry) => entry.amount !== null);
}

export function getTotalGrossAnnual(data: EverydayLivingData): number {
  return data.incomes.reduce((total, entry) => {
    if (entry.amount === null || entry.amount <= 0) return total;
    return total + toAnnualAmount(entry.amount, entry.period);
  }, 0);
}

export function isZeroIncome(data: EverydayLivingData): boolean {
  if (!hasAnyIncomeEntered(data)) return false;
  return getTotalGrossAnnual(data) === 0;
}

export function isIncomeEntriesComplete(data: EverydayLivingData): boolean {
  if (!hasAnyIncomeEntered(data)) return false;

  for (const entry of data.incomes) {
    if (entry.amount === null) return false;
    if (entry.amount > 0 && entry.isPreTax === null) return false;
  }

  if (!isZeroIncome(data)) return true;
  if (data.receivingBenefits === null) return false;
  if (data.receivingBenefits) return true;
  return data.usingJsaAsIncome;
}

export function getPensionValidationError(
  data: EverydayLivingData,
  monthlyGrossIncome: number,
): string | null {
  if (data.hasWorkplacePension !== true) return null;
  if (!data.pensionContributionType || data.pensionContributionAmount === null) {
    return "Please enter your pension contribution.";
  }

  if (data.pensionContributionType === "monthly") {
    if (data.pensionContributionAmount > monthlyGrossIncome) {
      return "Monthly pension contributions cannot exceed your income.";
    }
    return null;
  }

  if (
    data.pensionContributionAmount < 1 ||
    data.pensionContributionAmount > 40
  ) {
    return "Enter a percentage between 1% and 40%.";
  }

  return null;
}

export function isPensionSectionComplete(
  data: EverydayLivingData,
  monthlyGrossIncome: number,
): boolean {
  if (!isIncomeEntriesComplete(data)) return false;
  if (data.hasWorkplacePension === null) return false;
  if (!data.hasWorkplacePension) return true;
  return getPensionValidationError(data, monthlyGrossIncome) === null;
}

export function isIncomeSectionComplete(data: EverydayLivingData): boolean {
  const monthlyGross = getTotalGrossAnnual(data) / 12;
  if (!isPensionSectionComplete(data, monthlyGross)) return false;
  return data.groceriesMonthly !== null;
}

export function isMortgageZero(data: EverydayLivingData): boolean {
  return data.housingType === "mortgage" && data.housingAmount === 0;
}

export function isHousingAmountValid(data: EverydayLivingData): boolean {
  if (data.housingAmount === null || data.housingAmount < 0) return false;
  if (isMortgageZero(data) && !data.mortgagePaidOffConfirmed) return false;
  return data.housingType !== null;
}

export function isCouncilTaxEntered(data: EverydayLivingData): boolean {
  return data.councilTax !== null;
}

export function isEverydayLivingComplete(data: EverydayLivingData): boolean {
  if (!isIncomeSectionComplete(data)) return false;
  if (!isHousingAmountValid(data)) return false;
  if (data.water === null || data.gasElectric === null) return false;
  if (!isCouncilTaxEntered(data)) return false;
  if (data.livesAlone === null) return false;
  if (data.livesAlone && data.appliedCouncilTaxReduction === null) return false;
  return true;
}

export const EVERYDAY_LIVING_REVIEW_PATH =
  "/guidance/finances/everyday-living/review/";

export const MIN_PENSION_PERCENT = 1;
export const MAX_PENSION_PERCENT = 40;
