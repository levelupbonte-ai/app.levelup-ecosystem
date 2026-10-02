"use server";

import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { actionClient } from "./safe-action";

import {
  getInternalLeadAlertHtml,
  getPreviewRequestEmailHtml,
} from "@/lib/email-templates";
import { db } from "@/lib/firebase";
import { formSchema } from "@/lib/form-schema";
import { isResendConfigured, resend } from "@/lib/resend";

export const serverAction = actionClient
  .inputSchema(formSchema)
  .action(async ({ parsedInput }) => {
    let isWaitlisted = false;
    let queuePosition = 1;

    try {
      // 1. Check pending build queue in Firestore
      const previewCol = collection(db, "preview_requests");
      const pendingQuery = query(previewCol, where("status", "==", "pending"));
      const snapshot = await getDocs(pendingQuery);

      const pendingCount = snapshot.size;
      // If there are 3 or more requests pending, place in priority queue
      isWaitlisted = pendingCount >= 3;
      queuePosition = pendingCount + 1;

      // 2. Persist new lead into Firestore
      await addDoc(previewCol, {
        name: parsedInput.name,
        email: parsedInput.email,
        company: parsedInput.company || "",
        employees: parsedInput.employees || "",
        message: parsedInput.message,
        status: "pending",
        isWaitlisted,
        queuePosition: isWaitlisted ? queuePosition : 1,
        createdAt: serverTimestamp(),
      });
    } catch (dbErr) {
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.warn("[Firestore] Failed to persist preview request:", dbErr);
      }
    }

    // 3. Automated email dispatch via Resend
    let emailDelivered = false;
    if (isResendConfigured() && resend) {
      try {
        const clientHtml = getPreviewRequestEmailHtml({
          name: parsedInput.name,
          company: parsedInput.company,
          isWaitlisted,
          queuePosition,
          message: parsedInput.message,
        });

        await resend.emails.send({
          from: "LevelUp Ecosystem <contact@levelup-ecosystem.com>",
          to: [parsedInput.email],
          subject: isWaitlisted
            ? `Priority Queue (#${queuePosition}): Your Website Preview Request`
            : "We Received Your Free Mobile Preview Request — LevelUp Ecosystem",
          html: clientHtml,
        });
        emailDelivered = true;

        // Internal team notification sent to teams@levelup-ecosystem.com (auto-forwarded to Gmail)
        const teamHtml = getInternalLeadAlertHtml({
          name: parsedInput.name,
          email: parsedInput.email,
          company: parsedInput.company,
          employees: parsedInput.employees,
          message: parsedInput.message,
          isWaitlisted,
          queuePosition,
        });

        await resend.emails.send({
          from: "LevelUp System <system@levelup-ecosystem.com>",
          to: ["teams@levelup-ecosystem.com"],
          subject: `[New Lead] ${parsedInput.name}${parsedInput.company ? ` (${parsedInput.company})` : ""}${isWaitlisted ? ` [Queue #${queuePosition}]` : ""}`,
          html: teamHtml,
        });
      } catch (emailErr) {
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.warn("[Resend] Failed to send preview email:", emailErr);
        }
      }
    }

    return {
      success: true,
      isWaitlisted,
      queuePosition,
      emailDelivered,
      message: isWaitlisted
        ? `High demand: All 3 immediate build slots are currently filled. You are placed in priority queue (#${queuePosition}). Our team will review your project as soon as the next slot opens.`
        : "Thank you! Our team has received your request and will prepare your free interactive mobile preview within 24 to 48 hours.",
    };
  });

