"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { LoadingSpinner } from "@/components/modules/loading-spinner";

/**
 * Agency page component
 * @component
 * @version 1.0.0
 *
 * @returns {React.Component} Agency page component
 */
const Page = () => {
  const { user, isAuthenticated, isLoading, signOut, redirectToSignIn } =
    useAuth();
  const [agencyId, setAgencyId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      acceptInvitation();
    }
  }, [isAuthenticated, user]);

  const acceptInvitation = async () => {
    try {
      const response = await fetch("/api/invitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });

      const data = await response.json();
      setAgencyId(data.agencyId);
    } catch (error) {
      console.error("Failed to accept invitation", error);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) {
    redirectToSignIn();
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    redirectToSignIn();
  };

  return (
    <div>
      <h1>Welcome, {user?.firstName}</h1>

      {agencyId ? (
        <p>Your agency id is: {agencyId}</p>
      ) : (
        <p>You don't have an agency ID yet.</p>
      )}

      <button onClick={handleSignOut}>Sign out</button>
    </div>
  );
};

export default Page;
