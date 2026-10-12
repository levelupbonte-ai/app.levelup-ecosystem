"use client";

import { useEffect } from "react";

import { ErrorShell } from "@/components/error-shell";
import { reportClientError } from "@/lib/error-sensor";

/**
 * Route error boundary. Visitors only ever see a generic message: no stack
 * trace and no provider or database text.
 */
export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportClientError(error, "app.error-boundary");
  }, [error]);
  return <ErrorShell kind="error" onRetry={reset} />;
}
