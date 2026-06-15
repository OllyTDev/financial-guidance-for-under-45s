"use client";

import { useEffect, useId, useState } from "react";

import {
  JOURNEY_SECTIONS,
  type JourneySection,
} from "@/lib/journey-sections";
import { cn } from "@/lib/utils";

interface JourneyProgressCupProps {
  currentStep: number;
  showYouAreHere?: boolean;
  animateOnMount?: boolean;
  className?: string;
}

const CUP_OUTLINE = "M 36 24 L 164 24 L 128 216 L 72 216 Z";
const CUP_INTERIOR = "M 40 28 L 160 28 L 126 212 L 74 212 Z";

const CUP_TOP_Y = 28;
const CUP_BOTTOM_Y = 212;
const CUP_CENTER_X = 100;
const CUP_TOP_WIDTH = 120;
const CUP_BOTTOM_WIDTH = 52;
const CUP_HEIGHT = CUP_BOTTOM_Y - CUP_TOP_Y;
const SECTION_HEIGHT = CUP_HEIGHT / JOURNEY_SECTIONS.length;

function cupWidthAtY(y: number): number {
  const progress = (y - CUP_TOP_Y) / CUP_HEIGHT;
  return CUP_TOP_WIDTH - (CUP_TOP_WIDTH - CUP_BOTTOM_WIDTH) * progress;
}

function cupLeftAtY(y: number): number {
  return CUP_CENTER_X - cupWidthAtY(y) / 2;
}

function cupRightAtY(y: number): number {
  return CUP_CENTER_X + cupWidthAtY(y) / 2;
}

function getSectionBounds(index: number): { yTop: number; yBottom: number } {
  const yBottom = CUP_BOTTOM_Y - index * SECTION_HEIGHT;
  const yTop = yBottom - SECTION_HEIGHT;
  return { yTop, yBottom };
}

function getSectionDividerY(index: number): number {
  return getSectionBounds(index).yBottom;
}

function getInternalDividerIndices(): number[] {
  return JOURNEY_SECTIONS.map((_, index) => index).slice(1);
}

function getSectionPolygon(index: number): string {
  const { yTop, yBottom } = getSectionBounds(index);
  return [
    `${cupLeftAtY(yTop)},${yTop}`,
    `${cupRightAtY(yTop)},${yTop}`,
    `${cupRightAtY(yBottom)},${yBottom}`,
    `${cupLeftAtY(yBottom)},${yBottom}`,
  ].join(" ");
}

function getSectionOpacity(section: JourneySection, currentStep: number): number {
  if (currentStep >= section.step) return 1;
  return 0;
}

export function JourneyProgressCup({
  currentStep,
  showYouAreHere = false,
  animateOnMount = false,
  className,
}: JourneyProgressCupProps) {
  const clipId = useId();
  const [displayStep, setDisplayStep] = useState(
    animateOnMount ? 0 : currentStep,
  );

  useEffect(() => {
    if (!animateOnMount) {
      setDisplayStep(currentStep);
      return;
    }

    const frame = requestAnimationFrame(() => {
      setDisplayStep(currentStep);
    });

    return () => cancelAnimationFrame(frame);
  }, [animateOnMount, currentStep]);

  const activeStep = animateOnMount ? displayStep : currentStep;
  const fillPercent = Math.min(
    100,
    Math.max(0, (activeStep / JOURNEY_SECTIONS.length) * 100),
  );

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <svg
        viewBox="0 0 340 240"
        role="img"
        aria-label={`Financial picture ${Math.round(fillPercent)}% complete`}
        className="h-56 w-full max-w-sm sm:h-64"
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
          {JOURNEY_SECTIONS.map((section, index) => (
            <polygon
              key={section.slug}
              points={getSectionPolygon(index)}
              fill={section.color}
              opacity={getSectionOpacity(section, activeStep)}
              className="transition-opacity duration-700 ease-out motion-reduce:transition-none"
            />
          ))}

          {getInternalDividerIndices().map((index) => {
            const y = getSectionDividerY(index);
            return (
              <line
                key={`divider-${JOURNEY_SECTIONS[index].slug}`}
                x1={cupLeftAtY(y)}
                y1={y}
                x2={cupRightAtY(y)}
                y2={y}
                stroke="rgba(92, 83, 70, 0.15)"
                strokeWidth="1"
              />
            );
          })}
        </g>

        {JOURNEY_SECTIONS.map((section, index) => {
          const { yTop, yBottom } = getSectionBounds(index);
          const yCenter = (yTop + yBottom) / 2;
          const isCurrent = showYouAreHere && section.step === activeStep;

          return (
            <g key={`label-${section.slug}`}>
              <line
                x1={cupRightAtY(yCenter) + 4}
                y1={yCenter}
                x2={188}
                y2={yCenter}
                stroke="rgba(92, 83, 70, 0.2)"
                strokeWidth="1"
              />
              <text
                x={192}
                y={yCenter + 4}
                fontSize="10"
                fill="#3D3830"
                fontWeight={isCurrent ? 800 : 400}
              >
                {section.title}
              </text>
              {isCurrent ? (
                <text
                  x={192}
                  y={yCenter + 17}
                  fontSize="9"
                  fill="#5C5346"
                  fontWeight="500"
                >
                  You are here
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>

      <p className="text-sm text-sand-700">
        Your financial picture builds as you answer
      </p>
    </div>
  );
}
