import { User, clerkClient } from "@clerk/nextjs/server";

export class ClerkService {
  /**
   * Updates the user metadata in Clerk
   *
   * @param {string} userId - The ID of the user
   * @param {Record<string, any>} metadata - The metadata to update
   */
  async updateUserMetadata(userId: string, metadata: Record<string, any>) {
    await clerkClient.users.updateUserMetadata(userId, metadata);
  }
}
