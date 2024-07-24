import { PrismaClient } from "@prisma/client";
import { serverLogger } from "../../logger";

interface DatabaseConfig {
  logQueries: boolean;
  connectionTimeout: number;
}

const defaultConfig: DatabaseConfig = {
  logQueries: process.env.NODE_ENV !== "production",
  connectionTimeout: 5000
};

let prismaInstance: PrismaClient | null = null;

declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * Creates a Prisma client instance.
 *
 * @param config - Optional configuration for the Prisma client.
 * @returns The Prisma client instance.
 */
export function createPrismaClient(
  config: Partial<DatabaseConfig> = {}
): PrismaClient {
  const fullConfig = { ...defaultConfig, ...config };

  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log: fullConfig.logQueries ? ["query", "error", "warn"] : ["error"]
    });
  }

  return prismaInstance;
}

/**
 * Connects to the database using the provided configuration.
 *
 * @param config - Optional configuration for the database connection.
 * @returns A Promise that resolves when the connection is established.
 * @throws If the connection fails or times out.
 */
export async function connectToDatabase(
  config: Partial<DatabaseConfig> = {}
): Promise<void> {
  const db = createPrismaClient(config);

  try {
    await Promise.race([
      db.$connect(),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Database Connection Timeout")),
          config.connectionTimeout ?? defaultConfig.connectionTimeout
        )
      )
    ]);

    serverLogger.info("Database connected successfully");
  } catch (error: unknown) {
    serverLogger.error("Database connection failed", error as Error);
    throw error;
  }
}

/**
 * Disconnects from the database.
 *
 * @returns A promise that resolves when the disconnection is successful.
 */
export async function disconnectFromDatabase(): Promise<void> {
  if (prismaInstance) {
    await prismaInstance.$disconnect();

    prismaInstance = null;
    serverLogger.info("Database disconnected successfully");
  }
}

process.on("SIGINT", async () => {
  await disconnectFromDatabase();
  process.exit(0);
});

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = createPrismaClient();
}

export const db = createPrismaClient();
