import { FinanceSectionContent } from "@/components/guidance/finance-section-content";
import { getSectionBySlug } from "@/lib/journey-sections";
import { notFound } from "next/navigation";

export default function LifePurchasesQuestionsPage() {
  const section = getSectionBySlug("life-purchases");
  if (!section) notFound();
  return <FinanceSectionContent section={section} />;
}
