import { ThemeProvider } from "@/providers/theme-provider";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { locales } from "@/config/config";
import {
  getMessages,
  getTranslations,
  unstable_setRequestLocale
} from "next-intl/server";

const font = DM_Sans({ subsets: ["latin"] });
type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

/**
 * Generates the static params for the layout
 * @returns The static params for the layout
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Metadata for the layout
 *
 * @type Metadata
 * @version 1.0.0
 */
export async function generateMetadata({
  params: { locale }
}: Omit<Props, "children">) {
  const t = await getTranslations("LocaleLayout");

  return {
    title: t("title")
  };
}

/**
 * Root layout for the application
 * @layout
 * @version 1.0.0
 *
 * @param children: React.ReactNode - The children of the layout
 * @returns The layout of the application
 */
export default async function RootLayout({
  children,
  params: { locale }
}: Props) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Plura Agency</title>
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body className={font.className}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
