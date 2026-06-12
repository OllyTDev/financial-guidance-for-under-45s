"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { WhyAgeInfo } from "@/components/start/why-age-info";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getGuidancePath, validateAge } from "@/lib/age-bands";
import { saveUserAge } from "@/lib/session-storage";

const ERROR_MESSAGES = {
  invalid: "Please enter a valid whole number for your age.",
  tooYoung:
    "Please enter an age of 7 or above. You may have made a mistake.",
  tooWise:
    "Did you make a mistake? If not you're just too wise for this journey.",
};

export function AgeForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const rawAge = String(formData.get("age") ?? "").trim();
    const age = Number.parseInt(rawAge, 10);

    if (!rawAge || Number.isNaN(age)) {
      setError(ERROR_MESSAGES.invalid);
      return;
    }

    const result = validateAge(age);

    if (result.status === "too-young") {
      setError(ERROR_MESSAGES.tooYoung);
      return;
    }

    if (result.status === "too-wise") {
      setError(ERROR_MESSAGES.tooWise);
      return;
    }

    saveUserAge(result.age);
    router.push(getGuidancePath(result.band));
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="age" className="text-sm font-medium text-sand-800">
            How old are you?
          </label>
          <WhyAgeInfo />
        </div>
        <Input
          id="age"
          name="age"
          type="number"
          inputMode="numeric"
          min={7}
          max={100}
          placeholder="Enter your age"
          aria-describedby={error ? "age-error" : undefined}
          aria-invalid={error ? true : undefined}
          required
        />
      </div>

      {error ? (
        <p id="age-error" className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full sm:w-auto">
        Continue
      </Button>
    </form>
  );
}
