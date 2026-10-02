import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ErrorReport {
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
 * Logs runtime frontend errors, unhandled rejections, and uncaught exceptions
 * directly to the Firebase Firestore `error_logs` collection.
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

    const stack = error instanceof Error ? error.stack : undefined;
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

    const payload: ErrorReport = {
      message: message.slice(0, 1000),
      stack: stack ? stack.slice(0, 2000) : undefined,
      source,
      page,
      userAgent: window.navigator.userAgent,
      timestamp: new Date().toISOString(),
      resolved: false,
    };

    const errorCollection = collection(db, "error_logs");
    await addDoc(errorCollection, {
      ...payload,
      createdAtServer: serverTimestamp(),
    });

    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn("[LevelUp Error Sensor] Logged error to Firestore:", message);
    }
  } catch (sensorErr) {
    // Fail silently: error logging should never break the user experience
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn("[LevelUp Error Sensor] Failed to transmit log:", sensorErr);
    }
  }
}
