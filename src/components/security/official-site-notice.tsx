"use client";

import { useEffect, useState } from "react";

import { ContentCard } from "@/components/layout/page-shell";

export function OfficialSiteNotice() {
  const [origin, setOrigin] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    <ContentCard className="border-sand-800/10 bg-cream-100">
      <p className="text-sm font-medium text-sand-800">Official site check</p>
      {origin ? (
        <p className="mt-2 text-sm text-sand-700">
          You are viewing this tool at{" "}
          <span className="font-mono text-sand-900">{origin}</span>. Only enter
          financial information when you trust this address.
        </p>
      ) : (
        <p className="mt-2 text-sm text-sand-700">Checking your current URL…</p>
      )}
    </ContentCard>
  );
}
