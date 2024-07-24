"use client";

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
    </div>
  );
};

export default Page;
