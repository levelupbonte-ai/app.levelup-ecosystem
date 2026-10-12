"use client";

import { useRef } from "react";

import { useKeyboardViewport } from "@/lib/use-keyboard-viewport";

/**
 * Full-screen Project Studio. The shell follows the visible viewport, so the
 * studio's answer bar stays docked right above the on-screen keyboard and its
 * header stays pinned (see useKeyboardViewport).
 */
export function StudioFrame({ src }: { src: string }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  useKeyboardViewport(shellRef, frameRef);

  return (
    <div
      ref={shellRef}
      className="fixed inset-x-0 top-0 z-[200] h-dvh w-screen overflow-hidden bg-[#f7f6fb] select-none [@media(prefers-color-scheme:dark)]:bg-[#07070b]"
    >
      <iframe
        ref={frameRef}
        src={src}
        title="LevelUp Project Studio"
        className="block h-full w-full border-0 bg-transparent"
        allow="clipboard-write"
      />
    </div>
  );
}
