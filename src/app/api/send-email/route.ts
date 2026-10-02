import { NextRequest, NextResponse } from "next/server";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import {
  getInternalLeadAlertHtml,
  getPreviewRequestEmailHtml,
  getWeddingSimulationEmailHtml,
} from "@/lib/email-templates";
import { db } from "@/lib/firebase";
import { isResendConfigured, resend } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type } = body;

    // 1. Simulation RSVP for Wedding Demo
    if (type === "wedding_rsvp") {
      const { nom, email, inviteCode, telephone } = body;

      if (!email) {
        return NextResponse.json({ error: "Missing email address" }, { status: 400 });
      }

      const emailHtml = getWeddingSimulationEmailHtml({
        name: nom || "Valued Guest",
        inviteCode: inviteCode || "WEDDING-SAMPLE",
        telephone,
      });

      let resendResponse = null;
      let sendSuccess = false;

      if (isResendConfigured() && resend) {
        try {
          resendResponse = await resend.emails.send({
            from: "LevelStudio <studio@levelup-ecosystem.com>",
            to: [email],
            subject: "RSVP Confirmation — Le Dernier Retrouvailles (Simulation Demo)",
            html: emailHtml,
          });
          sendSuccess = true;
        } catch (resendErr) {
          if (process.env.NODE_ENV === "development") {
            // eslint-disable-next-line no-console
            console.warn("[Resend] Failed to send wedding simulation email:", resendErr);
          }
        }
      }

      // Log dispatch to Firestore
      try {
        await addDoc(collection(db, "email_logs"), {
          type: "wedding_rsvp",
          to: email,
          from: "studio@levelup-ecosystem.com",
          inviteCode: inviteCode || "",
          delivered: sendSuccess,
          resendId: resendResponse?.data?.id || null,
          createdAt: serverTimestamp(),
        });
      } catch (logErr) {
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.warn("[Firestore] Failed to log email record:", logErr);
        }
      }

      return NextResponse.json({
        success: true,
        delivered: sendSuccess,
        type: "wedding_rsvp",
      });
    }

    // 2. Booking / Preview Request Auto-responder & Internal Alert
    if (type === "preview_request") {
      const { name, email, company, employees, message, isWaitlisted, queuePosition } = body;

      if (!email) {
        return NextResponse.json({ error: "Missing email address" }, { status: 400 });
      }

      const clientEmailHtml = getPreviewRequestEmailHtml({
        name: name || "Friend",
        company,
        isWaitlisted: Boolean(isWaitlisted),
        queuePosition: queuePosition || 1,
        message,
      });

      const internalAlertHtml = getInternalLeadAlertHtml({
        name: name || "Anonymous",
        email,
        company,
        employees,
        message,
        isWaitlisted: Boolean(isWaitlisted),
        queuePosition,
      });

      let clientDelivered = false;
      let teamAlertDelivered = false;

      if (isResendConfigured() && resend) {
        try {
          // Send confirmation to prospect
          await resend.emails.send({
            from: "LevelUp Ecosystem <contact@levelup-ecosystem.com>",
            to: [email],
            subject: isWaitlisted
              ? `Priority Queue (#${queuePosition}): Your Website Preview Request`
              : "We Received Your Free Mobile Preview Request — LevelUp Ecosystem",
            html: clientEmailHtml,
          });
          clientDelivered = true;

          // Send internal notification to teams@levelup-ecosystem.com (auto-forwarded by Cloudflare)
          await resend.emails.send({
            from: "LevelUp System <system@levelup-ecosystem.com>",
            to: ["teams@levelup-ecosystem.com"],
            subject: `[New Lead] ${name}${company ? ` (${company})` : ""}${isWaitlisted ? ` [Queue #${queuePosition}]` : ""}`,
            html: internalAlertHtml,
          });
          teamAlertDelivered = true;
        } catch (resendErr) {
          if (process.env.NODE_ENV === "development") {
            // eslint-disable-next-line no-console
            console.warn("[Resend] Preview request dispatch failed:", resendErr);
          }
        }
      }

      // Log dispatch in Firestore
      try {
        await addDoc(collection(db, "email_logs"), {
          type: "preview_request",
          to: email,
          from: "contact@levelup-ecosystem.com",
          isWaitlisted: Boolean(isWaitlisted),
          queuePosition: queuePosition || 1,
          delivered: clientDelivered,
          teamAlertDelivered,
          createdAt: serverTimestamp(),
        });
      } catch (logErr) {
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.warn("[Firestore] Failed to log preview request email:", logErr);
        }
      }

      return NextResponse.json({
        success: true,
        delivered: clientDelivered,
        teamAlertDelivered,
        isWaitlisted,
        queuePosition,
      });
    }

    return NextResponse.json({ error: "Unknown email type requested" }, { status: 400 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
