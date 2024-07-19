import React from "react";
import { Spinner } from "../generic/spinner";

/**
 * Loading spinner component
 * @component
 * @version 1.0.0
 *
 * @returns The loading spinner component
 */
export const LoadingSpinner = React.memo(() => (
  <div className="flex justify-center items-center h-screen">
    <Spinner className="h-8 w-8 text-primary" />
  </div>
));
