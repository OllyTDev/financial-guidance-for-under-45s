import { getSessionStorage } from "@/lib/browser-storage";
import {
  createIncomeEntry,
  type EverydayLivingData,
  type IncomeEntry,
} from "@/lib/everyday-living-storage";

export interface EmergencyFundsData {
  fallbackIncomes: IncomeEntry[];
  receivingBenefits: boolean | null;
  usingJsaAsIncome: boolean;
  hasSavingsAccount: boolean | null;
  amountSaved: number | null;
}

export const EMPTY_EMERGENCY_FUNDS: EmergencyFundsData = {
  fallbackIncomes: [createIncomeEntry()],
  receivingBenefits: null,
  usingJsaAsIncome: false,
  hasSavingsAccount: null,
  amountSaved: null,
};

const STORAGE_KEY = "fg-emergency-funds";

export function getEmergencyFundsData(): EmergencyFundsData {
  const raw = getSessionStorage()?.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      ...EMPTY_EMERGENCY_FUNDS,
      fallbackIncomes: [createIncomeEntry()],
    };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<EmergencyFundsData>;
    const data = { ...EMPTY_EMERGENCY_FUNDS, ...parsed };
    if (!data.fallbackIncomes?.length) {
      data.fallbackIncomes = [createIncomeEntry()];
    }
    return data;
  } catch {
    return {
      ...EMPTY_EMERGENCY_FUNDS,
      fallbackIncomes: [createIncomeEntry()],
    };
  }
}

export function saveEmergencyFundsData(data: EmergencyFundsData): void {
  getSessionStorage()?.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearEmergencyFundsData(): void {
  getSessionStorage()?.removeItem(STORAGE_KEY);
}

export function toIncomeCaptureData(
  data: EmergencyFundsData,
): Pick<
  EverydayLivingData,
  "incomes" | "receivingBenefits" | "usingJsaAsIncome"
> {
  return {
    incomes: data.fallbackIncomes,
    receivingBenefits: data.receivingBenefits,
    usingJsaAsIncome: data.usingJsaAsIncome,
  };
}

export function isFallbackIncomeComplete(data: EmergencyFundsData): boolean {
  for (const entry of data.fallbackIncomes) {
    if (entry.amount === null) return false;
    if (entry.amount > 0 && entry.isPreTax === null) return false;
  }

  const allZero = data.fallbackIncomes.every(
    (entry) => entry.amount !== null && entry.amount <= 0,
  );

  if (!allZero) return true;
  if (data.receivingBenefits === null) return false;
  if (data.receivingBenefits) return true;
  return data.usingJsaAsIncome;
}

export function isSavingsSectionComplete(data: EmergencyFundsData): boolean {
  if (data.hasSavingsAccount === null) return false;
  if (data.hasSavingsAccount) return data.amountSaved !== null;
  return true;
}

export const EMERGENCY_FUNDS_REVIEW_PATH =
  "/guidance/finances/emergency-funds/review/";

export function getCurrentSavings(data: EmergencyFundsData): number {
  if (data.hasSavingsAccount !== true) return 0;
  return data.amountSaved ?? 0;
}
