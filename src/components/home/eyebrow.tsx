import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Monospace section label with a short rule: "—— Capabilities". */
export function Eyebrow({
  children,
  className,
  tone = "default",
  center = false,
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "inverted";
  center?: boolean;
}) {
  const rule = cn(
    "h-px w-8 shrink-0",
    tone === "inverted" ? "bg-ink-foreground/35" : "bg-foreground/30",
  );
  return (
    <span
      className={cn(
        "font-label inline-flex items-center gap-3 text-[13px] tracking-tight",
        tone === "inverted"
          ? "text-ink-foreground/60"
          : "text-muted-foreground",
        className,
      )}
    >
      <span aria-hidden="true" className={rule} />
      {children}
      {center ? <span aria-hidden="true" className={rule} /> : null}
    </span>
  );
}
