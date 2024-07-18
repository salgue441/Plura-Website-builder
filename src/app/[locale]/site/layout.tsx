import Navigation from "@/components/generic/site/navigation";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import React from "react";

type Props = {
  children: React.ReactNode;
};

/**
 * Renders the site layout.
 * @layout
 * @version 1.0.0
 *
 * @param children: React.ReactNode - The children to render.
 * @returns The site layout.
 */
const layout = async ({ children }: Props) => {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <main className="h-full">
        <Navigation />

        {children}
      </main>
    </ClerkProvider>
  );
};

export default layout;
