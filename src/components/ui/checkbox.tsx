import * as React from "react";

import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

export function Checkbox({ className, label, id, ...props }: CheckboxProps) {
  const inputId = id ?? React.useId();

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "flex cursor-pointer items-start gap-3 text-sm text-sand-800",
        className,
      )}
    >
      <input
        id={inputId}
        type="checkbox"
        className="mt-1 h-4 w-4 rounded border-sand-700/30 text-sand-800 focus:ring-sand-800"
        {...props}
      />
      <span>{label}</span>
    </label>
  );
}
