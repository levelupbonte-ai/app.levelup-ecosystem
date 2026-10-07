"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { Loader2, AlertCircle } from "lucide-react";

import { supabase, isSupabaseConfigured } from "@/lib/supabase-client";
import { Background } from "@/components/background";
import { Logo } from "@/components/logo";
import { LevelUpTransitionOverlay } from "@/components/transition-overlay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

// Only same-site paths or LevelUp Ecosystem hosts are allowed as post-login targets.
function safeRedirect(target: string | null): string {
  if (!target) return "/dashboard/overview";
  if (target.startsWith("/") && !target.startsWith("//")) return target;
  try {
    const url = new URL(target);
    if (url.protocol === "https:" && (url.hostname === "levelup-ecosystem.com" || url.hostname.endsWith(".levelup-ecosystem.com"))) {
      return url.toString();
    }
  } catch {
    // ignore malformed URLs
  }
  return "/dashboard/overview";
}

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [targetUrl, setTargetUrl] = useState("/dashboard/overview");
  const [error, setError] = useState<string | null>(null);

  const getTargetUrl = () => {
    if (typeof window === "undefined") return "/dashboard/overview";
    const params = new URLSearchParams(window.location.search);
    return safeRedirect(params.get("redirect_url"));
  };

  const handleRedirect = (session?: { access_token?: string; user?: { id: string; email?: string } }) => {
    try {
      // The Supabase client keeps the session itself; access tokens are never
      // copied into web storage readable by other scripts.
      setTargetUrl(getTargetUrl());
    } catch {
      setTargetUrl("/dashboard/overview");
    }
    setIsRedirecting(true);
  };

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleRedirect({ access_token: session.access_token, user: session.user });
      }
    });
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setError(null);
    setLoading(true);

    try {
      if (!isSupabaseConfigured) {
        handleRedirect();
        return;
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message || "Invalid credentials. Please try again.");
        setLoading(false);
        return;
      }

      handleRedirect(data.session ? { access_token: data.session.access_token, user: data.session.user } : undefined);
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      if (!isSupabaseConfigured) {
        handleRedirect();
        return;
      }

      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? window.location.href : undefined,
        },
      });

      if (authError) {
        setError(authError.message || "Could not complete Google sign-in.");
        setGoogleLoading(false);
      }
    } catch {
      setError("An unexpected error occurred.");
      setGoogleLoading(false);
    }
  };

  return (
    <Background>
      <LevelUpTransitionOverlay
        isActive={isRedirecting}
        title="Opening Workspace"
        subtitle="Redirecting to dashboard..."
        steps={["Verifying credentials...", "Opening LevelStudio...", "Loading dashboard..."]}
        targetUrl={targetUrl}
        onComplete={() => {
          window.location.href = targetUrl;
        }}
      />
      <section className="py-24 lg:pt-36 lg:pb-24">
        <div className="container">
          <div className="flex flex-col gap-4">
            <Card className="mx-auto w-full max-w-sm rounded-2xl border border-border/80 shadow-xl bg-card">
              <CardHeader className="flex flex-col items-center gap-2 text-center pb-2">
                <Link href="/" className="mb-2">
                  <Logo className="h-6 w-auto" />
                </Link>
                <h1 className="text-xl font-bold tracking-tight">Sign In to Client Workspace</h1>
                <p className="text-muted-foreground text-xs">
                  Access your active builds, booking calendar, and security reports.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 p-3 text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <AlertCircle className="size-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label htmlFor="signin-email" className="text-xs font-semibold text-foreground">Email</label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="client@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="rounded-lg"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="signin-password" className="text-xs font-semibold text-foreground">Password</label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="rounded-lg"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember-me" defaultChecked />
                      <label htmlFor="remember-me" className="text-muted-foreground cursor-pointer">
                        Remember me
                      </label>
                    </div>
                  </div>

                  <Button type="submit" className="w-full font-semibold rounded-lg" disabled={loading || googleLoading}>
                    {loading ? <Loader2 className="size-4 animate-spin" /> : "Sign In"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-lg"
                    onClick={handleGoogleLogin}
                    disabled={loading || googleLoading}
                  >
                    <FcGoogle className="mr-2 size-5" /> Sign in with Google
                  </Button>

                  <div className="relative my-2 text-center text-xs after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-card px-2 text-muted-foreground font-mono">
                      or preview client dashboard
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full font-semibold rounded-lg"
                    onClick={() => handleRedirect()}
                  >
                    Explore Dashboard as Demo Client
                  </Button>
                </form>

                <div className="text-muted-foreground mx-auto mt-6 flex justify-center gap-1 text-xs">
                  <p>Don&apos;t have an account?</p>
                  <Link href="/start-project" className="text-foreground font-semibold hover:underline">
                    Start a project
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Background>
  );
}
