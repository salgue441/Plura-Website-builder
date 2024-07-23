import { User, currentUser } from "@clerk/nextjs/server";
import { InvitationRepository } from "@/infrastructure/repositories/invitation.repository";
import { UserRepository } from "@/infrastructure/repositories/user.repository";
import { UnauthorizedError } from "@/infrastructure/errors";
import { serverLogger } from "@/infrastructure/logger/server-logger";

export class InvitationService {
  private invitationRepository: InvitationRepository;
  private userRepository: UserRepository;

  constructor(
    invitationRepository: InvitationRepository,
    userRepository: UserRepository
  ) {
    this.invitationRepository = invitationRepository;
    this.userRepository = userRepository;
  }

  /**
   * Checks if the invitation exists
   *
   * @param {string} email - The email address
   * @returns {Promise<Invitation | null>} The invitation or null if not found
   * @throws {Error} If the invitation cannot be found
   */
  async checkInvitation(email: string) {
    try {
      return await this.invitationRepository.getInvitationByEmail(email);
    } catch (error: unknown) {
      serverLogger.error("Failed to check invitation", error as Error, {
        email
      });

      throw error;
    }
  }

  /**
   * Checks if the user exists
   *
   * @param {string} email - The email address
   * @throws {Error} If the user cannot be created
   */
  async checkExistingUser(email: string) {
    try {
      return await this.userRepository.findByEmail(email);
    } catch (error: unknown) {
      serverLogger.error("Failed to check existing user", error as Error, {
        email
      });
      throw error;
    }
  }
}
