import { FinanceSectionContent } from "@/components/guidance/finance-section-content";
import { getSectionBySlug } from "@/lib/journey-sections";
import { notFound } from "next/navigation";

export default function EverydayLivingPage() {
  const section = getSectionBySlug("everyday-living");
  if (!section) notFound();
  return <FinanceSectionContent section={section} />;
}
