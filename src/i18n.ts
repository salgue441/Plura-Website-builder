import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { locales } from "@/config/config";

/**
 * Gets the request configuration for the page.
 *
 * @returns The requested locale translation messages
 * @throws {notFound} If the locale is not supported
 */
export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
