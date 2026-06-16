"use client";

import { CurrencyInput } from "@/components/ui/currency-input";
import { PeriodSelect } from "@/components/ui/select";
import type { PaymentPeriod } from "@/lib/everyday-living-storage";
import { cn } from "@/lib/utils";

interface CurrencyInputWithPeriodProps {
  id: string;
  label: string;
  value: string;
  period: PaymentPeriod;
  onValueChange: (value: string) => void;
  onPeriodChange: (period: PaymentPeriod) => void;
  disabled?: boolean;
  className?: string;
}

export function CurrencyInputWithPeriod({
  id,
  label,
  value,
  period,
  onValueChange,
  onPeriodChange,
  disabled = false,
  className,
}: CurrencyInputWithPeriodProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <CurrencyInput
          id={id}
          label={label}
          value={value}
          onChange={onValueChange}
          disabled={disabled}
          className="flex-1"
        />
        <PeriodSelect
          id={`${id}-period`}
          value={period}
          onChange={onPeriodChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
