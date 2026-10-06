"use client";

import { useEffect } from "react";
import { reportClientError } from "@/lib/error-sensor";

/**
 * Client-side component that hooks into global window error and promise rejection
 * events to report anomalies in real time to the Firestore database.
 */
export function ErrorSensor() {
  useEffect(() => {
    const isChunkLoadError = (err: unknown): boolean => {
      const msg =
        err instanceof Error
          ? `${err.name} ${err.message}`
          : typeof err === "string"
            ? err
            : "";
      return (
        msg.includes("ChunkLoadError") ||
        msg.includes("Loading chunk") ||
        msg.includes("Failed to fetch dynamically imported module")
      );
    };

    const recoverFromChunkError = (event: Event) => {
      event.preventDefault();
      try {
        const reloadKey = "levelup_chunk_reload_ts";
        const lastReload = Number(sessionStorage.getItem(reloadKey) || "0");
        const now = Date.now();
        if (now - lastReload > 15000) {
          sessionStorage.setItem(reloadKey, String(now));
          window.location.reload();
        }
      } catch {
        window.location.reload();
      }
    };

    const handleGlobalError = (event: ErrorEvent) => {
      if (isChunkLoadError(event.error || event.message)) {
        recoverFromChunkError(event);
        return;
      }
      reportClientError(
        event.error || event.message || "Unknown Window Error",
        "window.onerror",
      );
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (isChunkLoadError(event.reason)) {
        recoverFromChunkError(event);
        return;
      }
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
