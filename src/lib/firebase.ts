import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: "AIzaSyBjfhpyDeoSX_-AeOzTgobPLNKqV0DUBQ8",
  authDomain: "app-levelup-ecosystem.firebaseapp.com",
  projectId: "app-levelup-ecosystem",
  storageBucket: "app-levelup-ecosystem.firebasestorage.app",
  messagingSenderId: "338931284223",
  appId: "1:338931284223:web:33763b0f82bc98c8eff4ca",
  measurementId: "G-J73ZNS49L0",
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
