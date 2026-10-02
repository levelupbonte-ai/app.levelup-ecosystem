"use client";

import { useState } from "react";

import Link from "next/link";

import { ArrowLeft, RotateCcw } from "lucide-react";

import { Preloader } from "@/components/preloader";
import { Button } from "@/components/ui/button";

export default function LoadingPage() {
  const [playKey, setPlayKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleReplay = () => {
    setIsPlaying(false);
    setTimeout(() => {
      setPlayKey((k) => k + 1);
      setIsPlaying(true);
    }, 50);
  };

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center select-none">
      {/* Standalone cinematic preloader instance */}
      {isPlaying && (
        <Preloader
          key={playKey}
          forcePlay={true}
          onComplete={() => setIsPlaying(false)}
        />
      )}

      {/* Behind-the-scenes showcase dashboard once curtain lifts */}
      <div className="max-w-md w-full mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border border-border bg-muted/60 text-muted-foreground">
            Stage Preview • Loading Component
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            LevelUp Preloader
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Dedicated site preloader showcase. The animation triggers automatically on fresh visits, periodically, or on demand.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={handleReplay}
            className="w-full sm:w-auto font-semibold flex items-center gap-2"
          >
            <RotateCcw className="size-4" />
            Replay animation
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto font-medium flex items-center gap-2"
          >
            <Link href="/">
              <ArrowLeft className="size-4" />
              Back to site
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
