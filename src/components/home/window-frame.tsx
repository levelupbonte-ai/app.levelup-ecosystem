import type { ReactNode } from "react";

/** The dark product window (traffic lights, URL, "Live" footer) of "How it works". */
export function WindowFrame({
  label,
  status,
  children,
}: {
  label: ReactNode;
  status: string;
  children: ReactNode;
}) {
  return (
    <div className="border-ink-foreground/12 bg-ink overflow-hidden border">
      <div className="border-ink-foreground/12 flex items-center justify-between gap-4 border-b px-5 py-3.5">
        <div className="flex gap-2" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="bg-ink-foreground/20 size-2.5 rounded-full"
            />
          ))}
        </div>
        <span className="font-label text-ink-foreground/60 truncate text-xs">
          {label}
        </span>
      </div>
      <div className="relative">{children}</div>
      <div className="border-ink-foreground/12 flex items-center gap-3 border-t px-5 py-3.5">
        <span
          aria-hidden="true"
          className="bg-brand-soft lu-loop size-2 rounded-full"
          style={{ animation: "lu-pulse 2s ease-in-out infinite" }}
        />
        <span className="font-label text-ink-foreground/50 text-xs">
          {status}
        </span>
      </div>
    </div>
  );
}
