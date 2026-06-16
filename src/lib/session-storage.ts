import { getSessionStorage } from "@/lib/browser-storage";
import { clearEverydayLivingData } from "@/lib/everyday-living-storage";
import { clearJourneyProgress } from "@/lib/journey-progress";

const USER_AGE_KEY = "fg-user-age";

export function saveUserAge(age: number): void {
  getSessionStorage()?.setItem(USER_AGE_KEY, String(age));
}

export function getUserAge(): number | null {
  const value = getSessionStorage()?.getItem(USER_AGE_KEY);
  if (!value) return null;

  const age = Number.parseInt(value, 10);
  return Number.isNaN(age) ? null : age;
}

export function clearUserData(): void {
  getSessionStorage()?.removeItem(USER_AGE_KEY);
  clearJourneyProgress();
  clearEverydayLivingData();
}
