import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import superjson from "superjson";
import { type AppRouter } from "./trpc/trpc";
import { clientLogger } from "@/infrastructure/logger";

/**
 * Gets the base URL.
 *
 * @returns The base URL.
 */
const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return `http://localhost:${process.env.PORT ?? 3000}`;
};

/**
 * The tRPC client.
 *
 * @returns The tRPC client.
 */
export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
          logger: (opts) => {
            if (opts.direction === "down") {
              clientLogger.info("tRPC request: ", opts);
            } else {
              clientLogger.info("tRPC response: ", opts);
            }
          }
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`
        })
      ]
    };
  },
  ssr: false
});
