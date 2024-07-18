"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

/**
 * Provides the theme context for the application.
 * @component
 * @version 1.0.0
 *
 * @params props: ThemeProviderProps - props for the ThemeProvider component.
 * @returns The rendered ThemeProvider component.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
}
