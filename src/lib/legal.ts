import "server-only";

import fs from "node:fs";
import path from "node:path";

import { Marked, type Renderer, type Token, type Tokens } from "marked";

import type { Locale } from "@/lib/locale";
import type { LegalSlug } from "@/lib/legal-docs";

export type LegalDoc = {
  title: string;
  /** "Translation: the English version prevails" notice (French only). */
  notice: string | null;
  /** The "short version" box: an HTML list. */
  summaryTitle: string;
  summary: string | null;
  body: string;
  toc: { id: string; text: string }[];
};

const DIR = path.join(process.cwd(), "src", "content", "legal");
const cache = new Map<string, LegalDoc>();

const stripTags = (s: string) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Section anchors are the same in both languages: #section-3. */
function headingId(text: string) {
  const n = text.match(/^(\d{1,2})\./);
  return n ? `section-${n[1]}` : slugify(text);
}

export function getLegalDoc(slug: LegalSlug, locale: Locale): LegalDoc {
  const key = `${slug}.${locale}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const source = fs.readFileSync(path.join(DIR, `${key}.md`), "utf8");
  const toc: LegalDoc["toc"] = [];
  const tableLabel = locale === "fr" ? "Tableau" : "Table";
  let tableCount = 0;

  const marked = new Marked({
    gfm: true,
    breaks: true,
    renderer: {
      heading(this: Renderer, { tokens, depth }: Tokens.Heading) {
        const inner = this.parser.parseInline(tokens) as string;
        const text = stripTags(inner);
        const id = headingId(text);
        if (depth === 2) toc.push({ id, text });
        return `<h${depth} id="${id}"><a href="#${id}">${inner}</a></h${depth}>\n`;
      },
      paragraph(this: Renderer, { tokens }: Tokens.Paragraph) {
        const html = (this.parser.parseInline(tokens) as string).replace(
          /(^|<br>\s*)(\d{1,2}\.\d{1,2})(?=\s)/g,
          '$1<span class="lu-clause">$2</span>'
        );
        // Consecutive numbered clauses written on adjacent lines: one paragraph each.
        return html
          .split(/<br>\s*(?=<span class="lu-clause">)/)
          .map((p) => `<p>${p}</p>\n`)
          .join("");
      },
      table(this: Renderer, token: Tokens.Table) {
        const head = token.header
          .map(
            (c, i) =>
              `<th scope="col"${token.align[i] ? ` style="text-align:${token.align[i]}"` : ""}>${this.parser.parseInline(c.tokens)}</th>`
          )
          .join("");
        const rows = token.rows
          .map(
            (r) =>
              `<tr>${r
                .map(
                  (c, i) =>
                    `<td${token.align[i] ? ` style="text-align:${token.align[i]}"` : ""}>${this.parser.parseInline(c.tokens)}</td>`
                )
                .join("")}</tr>`
          )
          .join("");
        return `<div class="lu-table" role="region" aria-label="${tableLabel} ${++tableCount}" tabindex="0"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>\n`;
      },
      link(this: Renderer, { href, title, tokens }: Tokens.Link) {
        const inner = this.parser.parseInline(tokens) as string;
        const external = /^https?:\/\//.test(href);
        const t = title ? ` title="${title}"` : "";
        return `<a href="${href}"${t}${external ? ' rel="noopener noreferrer"' : ""}>${inner}</a>`;
      }
    }
  });

  const tokens = marked.lexer(source);
  let title = "";
  let notice: string | null = null;
  let summary: string | null = null;
  let summaryTitle = "";
  const body: Token[] = [];
  let inBody = false;

  for (const t of tokens) {
    if (inBody) {
      body.push(t);
      continue;
    }
    if (t.type === "heading" && t.depth === 1) {
      title = stripTags(marked.parser([t]).replace(/<h1[^>]*>|<\/h1>/g, ""));
    } else if (t.type === "heading" && t.depth === 2) {
      inBody = true;
      body.push(t);
    } else if (t.type === "blockquote") {
      const inner = (t as Tokens.Blockquote).tokens ?? [];
      const first = inner[0];
      if (first && first.type === "heading") {
        summaryTitle = stripTags((first as Tokens.Heading).text);
        summary = marked.parser(inner.slice(1) as Tokens.Generic[] as never);
      } else {
        notice = marked.parser(inner as never);
      }
    }
  }

  const html = marked.parser(body as never);
  const doc: LegalDoc = {
    title,
    notice,
    summaryTitle,
    summary,
    body: html,
    toc
  };
  cache.set(key, doc);
  return doc;
}
