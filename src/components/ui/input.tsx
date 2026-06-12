import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-lg border border-sand-700/15 bg-white px-4 py-2 text-base text-sand-900 shadow-sm placeholder:text-sand-700/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand-800 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
