import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import {
  defaultLocale,
  locales,
  localePrefix,
  pathnames
} from "./config/config";

const PUBLIC_ROUTES = new Set([
  "/site",
  "/api/uploadthing",
  "/sign-in",
  "/sign-up"
]);

const intlMiddleware = createMiddleware({
  defaultLocale,
  locales,
  localePrefix,
  pathnames
});

/**
 * Gets the locale from the request headers
 *
 * @param {NextRequest} request - The request object
 * @returns {string} The locale
 */
function getLocale(request: NextRequest): string {
  const negotiatorHeader: Record<string, string> = {};

  request.headers.forEach((value, key) => {
    negotiatorHeader[key] = value;
  });

  const languages = new Negotiator({ headers: negotiatorHeader }).languages();
  return match(languages, [...locales], defaultLocale);
}

/**
 * Checks if a route is public
 *
 * @param {string} pathname - The pathname of the route
 * @returns {boolean} Whether the route is public
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.has(pathname.split("/").pop() || "");
}

export default clerkMiddleware(async (auth, request) => {
  const { pathname, hostname, search } = new URL(request.url);
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    return NextResponse.redirect(
      new URL(`/${locale}${pathname}${search}`, request.url)
    );
  }

  if (!isPublicRoute(pathname)) {
    const session = await auth().sessionId;

    if (!session === null) {
      return NextResponse.redirect("/sign-in");
    }
  }

  if (pathname === "/" || pathname === "/en" || pathname === "/es") {
    return NextResponse.redirect(new URL(`/site`, request.url));
  }

  return intlMiddleware(request);
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/(es|en)/:path*"
  ]
};
