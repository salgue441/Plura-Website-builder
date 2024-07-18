import { MetadataRoute } from "next"
import { getTranslations } from "next-intl/server"
import { clientLogger } from "@/infrastructure/logger/client-logger"

/**
 * Defines the metadata for the application.
 * @details The metadata is used to generate the manifest.json file.
 *
 * @returns The metadata
 */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  try {
    const locale = "en"
    const translations = await getTranslations({
      locale,
      namespace: "Manifest",
    })

    return {
      name: translations("name"),
      start_url: "/",
      display: "standalone",
      theme_color: "#000000",
      background_color: "#ffffff",
    }
  } catch (error) {
    clientLogger.error("Failed to load manifest", error as Error)
    throw error
  }
}
