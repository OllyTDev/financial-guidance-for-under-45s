import Link from "next/link";

import {
  JOURNEY_SECTIONS,
  getSectionPath,
} from "@/lib/journey-sections";
import { cn } from "@/lib/utils";

interface JourneySectionNavProps {
  activeSlug: string | null;
  className?: string;
}

export function JourneySectionNav({
  activeSlug,
  className,
}: JourneySectionNavProps) {
  return (
    <nav aria-label="Jump to section" className={className}>
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-sand-700/15 bg-sand-700/15 sm:grid-cols-3 lg:grid-cols-6">
        {JOURNEY_SECTIONS.map((section) => {
          const isActive = section.slug === activeSlug;

          return (
            <li key={section.slug} className="bg-cream-50">
              <Link
                href={getSectionPath(section.slug)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex h-full min-h-[3.25rem] items-center justify-center px-2 py-2.5 text-center text-xs font-medium leading-tight transition-colors sm:min-h-[3.5rem] sm:px-3 sm:text-sm",
                  isActive
                    ? "text-sand-900 ring-2 ring-inset ring-sand-800"
                    : "text-sand-700 hover:bg-cream-100",
                )}
                style={
                  isActive ? { backgroundColor: section.color } : undefined
                }
              >
                {section.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
