import { User, currentUser } from "@clerk/nextjs/server";
import { InvitationRepository } from "@/infrastructure/repositories/invitation.repository";
import { UserRepository } from "@/infrastructure/repositories/user.repository";
import { UnauthorizedError } from "@/infrastructure/errors";
import { serverLogger } from "@/infrastructure/logger/server-logger";

export class InvitationService {
  private invitationRepository: InvitationRepository;
  private userRepository: UserRepository;
  private currentUser: User;

  constructor(
    invitationRepository: InvitationRepository,
    userRepository: UserRepository,
    currentUser: User
  ) {
    this.invitationRepository = invitationRepository;
    this.userRepository = userRepository;
    this.currentUser = currentUser;
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
