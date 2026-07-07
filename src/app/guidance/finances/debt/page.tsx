import { SectionIntroContent } from "@/components/guidance/section-intro-content";
import { getSectionBySlug } from "@/lib/journey-sections";
import { notFound } from "next/navigation";

export default function DebtIntroPage() {
  const section = getSectionBySlug("debt");
  if (!section) notFound();
  return <SectionIntroContent section={section} />;
}
