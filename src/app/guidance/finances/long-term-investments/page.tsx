import { FinanceSectionContent } from "@/components/guidance/finance-section-content";
import { getSectionBySlug } from "@/lib/journey-sections";
import { notFound } from "next/navigation";

export default function LongTermInvestmentsPage() {
  const section = getSectionBySlug("long-term-investments");
  if (!section) notFound();
  return <FinanceSectionContent section={section} />;
}
