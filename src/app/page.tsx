import { redirect } from "next/navigation"

/**
 * Redirects the user to the English version of the site page.
 */
export default function RootPage() {
  redirect("/en")
}
