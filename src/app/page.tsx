import Link from "next/link";

import {
  ContentCard,
  PageShell,
  PrivacyBadge,
} from "@/components/layout/page-shell";
import { RestartButton } from "@/components/layout/restart-button";

export default function WelcomePage() {
  return (
    <PageShell showRestart restartSlot={<RestartButton />}>
      <div className="flex flex-1 flex-col justify-center gap-8">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wide text-sand-700">
            Financial guidance
          </p>
          <h1 className="text-3xl font-semibold text-sand-900 sm:text-4xl">
            Welcome
          </h1>
          <p className="text-lg text-sand-700">
            This is an information and guidance tool to help you think about
            managing your finances. It will not give you specific personal
            advice.
          </p>
        </div>

        <PrivacyBadge />

        <ContentCard>
          <p className="text-sand-700">
            We&apos;ll ask a few questions to point you towards guidance that
            fits your life stage. You can start over at any time and clear
            anything stored on this device.
          </p>
          <div className="mt-6">
            <Link
              href="/start/"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-sand-800 px-8 text-base font-medium text-white transition-colors hover:bg-sand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand-800 focus-visible:ring-offset-2"
            >
              Get started
            </Link>
          </div>
        </ContentCard>
      </div>
    </PageShell>
  );
}
