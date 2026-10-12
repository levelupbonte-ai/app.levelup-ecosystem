import { LegalPage, legalMetadata } from "@/components/legal/legal-page";

export const metadata = legalMetadata("dpa");

export default function Page() {
  return <LegalPage slug="dpa" />;
}
