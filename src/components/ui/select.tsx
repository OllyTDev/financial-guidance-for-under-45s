import * as React from "react";

import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function Select({ className, label, id, children, ...props }: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={selectId} className="text-sm font-medium text-sand-800">
          {label}
        </label>
      ) : null}
      <select
        id={selectId}
        className={cn(
          "flex h-11 w-full rounded-lg border border-sand-700/15 bg-white px-4 py-2 text-base text-sand-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand-800 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

interface PeriodSelectProps {
  id: string;
  value: "month" | "year";
  onChange: (value: "month" | "year") => void;
  disabled?: boolean;
  className?: string;
}

export function PeriodSelect({
  id,
  value,
  onChange,
  disabled = false,
  className,
}: PeriodSelectProps) {
  return (
    <Select
      id={id}
      value={value}
      disabled={disabled}
      className={cn("min-w-[8.5rem]", className)}
      onChange={(event) => onChange(event.target.value as "month" | "year")}
    >
      <option value="month">Per month</option>
      <option value="year">Per year</option>
    </Select>
  );
}
