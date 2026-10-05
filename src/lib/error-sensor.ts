export interface ErrorReport {
  message: string;
  stack?: string;
  source: string;
  page: string;
  userAgent?: string;
  timestamp: string;
  resolved: boolean;
}

const reportedErrorsSet = new Set<string>();

/**
 * Real-time client error sensor:
 * Logs runtime frontend errors, unhandled rejections, and uncaught exceptions.
 */
export async function reportClientError(
  error: unknown,
  source: string = "runtime_exception",
) {
  if (typeof window === "undefined") return;

  try {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : JSON.stringify(error);

    const page = window.location.pathname;

    // Deduplicate identical error messages within session to avoid flooding
    const errorFingerprint = `${source}:${message}:${page}`;
    if (reportedErrorsSet.has(errorFingerprint)) {
      return;
    }
    reportedErrorsSet.add(errorFingerprint);

    // Limit memory footprint of deduplication set
    if (reportedErrorsSet.size > 50) {
      reportedErrorsSet.clear();
    }

    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn("[LevelUp Error Sensor] Logged error:", message);
    }
  } catch {
    // Fail silently: error logging should never break the user experience
  }
}
