"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithCredential,
  GoogleAuthProvider,
  updateProfile,
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

  const handleRedirectToStudio = async (user?: import("firebase/auth").User) => {
    try {
      if (user) {
        const idToken = await user.getIdToken();
        if (typeof window !== "undefined") {
          sessionStorage.setItem("levelup_auth_token", idToken);
          sessionStorage.setItem("levelup_user_uid", user.uid);
          sessionStorage.setItem("levelup_user_email", user.email || "");
        }
        setTargetStudioUrl(
          `${STUDIO_URL}/#auth_token=${encodeURIComponent(idToken)}&uid=${encodeURIComponent(user.uid)}&email=${encodeURIComponent(user.email || "")}`
        );
      } else {
        setTargetStudioUrl(STUDIO_URL);
      }
    } catch {
      setTargetStudioUrl(STUDIO_URL);
    }
    setIsRedirecting(true);
  };

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

      handleRedirectToStudio(user);
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

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = userCredential.user;

      if (name.trim()) {
        try {
          await updateProfile(user, { displayName: name.trim() });
        } catch (nameErr) {
          // eslint-disable-next-line no-console
          console.warn("Could not update displayName:", nameErr);
        }
      }

      // Create architect user record in Firestore /users/{uid} matching security rules
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        user_id: user.uid,
        name: name.trim() || user.displayName || user.email?.split("@")[0] || "Architect",
        email: user.email || email.trim(),
        role: "architect",
      });

      handleRedirectToStudio(user);
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error("Signup error:", err);
      const errCode = (err as { code?: string })?.code;
      if (errCode === "auth/email-already-in-use") {
        setError("An account with this email already exists. Please log in instead.");
      } else if (errCode === "auth/weak-password") {
        setError("The password provided is too weak. Please use at least 8 characters.");
      } else if (errCode === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Could not complete registration. Please check your network and try again.");
      }
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
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

      handleRedirectToStudio(user);
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error("Google sign up error:", err);
      const errCode = (err as { code?: string })?.code;
      if (errCode !== "auth/popup-closed-by-user") {
        setError("Could not complete Google sign-up. Please try again or use email.");
      }
      setGoogleLoading(false);
    }
  };

  return (
    <Background>
      <LevelUpTransitionOverlay
        isActive={isRedirecting}
        title="Account Created Successfully"
        subtitle="Redirecting securely to LevelStudio..."
        targetUrl={targetStudioUrl}
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
                <p className="mb-2 text-2xl font-bold">Create your workspace</p>
                <p className="text-muted-foreground text-center text-sm">
                  Sign up to access LevelStudio in less than 2 minutes.
                </p>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleEmailSignup} className="grid gap-4">
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading || googleLoading}
                  />
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
                    <p className="text-muted-foreground mt-1 text-xs">
                      Must be at least 8 characters.
                    </p>
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
                      "Create Account & Launch Studio"
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
                        Signing up with Google...
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
                    Log in
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

export default Signup;
