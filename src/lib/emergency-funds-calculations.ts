import { getEffectiveMonthlyIncome } from "@/lib/everyday-living-calculations";
import {
  EMPTY_EVERYDAY_LIVING,
  type EverydayLivingData,
  hasAnyIncomeEntered,
  isZeroIncome,
} from "@/lib/everyday-living-storage";
import {
  isFallbackIncomeComplete,
  type EmergencyFundsData,
  toIncomeCaptureData,
} from "@/lib/emergency-funds-storage";

export function hasUsableIncomeFromEverydayLiving(
  data: EverydayLivingData,
): boolean {
  if (data.usingJsaAsIncome) return true;

  if (!hasAnyIncomeEntered(data)) return false;

  for (const entry of data.incomes) {
    if (entry.amount === null) return false;
    if (entry.amount > 0 && entry.isPreTax === null) return false;
  }

  if (isZeroIncome(data)) {
    if (data.receivingBenefits === null) return false;
    if (data.receivingBenefits) return true;
    return data.usingJsaAsIncome;
  }

  return true;
}

function buildFallbackEverydayLivingData(
  emergency: EmergencyFundsData,
): EverydayLivingData {
  return {
    ...EMPTY_EVERYDAY_LIVING,
    ...toIncomeCaptureData(emergency),
  };
}

export function getMonthlyIncomeForEmergencyFunds(
  everyday: EverydayLivingData,
  emergency: EmergencyFundsData,
  age: number | null,
): number | null {
  if (hasUsableIncomeFromEverydayLiving(everyday)) {
    return getEffectiveMonthlyIncome(everyday, age);
  }

  if (isFallbackIncomeComplete(emergency)) {
    return getEffectiveMonthlyIncome(
      buildFallbackEverydayLivingData(emergency),
      age,
    );
  }

  return null;
}

export function getEmergencyFundTarget(
  everyday: EverydayLivingData,
  emergency: EmergencyFundsData,
  age: number | null,
): number | null {
  const monthlyIncome = getMonthlyIncomeForEmergencyFunds(
    everyday,
    emergency,
    age,
  );
  if (monthlyIncome === null) return null;
  return monthlyIncome;
}

export interface EmergencyFundsSummary {
  targetAmount: number;
  currentSavings: number;
  hasMetTarget: boolean;
  incomeSource: "everyday-living" | "fallback";
}

export function buildEmergencyFundsSummary(
  everyday: EverydayLivingData,
  emergency: EmergencyFundsData,
  age: number | null,
): EmergencyFundsSummary | null {
  const targetAmount = getEmergencyFundTarget(everyday, emergency, age);
  if (targetAmount === null) return null;

  const currentSavings =
    emergency.hasSavingsAccount === true ? (emergency.amountSaved ?? 0) : 0;

  return {
    targetAmount,
    currentSavings,
    hasMetTarget: currentSavings >= targetAmount,
    incomeSource: hasUsableIncomeFromEverydayLiving(everyday)
      ? "everyday-living"
      : "fallback",
  };
}

export function isEmergencyFundsComplete(
  everyday: EverydayLivingData,
  emergency: EmergencyFundsData,
  age: number | null,
): boolean {
  if (getMonthlyIncomeForEmergencyFunds(everyday, emergency, age) === null) {
    return false;
  }
  if (emergency.hasSavingsAccount === null) return false;
  if (emergency.hasSavingsAccount && emergency.amountSaved === null) {
    return false;
  }
  return true;
}
