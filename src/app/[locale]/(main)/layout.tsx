import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import { dark } from "@clerk/themes";

type Props = {
  children: React.ReactNode;
};

/**
 * Layout component for the main pages
 * @component
 * @version 1.0.0
 *
 * @param {React.ReactNode} children - The children to render
 * @returns The layout component
 */
export default async function RootLayout({ children }: Props) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <main>{children}</main>
    </ClerkProvider>
  );
}
