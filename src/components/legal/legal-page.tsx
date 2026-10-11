import { Background } from "@/components/background";
import { CookieActions } from "@/components/cookie-actions";
import { LegalDocView } from "@/components/legal/doc-view";
import { Localized } from "@/components/legal/localized";
import { getLegalDoc } from "@/lib/legal";
import { LEGAL_DOC_BY_SLUG, type LegalSlug } from "@/lib/legal-docs";
import type { Metadata } from "next";

export function legalMetadata(slug: LegalSlug): Metadata {
  const d = LEGAL_DOC_BY_SLUG[slug];
  return {
    title: d.label.en,
    description: d.description.en,
    alternates: { canonical: d.path },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${d.label.en} | LevelUp Ecosystem`,
      description: d.description.en,
      url: d.path,
      siteName: "LevelUp Ecosystem",
      type: "article"
    }
  };
}

/** A legal document page: English and French are rendered at build time. */
export function LegalPage({ slug }: { slug: LegalSlug }) {
  const en = getLegalDoc(slug, "en");
  const fr = getLegalDoc(slug, "fr");
  const extra = slug === "cookies" ? <CookieActions /> : null;
  return (
    <Background>
      <Localized
        en={
          <LegalDocView doc={en} locale="en" slug={slug}>
            {extra}
          </LegalDocView>
        }
        fr={
          <LegalDocView doc={fr} locale="fr" slug={slug}>
            {extra}
          </LegalDocView>
        }
      />
    </Background>
  );
}
