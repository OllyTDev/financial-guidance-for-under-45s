import {
  assertAllowedExternalUrl,
  type AllowedExternalUrl,
} from "@/lib/security/allowed-external-urls";
import { cn } from "@/lib/utils";

interface ExternalLinkProps {
  href: AllowedExternalUrl;
  children: React.ReactNode;
  className?: string;
}

export function ExternalLink({ href, children, className }: ExternalLinkProps) {
  const safeHref = assertAllowedExternalUrl(href);

  return (
    <a
      href={safeHref}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "font-medium text-sand-800 underline decoration-sand-700/30 underline-offset-4 hover:decoration-sand-800",
        className,
      )}
    >
      {children}
    </a>
  );
}
