import { JourneySectionNav } from "@/components/guidance/journey-section-nav";
import {
  PageShell,
  PrivacyFooter,
} from "@/components/layout/page-shell";
import { RestartButton } from "@/components/layout/restart-button";

interface FinanceJourneyShellProps {
  activeSlug: string | null;
  header: React.ReactNode;
  children: React.ReactNode;
}

export function FinanceJourneyShell({
  activeSlug,
  header,
  children,
}: FinanceJourneyShellProps) {
  return (
    <PageShell showRestart restartSlot={<RestartButton />}>
      <div className="flex flex-1 flex-col gap-8">
        {header}
        <JourneySectionNav activeSlug={activeSlug} />
        {children}
        <PrivacyFooter className="mt-auto" />
      </div>
    </PageShell>
  );
}
