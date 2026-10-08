/**
 * Responsive, production-grade HTML email templates for LevelUp Ecosystem
 * Features:
 * - English copy across all templates
 * - Team signature: "The LevelUp Ecosystem Team"
 * - Faceted star logo at top header
 * - LevelUp Ecosystem wordmark branding in footer
 * - Simulation templates link directly to the consultation/order form (no studio link)
 */

/** Escapes text for HTML element and attribute contexts. Every value from a
 *  visitor goes through this before it is placed in an email. */
export function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );
}

interface WeddingSimulationEmailProps {
  name: string;
  inviteCode: string;
  telephone?: string;
}

export function getWeddingSimulationEmailHtml({
  name,
  inviteCode,
  telephone,
}: WeddingSimulationEmailProps): string {
  name = escapeHtml(name) as typeof name;
  inviteCode = escapeHtml(inviteCode) as typeof inviteCode;
  telephone = escapeHtml(telephone) as typeof telephone;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RSVP Confirmation — Le Dernier Retrouvailles</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0908;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#f3ede2;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#0a0908;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:580px;background-color:#13110e;border:1px solid #2a241c;border-radius:16px;overflow:hidden;box-shadow:0 12px 32px rgba(0,0,0,0.6);" cellspacing="0" cellpadding="0" border="0">
          
          <!-- BRAND HEADER WITH STAR LOGO -->
          <tr>
            <td align="center" style="padding:32px 24px 20px;border-bottom:1px solid #231f18;background:linear-gradient(180deg,#1c1813 0%,#13110e 100%);">
              <img src="https://levelup-ecosystem.com/icon.svg" width="48" height="48" alt="LevelUp Star" style="display:block;margin:0 auto 12px;border:0;">
              <span style="display:inline-block;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#d4af37;">
                Bespoke Digital Experience
              </span>
            </td>
          </tr>

          <!-- HERO CONTENT -->
          <tr>
            <td style="padding:32px 28px 24px;">
              <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;font-weight:800;color:#faf6ef;letter-spacing:-0.5px;">
                RSVP Confirmed: Le Dernier Retrouvailles
              </h1>
              <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#c0b7a8;">
                Hello <strong>${name}</strong>, thank you for confirming your attendance. Your guest pass details have been recorded successfully.
              </p>

              <!-- INVITATION BADGE TICKET -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#1b1712;border:1px solid #3d3323;border-radius:12px;margin:20px 0 24px;">
                <tr>
                  <td style="padding:20px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding-bottom:12px;">
                          <span style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#a09584;display:block;">Invitation Code</span>
                          <span style="font-size:18px;font-weight:700;color:#e8c15a;letter-spacing:1px;font-family:monospace;">${inviteCode}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:8px;">
                          <span style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#a09584;display:block;">Event &amp; Venue</span>
                          <span style="font-size:14px;color:#faf6ef;font-weight:600;">The Rose Estate • San Diego, CA</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:8px;">
                          <span style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#a09584;display:block;">Date &amp; Schedule</span>
                          <span style="font-size:13px;color:#e1dacd;">Saturday, October 24, 2026 • 4:00 PM prompt</span>
                        </td>
                      </tr>
                      ${
                        telephone
                          ? `<tr>
                        <td>
                          <span style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#a09584;display:block;">Registered Phone</span>
                          <span style="font-size:13px;color:#e1dacd;">${telephone}</span>
                        </td>
                      </tr>`
                          : ""
                      }
                    </table>
                  </td>
                </tr>
              </table>

              <!-- DEMO SIMULATION NOTICE -->
              <div style="background-color:#17140f;border-left:3px solid #d4af37;padding:14px 16px;border-radius:6px;margin-bottom:28px;">
                <p style="margin:0;font-size:12.5px;line-height:1.55;color:#b6aba0;">
                  <strong style="color:#faf6ef;">Interactive Simulation Notice:</strong> This email confirms a test RSVP from our luxury digital invitation demonstration.
                </p>
              </div>

              <!-- CALL TO ACTION (Links to Order / Contact Form, NOT the studio) -->
              <div style="text-align:center;margin:28px 0 16px;">
                <a href="https://levelup-ecosystem.com/contact?service=wedding" style="display:inline-block;background:linear-gradient(135deg,#e8c15a 0%,#d4af37 60%,#b08d24 100%);color:#120e06;font-size:14px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:8px;box-shadow:0 4px 14px rgba(212,175,82,0.3);letter-spacing:0.3px;">
                  Order a Custom Event Website &rarr;
                </a>
              </div>

              <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#8d8376;text-align:center;">
                Have questions about custom event portals or real-time RSVP systems?<br>
                Reply directly to this email or reach us at <a href="mailto:studio@levelup-ecosystem.com" style="color:#d4af37;text-decoration:none;">studio@levelup-ecosystem.com</a>.
              </p>
            </td>
          </tr>

          <!-- BRAND FOOTER -->
          <tr>
            <td style="padding:24px;background-color:#0d0b09;border-top:1px solid #1f1b15;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#c0b7a8;letter-spacing:0.5px;">
                LEVELUP ECOSYSTEM
              </p>
              <p style="margin:0;font-size:11px;color:#6d6458;line-height:1.5;">
                Full-Stack Web Engineering, Online Booking Platforms &amp; Security Audits<br>
                Headquartered in San Diego, CA • Serving Clients Worldwide
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

interface PreviewRequestEmailProps {
  name: string;
  company?: string;
  isWaitlisted: boolean;
  queuePosition?: number;
  message?: string;
}

export function getPreviewRequestEmailHtml({
  name,
  company,
  isWaitlisted,
}: PreviewRequestEmailProps): string {
  name = escapeHtml(name) as typeof name;
  company = escapeHtml(company) as typeof company;
  const statusHeadline = isWaitlisted
    ? `Priority Waitlist: Your Website Preview Request`
    : `We Received Your Preview Request`;

  const statusParagraph = isWaitlisted
    ? `Due to high demand for our custom engineering slots, all immediate build tracks are currently active. <strong>Your project has been placed on our priority waitlist.</strong> Due to our current build volume, waitlist review typically takes 3 to 5 business days. Our team will review your requirements as soon as a development slot opens.`
    : `Our team has received your submission and is reviewing your project details. We will build and share a <strong>functional interactive mobile prototype within 24 to 48 hours</strong> with zero financial commitment.`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${statusHeadline}</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0908;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#f3ede2;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#0a0908;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:580px;background-color:#13110e;border:1px solid #2a241c;border-radius:16px;overflow:hidden;box-shadow:0 12px 32px rgba(0,0,0,0.6);" cellspacing="0" cellpadding="0" border="0">
          
          <!-- BRAND HEADER WITH STAR LOGO -->
          <tr>
            <td align="center" style="padding:32px 24px 20px;border-bottom:1px solid #231f18;background:linear-gradient(180deg,#1c1813 0%,#13110e 100%);">
              <img src="https://levelup-ecosystem.com/icon.svg" width="48" height="48" alt="LevelUp Star" style="display:block;margin:0 auto 12px;border:0;">
              <span style="display:inline-block;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#a78bfa;">
                LevelUp Ecosystem
              </span>
            </td>
          </tr>

          <!-- MAIN BODY -->
          <tr>
            <td style="padding:32px 28px 24px;">
              <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;font-weight:800;color:#faf6ef;letter-spacing:-0.5px;">
                ${statusHeadline}
              </h1>
              <p style="margin:0 0 16px;font-size:14.5px;line-height:1.65;color:#c0b7a8;">
                Hello <strong>${name}</strong>,
              </p>
              <p style="margin:0 0 20px;font-size:14.5px;line-height:1.65;color:#c0b7a8;">
                Thank you for reaching out to LevelUp Ecosystem. ${statusParagraph}
              </p>

              <!-- QUEUE STATUS OR TIMELINE BOX -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#181512;border:1px solid ${
                isWaitlisted ? "#d97706" : "#383127"
              };border-radius:12px;margin:22px 0 24px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td>
                          <span style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#a09584;display:block;">
                            ${isWaitlisted ? "Status & Turnaround" : "Estimated Turnaround"}
                          </span>
                          <span style="font-size:16px;font-weight:700;color:${
                            isWaitlisted ? "#fbbf24" : "#faf6ef"
                          };">
                            ${isWaitlisted ? "Priority Waitlist (Estimated 3 to 5 business days)" : "24 to 48 Business Hours"}
                          </span>
                        </td>
                      </tr>
                      ${
                        company
                          ? `<tr>
                        <td style="padding-top:12px;">
                          <span style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#a09584;display:block;">Client / Business</span>
                          <span style="font-size:13px;color:#e1dacd;">${company}</span>
                        </td>
                      </tr>`
                          : ""
                      }
                      <!-- The visitor's message is never echoed back: this email can reach any address typed in the form. -->
                    </table>
                  </td>
                </tr>
              </table>

              <!-- WHAT HAPPENS NEXT -->
              <h2 style="margin:24px 0 10px;font-size:16px;font-weight:700;color:#faf6ef;">
                What to expect next:
              </h2>
              <ol style="margin:0 0 28px;padding-left:20px;font-size:13.5px;line-height:1.7;color:#b6aba0;">
                <li>Our team verifies your current domain, branding, and booking requirements.</li>
                <li>We architect a fast mobile-first prototype with 24/7 calendar integration.</li>
                <li>We send you an interactive private link you can test directly on your smartphone.</li>
              </ol>

              <!-- BUTTON -->
              <div style="text-align:center;margin:28px 0 16px;">
                <a href="https://levelup-ecosystem.com/projects" style="display:inline-block;background:#7c3aed;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:8px;box-shadow:0 4px 14px rgba(124,58,237,0.35);letter-spacing:0.3px;">
                  Explore Our Work &amp; Case Studies &rarr;
                </a>
              </div>

              <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#8d8376;text-align:center;">
                Need to add urgent details or share brand assets?<br>
                Reply directly to this email or write to <a href="mailto:contact@levelup-ecosystem.com" style="color:#a78bfa;text-decoration:none;">contact@levelup-ecosystem.com</a>.
              </p>

              <p style="margin:20px 0 0;font-size:13px;color:#c0b7a8;text-align:center;font-weight:600;">
                — The LevelUp Ecosystem Team
              </p>
            </td>
          </tr>

          <!-- BRAND FOOTER -->
          <tr>
            <td style="padding:24px;background-color:#0d0b09;border-top:1px solid #1f1b15;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#c0b7a8;letter-spacing:0.5px;">
                LEVELUP ECOSYSTEM
              </p>
              <p style="margin:0;font-size:11px;color:#6d6458;line-height:1.5;">
                Full-Stack Web Development, Booking Engines &amp; Cybersecurity Audits<br>
                San Diego, California • Serving Clients Worldwide
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

