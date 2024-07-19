"use client";

import { useContext, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/contexts/auth-context";

/**
 * Custom hook for authorization purposes
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  const router = useRouter();

  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  const { user, isLoading, signOut } = context;

  useEffect(() => {
    if (isLoading && !user) {
      router.replace("/agency/sign-in");
    }
  }, [user, isLoading, router]);

  const redirectoToSignIn = useCallback(() => {
    router.replace("/agency/sign-in");
  }, [router]);

  const redirectoToSignOut = useCallback(() => {
    router.replace("/agency/sign-out");
  }, [router]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signOut,
    redirectoToSignIn,
    redirectoToSignOut
  };
};
