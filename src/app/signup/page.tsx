"use client";

import { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { Loader2, AlertCircle } from "lucide-react";

import { supabase, isSupabaseConfigured } from "@/lib/supabase-client";
import { Background } from "@/components/background";
import { Logo } from "@/components/logo";
import { LevelUpTransitionOverlay } from "@/components/transition-overlay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const STUDIO_URL = "https://studio.levelup-ecosystem.com";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [targetStudioUrl, setTargetStudioUrl] = useState(STUDIO_URL);
  const [error, setError] = useState<string | null>(null);

  const handleRedirectToStudio = (session?: { access_token?: string; user?: { id: string; email?: string } }) => {
    try {
      if (session?.access_token && session.user) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("levelup_auth_token", session.access_token);
          sessionStorage.setItem("levelup_user_uid", session.user.id);
          sessionStorage.setItem("levelup_user_email", session.user.email || "");
        }
        setTargetStudioUrl(
          `${STUDIO_URL}/#auth_token=${encodeURIComponent(session.access_token)}&uid=${encodeURIComponent(session.user.id)}&email=${encodeURIComponent(session.user.email || "")}`
        );
      } else {
        setTargetStudioUrl(STUDIO_URL);
      }
    } catch {
      setTargetStudioUrl(STUDIO_URL);
    }
    setIsRedirecting(true);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setError(null);
    setLoading(true);

    try {
      if (!isSupabaseConfigured) {
        handleRedirectToStudio();
        return;
      }

      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim() || "Architect",
            role: "architect",
          },
        },
      });

      if (authError) {
        setError(authError.message || "Failed to create account. Please check your credentials.");
        setLoading(false);
        return;
      }

      handleRedirectToStudio(data.session ? { access_token: data.session.access_token, user: data.session.user } : undefined);
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error("Signup error:", err);
      setError("An error occurred during account creation. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
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
        setError(authError.message || "Could not complete Google registration. Please try again.");
        setGoogleLoading(false);
      }
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error("Google sign up error:", err);
      setError("Could not complete Google sign-up. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <Background>
      <LevelUpTransitionOverlay
        isActive={isRedirecting}
        title="Account Created"
        subtitle="Initializing your LevelStudio workspace..."
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
                <p className="mb-2 text-2xl font-bold">Create your workspace</p>
                <p className="text-muted-foreground text-center text-sm">
                  Get instant access to LevelStudio prototypes.
                </p>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSignup} className="grid gap-4">
                  <Input
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading || googleLoading}
                  />
                  <Input
                    type="email"
                    placeholder="Work email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading || googleLoading}
                  />
                  <div>
                    <Input
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={loading || googleLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="mt-2 w-full"
                    disabled={loading || googleLoading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create LevelStudio Account"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleSignup}
                    disabled={loading || googleLoading}
                  >
                    {googleLoading ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Connecting Google...
                      </>
                    ) : (
                      <>
                        <FcGoogle className="mr-2 size-5" />
                        Sign up with Google
                      </>
                    )}
                  </Button>
                </form>
                <div className="text-muted-foreground mx-auto mt-8 flex justify-center gap-1 text-sm">
                  <p>Already have an account?</p>
                  <Link href="/login" className="text-primary font-medium hover:underline">
                    Sign in
                  </Link>
                </div>
              </CardContent>
            </Card>

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

export default Signup;
