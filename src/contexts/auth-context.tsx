"use client";

import React, { createContext, useCallback, useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { LoadingSpinner } from "@/components/modules/loading-spinner";

interface AuthContextValue {
  user: any | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

/**
 * Authorization provider
 *
 * @param {React.ReactNode} children - Children nodes of the provider
 * @returns AuthProvider
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const clerk = useClerk();
  const [isLoading, setIsLoading] = useState<boolean>(!isLoaded);

  useEffect(() => {
    if (isLoaded) {
      setIsLoading(false);
    }
  }, [isLoaded]);

  const signOut = useCallback(async () => {
    await clerk.signOut();
  }, [clerk]);

  const contextValue: AuthContextValue = {
    user: isSignedIn ? (user as unknown as User) : null,
    isLoading: isLoading,
    signOut
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
