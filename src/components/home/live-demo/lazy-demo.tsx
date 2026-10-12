"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { useLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";

import { WindowFrame } from "../window-frame";

/* The demos are code-split: their chunk is requested only when the window is
   within ~900px of the viewport. Until then a frame of the same size (same
   aspect ratio as the live one, so nothing shifts) holds the place. */

const STUDIO_URL = "studio.levelup-ecosystem.com";
const DASH_URL = "dashboard.levelup-ecosystem.com";

function Slot({
  label,
  status,
  tone,
  holder,
}: {
  label: string;
  status: string;
  tone: "dark" | "light";
  holder?: React.Ref<HTMLDivElement>;
}) {
  return (
    <WindowFrame label={label} status={status}>
      <div className="ld-box">
        <div
          ref={holder}
          className={cn(
            "ld-vp",
            tone === "dark" ? "bg-[#0b0b0e]" : "bg-[#fafafa]",
          )}
        />
      </div>
    </WindowFrame>
  );
}

function StudioSlot({ holder }: { holder?: React.Ref<HTMLDivElement> }) {
  const locale = useLocale();
  return (
    <Slot
      holder={holder}
      label={STUDIO_URL}
      status={
        locale === "fr" ? "Aperçu en préparation" : "Drafting your preview"
      }
      tone="dark"
    />
  );
}

function DashboardSlot({ holder }: { holder?: React.Ref<HTMLDivElement> }) {
  const locale = useLocale();
  return (
    <Slot
      holder={holder}
      label={DASH_URL}
      status={locale === "fr" ? "En ligne" : "Live"}
      tone="light"
    />
  );
}

// While the chunk loads the same empty frame stays in place (no layout shift).
const StudioDemo = dynamic(
  () => import("./studio-demo").then((m) => m.StudioDemo),
  { ssr: false, loading: () => <StudioSlot /> },
);
const DashboardDemo = dynamic(
  () => import("./dashboard-demo").then((m) => m.DashboardDemo),
  { ssr: false, loading: () => <DashboardSlot /> },
);

function useNear<T extends Element>() {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "900px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, near] as const;
}

type Scrub = "self" | (() => number);

export function LazyStudioDemo({
  active,
  scrub,
}: {
  active?: boolean;
  scrub?: Scrub;
}) {
  const [ref, near] = useNear<HTMLDivElement>();
  if (near) return <StudioDemo active={active} scrub={scrub} />;
  return <StudioSlot holder={ref} />;
}

export function LazyDashboardDemo({
  active,
  scrub,
}: {
  active?: boolean;
  scrub?: Scrub;
}) {
  const [ref, near] = useNear<HTMLDivElement>();
  if (near) return <DashboardDemo active={active} scrub={scrub} />;
  return <DashboardSlot holder={ref} />;
}
