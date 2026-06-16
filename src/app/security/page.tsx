import Link from "next/link";

import {
  ContentCard,
  PageShell,
} from "@/components/layout/page-shell";
import { OfficialSiteNotice } from "@/components/security/official-site-notice";

export default function SecurityPage() {
  return (
    <PageShell>
      <div className="flex flex-1 flex-col gap-8 py-4">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wide text-sand-700">
            Trust &amp; privacy
          </p>
          <h1 className="text-3xl font-semibold text-sand-900 sm:text-4xl">
            Security &amp; privacy
          </h1>
          <p className="text-lg text-sand-700">
            How this tool handles your information and what we do to reduce
            common web risks.
          </p>
        </div>

        <OfficialSiteNotice />

        <ContentCard className="space-y-6 text-sand-700">
          <section className="space-y-2">
            <h2 className="text-lg font-medium text-sand-900">
              Your data stays on your device
            </h2>
            <p>
              Financial information you enter is stored in your browser&apos;s
              session storage only. It is not sent to our servers. Calculations
              run on your device. Use <strong>Start over</strong> to clear stored
              data at any time.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-medium text-sand-900">
              What we do not collect
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>No analytics or tracking scripts</li>
              <li>No accounts or cloud sync</li>
              <li>No server-side storage of your answers</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-medium text-sand-900">
              External links
            </h2>
            <p>
              Links to government guidance (GOV.UK) open in a new tab and use an
              allowlist — only approved official URLs are used in this app. We
              never construct external links from data you type.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-medium text-sand-900">
              Browser protections
            </h2>
            <p>
              We apply a Content Security Policy to limit scripts and background
              connections to this site, reducing the risk of injected code sending
              data elsewhere. This does not protect against malware on your
              device or untrusted browser extensions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-medium text-sand-900">
              Beware of copycat sites
            </h2>
            <p>
              Anyone can copy a public website and host a malicious version
              elsewhere. We cannot prevent that. Only use this tool at the
              official address shown above. Do not enter financial details into
              sites that look similar but use a different URL.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-medium text-sand-900">
              Shared or public devices
            </h2>
            <p>
              Session storage is visible to anyone who can access your browser
              session. Avoid using this tool on shared computers where others may
              see your screen or browser history.
            </p>
          </section>

          <p className="text-sm text-sand-700/80">
            Technical details for developers are in{" "}
            <code className="rounded bg-cream-100 px-1.5 py-0.5 text-sand-800">
              docs/security-and-privacy-architecture.md
            </code>{" "}
            in the project repository.
          </p>
        </ContentCard>

        <Link
          href="/"
          className="text-sm text-sand-700 underline decoration-sand-700/30 underline-offset-4 hover:decoration-sand-800"
        >
          Back to welcome
        </Link>
      </div>
    </PageShell>
  );
}
