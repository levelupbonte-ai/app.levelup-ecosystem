"use client";

import { useEffect } from "react";
import { reportClientError } from "@/lib/error-sensor";

/**
 * Client-side component that hooks into global window error and promise rejection
 * events to report anomalies in real time to the Firestore database.
 */
export function ErrorSensor() {
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      reportClientError(
        event.error || event.message || "Unknown Window Error",
        "window.onerror",
      );
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      reportClientError(
        event.reason || "Unhandled Promise Rejection",
        "unhandledrejection",
      );
    };

    window.addEventListener("error", handleGlobalError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleGlobalError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return null;
}
