"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  onClose?: () => void;
}

export function Dialog({
  open,
  title,
  children,
  confirmLabel,
  onConfirm,
  onClose,
}: DialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-sand-900/40"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className={cn(
          "relative z-10 w-full max-w-md rounded-2xl border border-sand-700/10",
          "bg-white p-6 shadow-lg",
        )}
      >
        <h2 id="dialog-title" className="text-lg font-semibold text-sand-900">
          {title}
        </h2>
        <div className="mt-3 text-sm text-sand-700">{children}</div>
        <div className="mt-6">
          <Button type="button" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
