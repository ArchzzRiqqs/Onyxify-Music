"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/shared/error-state";
import { id } from "@/lib/i18n/id";

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-10">
      <ErrorState
        title={id.pages.loadErrorTitle}
        description={id.pages.loadErrorDescription}
        onRetry={reset}
      />
    </div>
  );
}
