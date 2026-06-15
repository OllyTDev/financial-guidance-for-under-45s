import { FinanceSectionContent } from "@/components/guidance/finance-section-content";
import { getSectionBySlug } from "@/lib/journey-sections";
import { notFound } from "next/navigation";

export default function EasyAccessSavingsPage() {
  const section = getSectionBySlug("easy-access-savings");
  if (!section) notFound();
  return <FinanceSectionContent section={section} />;
}
