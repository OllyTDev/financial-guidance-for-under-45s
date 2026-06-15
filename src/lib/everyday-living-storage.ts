export type HousingType = "rent" | "mortgage";

export interface EverydayLivingData {
  housingType: HousingType | null;
  housingAmount: number | null;
  mortgagePaidOffConfirmed: boolean;
  utilitiesIncluded: boolean;
  water: number | null;
  gasElectric: number | null;
  councilTax: number | null;
  livesAlone: boolean | null;
  appliedCouncilTaxReduction: boolean | null;
}

export const EMPTY_EVERYDAY_LIVING: EverydayLivingData = {
  housingType: null,
  housingAmount: null,
  mortgagePaidOffConfirmed: false,
  utilitiesIncluded: false,
  water: null,
  gasElectric: null,
  councilTax: null,
  livesAlone: null,
  appliedCouncilTaxReduction: null,
};

const STORAGE_KEY = "fg-everyday-living";

export function getEverydayLivingData(): EverydayLivingData {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return { ...EMPTY_EVERYDAY_LIVING };

  try {
    return { ...EMPTY_EVERYDAY_LIVING, ...JSON.parse(raw) };
  } catch {
    return { ...EMPTY_EVERYDAY_LIVING };
  }
}

export function saveEverydayLivingData(data: EverydayLivingData): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearEverydayLivingData(): void {
  sessionStorage.removeItem(STORAGE_KEY);
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
  if (!isHousingAmountValid(data)) return false;
  if (data.water === null || data.gasElectric === null) return false;
  if (!isCouncilTaxEntered(data)) return false;
  if (data.livesAlone === null) return false;
  if (data.livesAlone && data.appliedCouncilTaxReduction === null) return false;
  return true;
}
