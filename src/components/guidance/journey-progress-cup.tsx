"use client";

import { useEffect, useId, useState } from "react";

import { cn } from "@/lib/utils";

interface JourneyProgressCupProps {
  fillPercent: number;
  animateOnMount?: boolean;
  className?: string;
}

const CUP_OUTLINE =
  "M 36 24 L 164 24 L 128 216 L 72 216 Z";

const CUP_INTERIOR =
  "M 40 28 L 160 28 L 126 212 L 74 212 Z";

export function JourneyProgressCup({
  fillPercent,
  animateOnMount = false,
  className,
}: JourneyProgressCupProps) {
  const clipId = useId();
  const [displayFill, setDisplayFill] = useState(
    animateOnMount ? 0 : fillPercent,
  );

  useEffect(() => {
    if (!animateOnMount) {
      setDisplayFill(fillPercent);
      return;
    }

    const frame = requestAnimationFrame(() => {
      setDisplayFill(fillPercent);
    });

    return () => cancelAnimationFrame(frame);
  }, [animateOnMount, fillPercent]);

  const clampedFill = Math.min(100, Math.max(0, displayFill));
  const fillHeight = (clampedFill / 100) * 184;
  const fillY = 212 - fillHeight;

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <svg
        viewBox="0 0 200 240"
        role="img"
        aria-label={`Financial picture ${Math.round(clampedFill)}% complete`}
        className="h-48 w-40 sm:h-56 sm:w-44"
      >
        <defs>
          <clipPath id={clipId}>
            <path d={CUP_INTERIOR} />
          </clipPath>
        </defs>

        <path
          d={CUP_OUTLINE}
          className="fill-cream-100 stroke-sand-700/25"
          strokeWidth="2"
        />

        <g clipPath={`url(#${clipId})`}>
          <rect
            x="36"
            y={fillY}
            width="128"
            height={fillHeight + 4}
            className="fill-sand-800 transition-[y,height] duration-700 ease-out motion-reduce:transition-none"
          />
          <rect
            x="36"
            y={fillY}
            width="128"
            height={fillHeight + 4}
            className="fill-sand-700/20 transition-[y,height] duration-700 ease-out motion-reduce:transition-none"
            style={{ mixBlendMode: "soft-light" }}
          />
        </g>

        <path
          d="M 40 28 L 160 28"
          className="stroke-sand-700/15"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
      </svg>

      <p className="text-sm text-sand-700">
        Your financial picture builds as you answer
      </p>
    </div>
  );
}
