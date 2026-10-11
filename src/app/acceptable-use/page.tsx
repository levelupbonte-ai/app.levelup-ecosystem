import { LegalPage, legalMetadata } from "@/components/legal/legal-page";

export const metadata = legalMetadata("acceptable-use");

export default function Page() {
  return <LegalPage slug="acceptable-use" />;
}
