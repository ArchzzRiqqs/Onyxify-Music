"use client";

import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { id } from "@/lib/i18n/id";

type ErrorStateProps = {
  title: string;
  description: string;
  onRetry: () => void;
};

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="border-border bg-surface flex flex-col items-center justify-center rounded-xl border px-6 py-12 text-center"
    >
      <AlertCircle
        className="text-destructive mb-4 size-8"
        aria-hidden="true"
      />
      <h2 className="font-semibold">{title}</h2>
      <p className="text-muted mt-2 max-w-sm text-sm">{description}</p>
      <Button
        type="button"
        variant="outline"
        className="mt-5"
        onClick={onRetry}
      >
        {id.actions.retry}
      </Button>
    </div>
  );
}
