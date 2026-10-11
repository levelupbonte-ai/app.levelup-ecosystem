"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

/**
 * Cookieless page-view analytics and real-user speed measurements.
 * Nothing is stored on the visitor's device, and the query string is removed
 * from every recorded address (it can carry personal or one-time values).
 */
function stripQuery<T extends { url: string }>(event: T): T {
  try {
    const url = new URL(event.url);
    url.search = "";
    url.hash = "";
    return { ...event, url: url.toString() };
  } catch {
    return event;
  }
}

export function WebAnalytics() {
  return (
    <>
      <Analytics beforeSend={(e: BeforeSendEvent) => stripQuery(e)} />
      <SpeedInsights beforeSend={stripQuery} />
    </>
  );
}
