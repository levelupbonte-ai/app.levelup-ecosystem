import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

export const isFirebaseAvailable = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey.length > 5 &&
  !firebaseConfig.apiKey.includes("your-api-key")
);

// Safe initialization that NEVER crashes Next.js build if keys are empty
let appInstance: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;

if (isFirebaseAvailable) {
  try {
    appInstance = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    dbInstance = getFirestore(appInstance);
    authInstance = getAuth(appInstance);
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Firebase] Init skipped:", err);
    }
  }
}

export const app = appInstance;
export const db = dbInstance;
export const auth = authInstance;

// Safe Client-side Analytics initialization
export let analytics: Analytics | null = null;
if (typeof window !== "undefined" && appInstance) {
  isSupported().then((supported) => {
    if (supported && appInstance) {
      analytics = getAnalytics(appInstance);
    }
  });
}
