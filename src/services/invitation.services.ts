import { Invitation, clerkClient, currentUser } from "@clerk/nextjs/server";
import { InvitationRepository } from "@/infrastructure/repositories/invitation-queries.repository";
import { UserRepository } from "@/infrastructure/repositories/user.repository";
import { UnauthorizedError } from "@/infrastructure/errors";
import { serverLogger } from "@/infrastructure/logger/server-logger";
import { User } from "@prisma/client";

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

  async getCurrentUser() {
    try {
      const user = await currentUser();
      if (!user) {
        throw new UnauthorizedError("User not authenticated");
      }

      return user;
    } catch (error: unknown) {
      serverLogger.error("Failed to get current user", error as Error);
      throw error;
    }
  }

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
