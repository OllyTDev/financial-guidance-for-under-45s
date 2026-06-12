import { AgeForm } from "@/components/start/age-form";
import {
  ContentCard,
  PageShell,
  PrivacyBadge,
} from "@/components/layout/page-shell";
import { RestartButton } from "@/components/layout/restart-button";

export default function StartPage() {
  return (
    <PageShell showRestart restartSlot={<RestartButton />}>
      <div className="flex flex-1 flex-col justify-center gap-8">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wide text-sand-700">
            Start your journey
          </p>
          <h1 className="text-3xl font-semibold text-sand-900 sm:text-4xl">
            Tell us your age
          </h1>
          <p className="text-sand-700">
            We use your age to place you in the right guidance journey. Nothing
            is sent online.
          </p>
        </div>

        <PrivacyBadge />

        <ContentCard>
          <AgeForm />
        </ContentCard>
      </div>
    </PageShell>
  );
}
