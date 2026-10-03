import Link from "next/link";
import { Compass, Home, MessageSquare } from "lucide-react";
import { Background } from "@/components/background";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Background className="min-h-screen">
      <div className="container relative z-10 flex min-h-[85vh] flex-col items-center justify-center py-20 lg:py-28 text-center">
        {/* Subtle ambient radial glow behind central hero */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] sm:size-[650px] rounded-full bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.12)_0%,transparent_70%)] blur-2xl -z-10"
          aria-hidden="true"
        />

        {/* Monumental Ethereal 404 Display */}
        <div className="relative select-none my-2">
          <span
            className="text-[110px] sm:text-[160px] md:text-[210px] font-black tracking-tighter leading-none block font-display bg-gradient-to-b from-foreground via-foreground/60 to-foreground/10 bg-clip-text text-transparent opacity-95 select-none"
            style={{
              letterSpacing: "-0.05em",
              fontFamily: "var(--font-sans), 'DM Sans', sans-serif",
            }}
          >
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="size-20 sm:size-28 rounded-full bg-purple-500/10 dark:bg-purple-500/20 blur-xl" />
          </div>
        </div>

        {/* Narrative Headline & Copy */}
        <div className="max-w-xl mx-auto space-y-3 mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            You&apos;ve reached an uncharted coordinate.
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            The page you&apos;re trying to reach may have been upgraded, relocated, or does not exist in the LevelUp Ecosystem yet.
          </p>
        </div>

        {/* Main CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto font-semibold rounded-full px-6 flex items-center gap-2 shadow-sm"
          >
            <Link href="/">
              <Home className="size-4" />
              Return to Homepage
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto font-medium rounded-full px-6 flex items-center gap-2 border-border/80 hover:bg-foreground/[0.05]"
          >
            <Link href="/services">
              <Compass className="size-4" />
              Explore Services
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto font-medium rounded-full px-5 flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <Link href="/contact">
              <MessageSquare className="size-4" />
              Contact
            </Link>
          </Button>
        </div>
      </div>
    </Background>
  );
}