interface InternalLeadAlertProps {
  name: string;
  email: string;
  company?: string;
  employees?: string;
  message?: string;
  isWaitlisted: boolean;
  queuePosition?: number;
}

export function getInternalLeadAlertHtml({
  name,
  email,
  company,
  employees,
  message,
  isWaitlisted,
  queuePosition,
}: InternalLeadAlertProps): string {
  name = escapeHtml(name) as typeof name;
  email = escapeHtml(email) as typeof email;
  company = escapeHtml(company) as typeof company;
  employees = escapeHtml(employees) as typeof employees;
  message = escapeHtml(message) as typeof message;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Lead: ${name}</title>
</head>
<body style="font-family:sans-serif;background:#0f0f0f;color:#e5e5e5;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#1a1a1a;border:1px solid #333;border-radius:10px;padding:24px;">
    <h2 style="margin:0 0 16px;color:#a78bfa;font-size:20px;">
      🔔 New Preview Request Received
    </h2>
    <p style="margin:0 0 12px;font-size:14px;"><strong>Status:</strong> ${
      isWaitlisted
        ? `<span style="color:#f59e0b;font-weight:bold;">Waitlisted (#${queuePosition})</span>`
        : `<span style="color:#10b981;font-weight:bold;">Immediate Slot Assigned</span>`
    }</p>
    <p style="margin:0 0 8px;font-size:14px;"><strong>Name:</strong> ${name}</p>
    <p style="margin:0 0 8px;font-size:14px;"><strong>Email:</strong> <a href="mailto:${email}" style="color:#a78bfa;">${email}</a></p>
    ${company ? `<p style="margin:0 0 8px;font-size:14px;"><strong>Company:</strong> ${company}</p>` : ""}
    ${employees ? `<p style="margin:0 0 8px;font-size:14px;"><strong>Employees:</strong> ${employees}</p>` : ""}
    <div style="margin:16px 0;padding:12px;background:#111;border-radius:6px;font-size:13px;line-height:1.5;color:#ccc;white-space:pre-wrap;">
      ${message || "No message entered"}
    </div>
    <p style="font-size:11px;color:#888;margin:20px 0 0;">
      LevelUp Ecosystem Internal Lead Dispatch • teams@levelup-ecosystem.com
    </p>
  </div>
</body>
</html>`;
}
