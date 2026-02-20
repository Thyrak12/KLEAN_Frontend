import { useState, useEffect, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

interface OnboardingGuardProps {
  children: ReactNode;
}

/**
 * Route guard for onboarding pages.
 * - If not authenticated → redirect to /login
 * - If authenticated AND onboarding already completed → redirect to /
 * - Otherwise → render children (allow onboarding)
 */
export default function OnboardingGuard({ children }: OnboardingGuardProps) {
  const [status, setStatus] = useState<"loading" | "allowed" | "completed" | "unauthenticated">("loading");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setStatus("unauthenticated");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data()?.onboardingCompleted) {
          setStatus("completed");
        } else {
          setStatus("allowed");
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        // Allow access on error so the user isn't stuck
        setStatus("allowed");
      }
    });

    return () => unsubscribe();
  }, []);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  if (status === "completed") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
