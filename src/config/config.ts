import { Pathnames, LocalePrefix } from "next-intl/routing"

export const defaultLocale = "en" as const
export const locales = ["en", "es"] as const

export const pathnames: Pathnames<typeof locales> = {
  "/": "/",
  "/pathnames": {
    en: "/pathnames",
    es: "/rutas",
  },
}

export const localePrefix: LocalePrefix<typeof locales> = "always" as const
export const port = process.env.PORT || 3000
export const host = process.env.HOST || `http://localhost:${port}`
