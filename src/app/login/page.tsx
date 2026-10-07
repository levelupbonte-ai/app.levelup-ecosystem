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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [targetStudioUrl, setTargetStudioUrl] = useState("/dashboard/overview");
  const [error, setError] = useState<string | null>(null);

  const getTargetUrl = () => {
    if (typeof window === "undefined") return "/dashboard/overview";
    const params = new URLSearchParams(window.location.search);
    return safeRedirect(params.get("redirect_url"));
  };

  const handleRedirectToStudio = (session?: { access_token?: string; user?: { id: string; email?: string } }) => {
    try {
      // The Supabase client keeps the session itself; access tokens are never
      // copied into web storage readable by other scripts.
      setTargetStudioUrl(getTargetUrl());
    } catch {
      setTargetStudioUrl("/dashboard/overview");
    }
    setIsRedirecting(true);
  };

  // Check active Supabase session on initial mount
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleRedirectToStudio({ access_token: session.access_token, user: session.user });
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
        // Dev fallback if keys aren't set yet
        handleRedirectToStudio();
        return;
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message || "Invalid email address or password. Please try again.");
        setLoading(false);
        return;
      }

      handleRedirectToStudio(data.session ? { access_token: data.session.access_token, user: data.session.user } : undefined);
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error("Login error:", err);
      setError("An error occurred while signing in. Please check your connection and try again.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      if (!isSupabaseConfigured) {
        handleRedirectToStudio();
        return;
      }

      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? `${window.location.origin}/login` : undefined,
        },
      });

      if (authError) {
        setError(authError.message || "Could not complete Google sign-in. Please try again.");
        setGoogleLoading(false);
      }
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error("Google sign in error:", err);
      setError("Could not complete Google sign-in. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <Background>
      <LevelUpTransitionOverlay
        isActive={isRedirecting}
        title="Login Successful"
        subtitle="Redirecting securely to LevelStudio..."
        targetUrl={targetStudioUrl}
      />
      <section className="py-28 lg:pt-44 lg:pb-32">
        <div className="container">
          <div className="flex flex-col gap-4">
            <Card className="mx-auto w-full max-w-sm">
              <CardHeader className="flex flex-col items-center space-y-0">
                <Link href="/" className="mb-7">
                  <Logo iconClassName="size-12" />
                </Link>
                <p className="mb-2 text-2xl font-bold">Welcome back</p>
                <p className="text-muted-foreground text-center text-sm">
                  Sign in to access your LevelStudio workspace.
                </p>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleEmailLogin} className="grid gap-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading || googleLoading}
                  />
                  <div>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading || googleLoading}
                    />
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        className="border-muted-foreground"
                      />
                      <label
                        htmlFor="remember"
                        className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember me
                      </label>
                    </div>
                    <Link
                      href="/contact"
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      Need help?
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    className="mt-2 w-full"
                    disabled={loading || googleLoading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      "Sign In to LevelStudio"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleLogin}
                    disabled={loading || googleLoading}
                  >
                    {googleLoading ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Signing in with Google...
                      </>
                    ) : (
                      <>
                        <FcGoogle className="mr-2 size-5" />
                        Sign in with Google
                      </>
                    )}
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
                    onClick={() => handleRedirectToStudio()}
                  >
                    Explore Dashboard as Demo Client
                  </Button>
                </form>
                <div className="text-muted-foreground mx-auto mt-8 flex justify-center gap-1 text-sm">
                  <p>Don&apos;t have an account?</p>
                  <Link href="/signup" className="text-primary font-medium hover:underline">
                    Sign up
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* LevelUp Ecosystem watermark */}
            <div className="mt-6 flex flex-col items-center select-none pointer-events-none opacity-25 hover:opacity-40 transition-opacity">
              <span className="text-[10px] font-bold tracking-tight text-foreground font-sans">
                LevelUp
              </span>
              <span className="text-[7.5px] font-semibold tracking-[0.28em] uppercase text-muted-foreground">
                Ecosystem
              </span>
            </div>
          </div>
        </div>
      </section>
    </Background>
  );
};

export default Login;
