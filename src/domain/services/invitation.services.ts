import { User } from "@clerk/nextjs/server";
import {
  InvitationRepository,
  UserRepository
} from "@/infrastructure/repositories";
import { UnauthorizedError, NotFoundError } from "@/infrastructure/errors";
import { serverLogger } from "@/infrastructure/logger";
import { db } from "@/infrastructure/database/prisma";
import { UserService, ClerkService } from ".";

export class InvitationService {
  constructor(
    private readonly invitationRepository: InvitationRepository,
    private readonly userRepository: UserRepository,
    private readonly userSerivces: UserService,
    private readonly clerkServices: ClerkService
  ) {}

  /**
   * Checks if the user has an active invitation
   *
   * @param {string} email - The email address
   * @return {Promise<boolean>} True if the user has an active invitation,
   *                            false otherwise
   * @throws {Error} If the check fails
   */
  async checkInvitation(email: string): Promise<boolean> {
    try {
      const invitation =
        await this.invitationRepository.getInvitationByEmail(email);

      return !!invitation;
    } catch (error: unknown) {
      serverLogger.error("Failed to check invitation", error as Error, {
        email
      });

      throw error;
    }
  }

  /**
   * Accepts an invitation and creates a new user with the new agency role
   *
   * @param {User} currentUser: The current user object
   * @return {Promise<string | null>} The agency ID of the new user
   * @throws {UnauthorizedError} If the user is not authorized to accept the
   *                             invitation
   * @throws {NotFoundError} If the invitation cannot be found
   */
  async acceptInvitation(currentUser: User): Promise<string | null> {
    try {
      if (!currentUser) {
        throw new UnauthorizedError("User not authorized");
      }

      const userEmail = currentUser.emailAddresses[0].emailAddress;

      return db.$transaction(async () => {
        const invitation =
          await this.invitationRepository.getInvitationByEmail(userEmail);

        if (!invitation) {
          const agency = await this.userRepository.findByEmail(userEmail);
          return agency ? agency.agencyId : null;
        }

        const userDetails = await this.userSerivces.createTeamUser(
          invitation.agencyId,
          {
            id: currentUser.id,
            name: currentUser.fullName || "",
            email: invitation.email,
            avatarUrl: currentUser.imageUrl,
            agencyId: invitation.agencyId,
            role: invitation.role,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        );

        if (userDetails) {
          await Promise.all([
            this.clerkServices.updateMetadata(currentUser.id, {
              privateMetadata: { role: userDetails.role || "SUBACCOUNT_USER" }
            }),

            this.invitationRepository.updateInvitationStatus(
              invitation.id,
              "ACCEPTED"
            )
          ]);
        }

        return userDetails?.agencyId || null;
      });
    } catch (error: unknown) {
      serverLogger.error("Failed to accept invitation", error as Error, {
        currentUser
      });

      throw error;
    }
  }
}
