import { getSessionStorage } from "@/lib/browser-storage";

export type PaymentPeriod = "month" | "year";

export type HousingType = "rent" | "mortgage";

export interface EverydayLivingData {
  income: number | null;
  incomePeriod: PaymentPeriod;
  isPreTax: boolean | null;
  receivingBenefits: boolean | null;
  usingJsaAsIncome: boolean;
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

export const EMPTY_EVERYDAY_LIVING: EverydayLivingData = {
  income: null,
  incomePeriod: "month",
  isPreTax: null,
  receivingBenefits: null,
  usingJsaAsIncome: false,
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

export function getEverydayLivingData(): EverydayLivingData {
  const raw = getSessionStorage()?.getItem(STORAGE_KEY);
  if (!raw) return { ...EMPTY_EVERYDAY_LIVING };

  try {
    return { ...EMPTY_EVERYDAY_LIVING, ...JSON.parse(raw) };
  } catch {
    return { ...EMPTY_EVERYDAY_LIVING };
  }
}

export function saveEverydayLivingData(data: EverydayLivingData): void {
  getSessionStorage()?.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearEverydayLivingData(): void {
  getSessionStorage()?.removeItem(STORAGE_KEY);
}

export function isZeroIncome(data: EverydayLivingData): boolean {
  return data.income === 0;
}

export function isIncomeSectionComplete(data: EverydayLivingData): boolean {
  if (data.income === null || data.isPreTax === null) return false;
  if (data.income > 0) return true;
  if (data.receivingBenefits === null) return false;
  if (data.receivingBenefits) return true;
  return data.usingJsaAsIncome;
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
