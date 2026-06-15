import { FinanceSectionContent } from "@/components/guidance/finance-section-content";
import { getSectionBySlug } from "@/lib/journey-sections";
import { notFound } from "next/navigation";

export default function EmergencyFundsPage() {
  const section = getSectionBySlug("emergency-funds");
  if (!section) notFound();
  return <FinanceSectionContent section={section} />;
}
