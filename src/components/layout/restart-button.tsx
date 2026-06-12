"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { clearUserData } from "@/lib/session-storage";

export function RestartButton() {
  const router = useRouter();

  function handleRestart() {
    clearUserData();
    router.push("/");
  }

  return (
    <Button type="button" variant="ghost" size="sm" onClick={handleRestart}>
      Start over
    </Button>
  );
}
