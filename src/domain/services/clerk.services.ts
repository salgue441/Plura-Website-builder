import { serverLogger } from "@/infrastructure/logger";
import { clerkClient } from "@clerk/nextjs/server";

export class ClerkService {
  /**
   * Updates the user metadata
   *
   * @param {string} userId - The user ID
   * @param {UserPrivateMetadata} metadata - The metadata to update
   * @returns {Promise<void>}
   * @throws {Error} If the metadata cannot be updated
   */
  async updateMetadata(
    userId: string,
    metadata: UserPrivateMetadata
  ): Promise<void> {
    try {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: metadata
      });
    } catch (error: unknown) {
      serverLogger.error("Failed to update user metadata", error as Error, {
        userId
      });

      throw error;
    }
  }
}
