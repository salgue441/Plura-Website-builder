import { ClerkService } from ".";

export class AuthService {
  constructor(private clerkService: ClerkService) {}

  /**
   * Update the user metadata
   *
   * @param {string} userId - The ID of the user
   * @param {Record<string, any>} metadata - The metadata to update
   * @returns {Promise<void>}
   */
  async updateUserMetadata(
    userId: string,
    metadata: Record<string, any>
  ): Promise<void> {
    await this.clerkService.updateUserMetadata(userId, metadata);
  }
}
