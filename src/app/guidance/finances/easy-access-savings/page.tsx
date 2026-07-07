import { SectionIntroContent } from "@/components/guidance/section-intro-content";
import { getSectionBySlug } from "@/lib/journey-sections";
import { notFound } from "next/navigation";

export default function EasyAccessSavingsIntroPage() {
  const section = getSectionBySlug("easy-access-savings");
  if (!section) notFound();
  return <SectionIntroContent section={section} />;
}
