import { LegalPage, legalMetadata } from "@/components/legal/legal-page";

export const metadata = legalMetadata("services-agreement");

export default function Page() {
  return <LegalPage slug="services-agreement" />;
}
