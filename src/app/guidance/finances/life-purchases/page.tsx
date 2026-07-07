import { SectionIntroContent } from "@/components/guidance/section-intro-content";
import { getSectionBySlug } from "@/lib/journey-sections";
import { notFound } from "next/navigation";

export default function LifePurchasesIntroPage() {
  const section = getSectionBySlug("life-purchases");
  if (!section) notFound();
  return <SectionIntroContent section={section} />;
}
