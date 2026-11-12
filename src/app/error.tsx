"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/shared/error-state";
import { id } from "@/lib/i18n/id";
import { logger } from "@/lib/logger";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Unhandled application error", { digest: error.digest });
  }, [error]);

  return (
    <html lang="id">
      <body className="bg-background text-foreground">
        <div className="mx-auto max-w-screen-2xl px-4 py-8">
          <ErrorState
            title={id.pages.loadErrorTitle}
            description={id.pages.loadErrorDescription}
            onRetry={reset}
          />
        </div>
      </body>
    </html>
  );
}
