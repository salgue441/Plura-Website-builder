import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import {
  defaultLocale,
  locales,
  localePrefix,
  pathnames
} from "./config/config";

const intlMiddleware = createMiddleware({
  defaultLocale,
  locales,
  localePrefix,
  pathnames
});

const publicRoutes = [
  "/:locale/site",
  "/api/uploadthing",
  "/:locale/sign-in",
  "/:locale/sign-up"
];

const isPublicRoute = createRouteMatcher(publicRoutes);

/**
 * Middleware for Clerk authentication and internationalization.
 *
 * @param auth - The Clerk authentication object.
 * @param request - The request object.
 *
 * @returns The response object.
 */
export default clerkMiddleware((auth, request) => {
  const url = new URL(request.url);
  const { pathname, hostname, search } = url;

  if (["/", "/site", "/en", "/es"].includes(pathname)) {
    const locale = pathname === "/en" ? "en" : "es";
    return NextResponse.rewrite(new URL(`/${locale}/site`, request.url));
  }

  if (pathname.startsWith("/agency")) {
    return NextResponse.rewrite(
      new URL(`/${defaultLocale}${pathname}${search}`, request.url)
    );
  }

  if (pathname.includes("/sign-in") || pathname.includes("/sign-up")) {
    const subDomain = hostname.split(`.${process.env.NEXT_PUBLIC_DOMAIN}`)[0];
    return NextResponse.rewrite(
      new URL(`/${subDomain}/sign-in${search}`, request.url)
    );
  }

  if (hostname !== "localhost" && !hostname.startsWith("127.0.0.1")) {
    const subDomain = hostname.split(`.${process.env.NEXT_PUBLIC_DOMAIN}`)[0];

    if (subDomain && subDomain !== "www") {
      return NextResponse.rewrite(
        new URL(
          `/${defaultLocale}/${subDomain}${pathname}${search}`,
          request.url
        )
      );
    }
  }

  if (!isPublicRoute(request)) {
    auth().protect();
  }

  return intlMiddleware(request);
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/(es|en)/:path*", "/", "/(api|trpc)(.*)"]
};
