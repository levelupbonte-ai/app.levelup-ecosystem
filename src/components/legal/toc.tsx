"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type TocItem = { id: string; text: string };

/** Table of contents with scroll-spy. Sticky column on desktop. */
export function LegalToc({ items, label }: { items: TocItem[]; label: string }) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const els = items
      .map((i) => document.getElementById(i.id))
      .filter((e): e is HTMLElement => !!e);
    if (!els.length || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -65% 0px", threshold: 0 }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label={label}>
      <ol className="space-y-0.5 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "location" : undefined}
              className={cn(
                "block rounded-md border-l-2 py-1.5 pr-2 pl-3 leading-snug transition-colors",
                active === item.id
                  ? "border-brand text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground border-transparent"
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
