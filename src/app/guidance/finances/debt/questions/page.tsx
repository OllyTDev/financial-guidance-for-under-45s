import { FinanceSectionContent } from "@/components/guidance/finance-section-content";
import { getSectionBySlug } from "@/lib/journey-sections";
import { notFound } from "next/navigation";

export default function DebtQuestionsPage() {
  const section = getSectionBySlug("debt");
  if (!section) notFound();
  return <FinanceSectionContent section={section} />;
}
