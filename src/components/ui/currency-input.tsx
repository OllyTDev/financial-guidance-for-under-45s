"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CurrencyInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function sanitizeNumericInput(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length <= 1) return cleaned;
  return `${parts[0]}.${parts.slice(1).join("")}`;
}

export function parseCurrencyValue(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function CurrencyInput({
  id,
  label,
  value,
  onChange,
  disabled = false,
  className,
}: CurrencyInputProps) {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange(sanitizeNumericInput(event.target.value));
  }

  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="text-sm font-medium text-sand-800">
        {label}
      </label>
      <div className="relative flex items-center">
        <span
          className="pointer-events-none absolute left-4 text-sand-700"
          aria-hidden="true"
        >
          £
        </span>
        <Input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className="pl-8"
        />
      </div>
    </div>
  );
}
