"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import { Loader2, AlertCircle } from "lucide-react";

import { auth, db } from "@/lib/firebase";
import { Background } from "@/components/background";
import { Logo } from "@/components/logo";
import { LevelUpTransitionOverlay } from "@/components/transition-overlay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const STUDIO_URL = "https://studio.levelup-ecosystem.com";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRedirectToStudio = () => {
    setIsRedirecting(true);
  };

  // Google One Tap automatic prompt handler
  const handleGoogleCredentialResponse = async (response: { credential?: string }) => {
    if (!response.credential) return;
    try {
      setGoogleLoading(true);
      setError(null);
      const credential = GoogleAuthProvider.credential(response.credential);
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          user_id: user.uid,
          name: user.displayName || user.email?.split("@")[0] || "Architect",
          email: user.email || "",
          role: "architect",
        });
      }

      handleRedirectToStudio();
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error("Google One Tap error:", err);
      setGoogleLoading(false);
    }
  };

  const initGoogleOneTap = useCallback(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (typeof window !== "undefined" && (window as unknown as { google?: { accounts?: { id?: { initialize: (c: unknown) => void; prompt: () => void } } } }).google?.accounts?.id && clientId) {
      (window as unknown as { google: { accounts: { id: { initialize: (c: unknown) => void; prompt: () => void } } } }).google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      (window as unknown as { google: { accounts: { id: { prompt: () => void } } } }).google.accounts.id.prompt();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    initGoogleOneTap();
  }, [initGoogleOneTap]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setError(null);
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // Ensure user profile document exists in Firestore /users/{uid}
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          user_id: user.uid,
          name: user.displayName || user.email?.split("@")[0] || "Architect",
          email: user.email || email.trim(),
          role: "architect",
        });
      }

      handleRedirectToStudio();
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error("Login error:", err);
      const errCode = (err as { code?: string })?.code;
      if (
        errCode === "auth/invalid-credential" ||
        errCode === "auth/wrong-password" ||
        errCode === "auth/user-not-found"
      ) {
        setError("Invalid email address or password. Please try again.");
      } else if (errCode === "auth/too-many-requests") {
        setError("Too many failed attempts. Please reset your password or try again later.");
      } else {
        setError("An error occurred while signing in. Please check your connection and try again.");
      }
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Check or create Firestore document in /users/{uid}
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          user_id: user.uid,
          name: user.displayName || user.email?.split("@")[0] || "Architect",
          email: user.email || "",
          role: "architect",
        });
      }

      handleRedirectToStudio();
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error("Google sign in error:", err);
      const errCode = (err as { code?: string })?.code;
      if (errCode !== "auth/popup-closed-by-user") {
        setError("Could not complete Google sign-in. Please try again or use email.");
      }
      setGoogleLoading(false);
    }
  };

  return (
    <Background>
      <LevelUpTransitionOverlay
        isActive={isRedirecting}
        title="Login Successful"
        subtitle="Redirecting to LevelStudio..."
        targetUrl={STUDIO_URL}
      />
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={initGoogleOneTap}
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
