import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBjfhpyDeoSX_-AeOzTgobPLNKqV0DUBQ8",
  // Custom domain supported (e.g. auth.levelup-ecosystem.com or levelup-ecosystem.com)
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "app-levelup-ecosystem.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "app-levelup-ecosystem",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "app-levelup-ecosystem.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "338931284223",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:338931284223:web:33763b0f82bc98c8eff4ca",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-J73ZNS49L0",
};

// Initialize Firebase singleton
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);

// Safe Client-side Analytics initialization
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}
