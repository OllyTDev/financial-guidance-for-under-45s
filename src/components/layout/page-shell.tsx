import { cn } from "@/lib/utils";

interface PageShellProps {
  children: React.ReactNode;
  showRestart?: boolean;
  restartSlot?: React.ReactNode;
}

export function PageShell({
  children,
  showRestart = false,
  restartSlot,
}: PageShellProps) {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-8 sm:px-6 sm:py-12">
        {showRestart && restartSlot ? (
          <div className="mb-6 flex justify-end">{restartSlot}</div>
        ) : null}
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
}

interface ContentCardProps {
  children: React.ReactNode;
  className?: string;
}

export function ContentCard({ children, className }: ContentCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-sand-700/10 bg-white p-6 shadow-sm sm:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface PrivacyBadgeProps {
  className?: string;
}

export function PrivacyBadge({ className }: PrivacyBadgeProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-sand-700/10 bg-cream-100 px-4 py-3 text-sm text-sand-700",
        className,
      )}
    >
      <p className="font-medium text-sand-800">Your data stays on your device</p>
      <p className="mt-1">
        Nothing you enter is sent to a server. All calculations and information
        remain on this device only.
      </p>
    </div>
  );
}
