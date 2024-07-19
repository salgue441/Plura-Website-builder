import { cn } from "@/lib/utils";
import React from "react";

/**
 * Spinner component
 * @component
 * @version 1.0.0
 *
 * @param props: HTMLAttributes<HTMLDivElement> - The props
 * @returns The Spinner component
 */
const Spinner = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "animate-spin rounded-full border-2 border-current border-t-transparent",
      className
    )}
    {...props}
  >
    <span className="sr-only">Loading...</span>
  </div>
));

export { Spinner };
