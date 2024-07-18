import { MetadataRoute } from "next"
import { locales, pathnames, defaultLocale, host } from "@/config/config"
import { getPathname } from "@/navigation"

/**
 * Gets the URL for the given pathname and locale.
 *
 * @param key: pathanames - The pathname key to get the URL for
 * @param locale: locales - The locale to get the URL for
 * @returns The assigned URL
 */
function getUrl(key: keyof typeof pathnames, locale: (typeof locales)[number]) {
  const pathname = getPathname({ locale, href: key })
  return `${host}/${locale}${pathname === "/" ? "" : pathname}`
}

/**
 * Defines the sitemap for the application.
 * @details The sitemap is a list of routes used to generate the sitemap.xml
 *          file for web crawlers and search engines.
 *
 * @returns The sitemap routes
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return Object.entries(pathnames).map(([key, _]) => ({
    url: getUrl(key as keyof typeof pathnames, defaultLocale),
    alternates: {
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          getUrl(key as keyof typeof pathnames, locale),
        ])
      ),
    },
  }))
}
