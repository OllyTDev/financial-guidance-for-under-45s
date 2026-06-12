"use client";

import { CircleHelp } from "lucide-react";
import { useId, useState } from "react";

import { cn } from "@/lib/utils";

const WHY_AGE_MESSAGE =
  "We use this to help fit the advice best to your current life situation.";

export function WhyAgeInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-sand-700",
          "hover:bg-cream-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand-800 focus-visible:ring-offset-2",
        )}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((open) => !open)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsOpen(false);
          }
        }}
      >
        <CircleHelp className="h-4 w-4" aria-hidden="true" />
        Why do we need this?
      </button>

      {isOpen ? (
        <div
          id={panelId}
          role="tooltip"
          className="absolute left-0 top-full z-10 mt-2 w-72 rounded-lg border border-sand-700/10 bg-white p-3 text-sm text-sand-700 shadow-md sm:left-auto sm:right-0"
        >
          {WHY_AGE_MESSAGE}
        </div>
      ) : null}
    </div>
  );
}
