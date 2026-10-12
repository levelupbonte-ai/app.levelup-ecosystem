/**
 * Keeps site copy that comes from the shared content database consistent with
 * the published Terms (/terms, /services-agreement).
 *
 * The Terms use a license model: the client owns their content, brand and data;
 * LevelUp keeps the code and hosts and maintains the site on a care plan. Older
 * rows written by dashboard editors may still carry the former wording
 * ("100% code ownership", "no monthly fee", "sub-2s"). Those exact phrases are
 * rewritten here so they never reach visitors. Update the rows in the dashboard
 * to make this a no-op.
 */
const RULES: [RegExp, string][] = [
  [/100% full ownership with zero monthly fees/gi, "your content, brand and data stay yours, with hosting and maintenance on a care plan"],
  [/100% full (?:website and )?(?:source )?code ownership/gi, "Your content, brand and customer data stay yours (exportable)"],
  [/100% (?:website )?code ownership/gi, "Your content, brand & data stay yours"],
  [/\bno monthly fee\b/gi, "Hosted on a care plan"],
  [/^Optional Care$/g, "Care plan required"],
  [/\((?:Care|care) optional\)/g, "(with a care plan)"],
  [/ ?\(sub-2s loading speed target\)/gi, " for fast loading"],
  [/sub-2(?:s|-second)\s*/gi, ""],
  [/\(no generic templates\)/gi, "(never a generic template)"],
  [/Custom database architecture \(Cloud SQL, Firestore, Redis\)/g, "Custom database architecture"],
  [/the \$49\/month Care Plan/g, "a Care Plan"],
  [/Monthly care plan \(\$49\/mo\)\./g, "Monthly care plans."],
  [/50\+ professional templates/g, "Professional templates"],
  [/Cancel anytime with zero penalty/g, "Cancel with 30 days' notice"],
  [/Cancel anytime with zero long-term contract/g, "No long-term contract: cancel with 30 days' notice"]
];

const OWNERSHIP_ANSWER =
  "You own your domain, brand, text, photos and customer data, and you can export them on request. LevelUp builds, hosts and maintains the site on its platform under a license: we keep the code, templates and components (and may reuse them for other clients, never your content or branding), and the site stays online while your care plan is active. We never hold your domain or your data hostage. If you want the project-specific code, a code buy-out is available under a separate written agreement.";

export function neutralizeClaims(text: string): string {
  if (!text) return text;
  if (/^Yes, 100%\. (?:Once final payment|Unlike proprietary)/.test(text)) {
    return OWNERSHIP_ANSWER;
  }
  if (/^3\. Zero Monthly Builder Traps/.test(text)) {
    return "3. Your Content, Your Brand, Your Data: Your domain, text, photos, logos and customer data always belong to you and stay exportable. We design, host and maintain your site on our platform under a clear license, with lightweight, clean code and plain-language terms, so you are never held hostage over your content.";
  }
  let out = text;
  for (const [re, to] of RULES) out = out.replace(re, to);
  return out;
}
