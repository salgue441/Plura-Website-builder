import { Injectable } from "@nestjs/common";
import { User } from "@clerk/nextjs/server";
import type {
  IInvitationRepository,
  IUserRepository,
  PrismaTransaction
} from "../interfaces";
import { UserService } from ".";
import { ClerkService } from ".";
import { UnauthorizedError, NotFoundError } from "@/infrastructure/errors";
import { serverLogger } from "@/infrastructure/logger";
import { CreateUserDto } from "../dtos";

@Injectable()
export class InvitationService {
  constructor(
    private readonly invitationRepository: IInvitationRepository,
    private readonly userRepository: IUserRepository,
    private readonly userService: UserService,
    private readonly clerkService: ClerkService,
    private readonly prismaTransaction: PrismaTransaction
  ) {}

  /**
   * Check if the user has an invitation
   *
   * @param {string} email - The email of the user
   * @returns {Promise<boolean>} - A boolean indicating if the user
   *                               has an invitation
   * @throws {Error} - If an error occurs
   */
  async checkInvitation(email: string): Promise<boolean> {
    try {
      const invitation =
        await this.invitationRepository.getInivitationByEmail(email);

      return invitation !== null;
    } catch (error: unknown) {
      serverLogger.error("Failed to check invitation", error as Error);
      throw error;
    }
  }

  /**
   * Accept an invitation
   *
   * @param {User} currentUser - The current user
   * @returns {Promise<string | null>} - The agency id of the user
   *                                     or null if the user is not
   *                                     invited
   * @throws {UnauthorizedError} - If the user is not authorized
   * @throws {Error} - If an error occurs
   */
  async acceptInvitation(currentUser: User): Promise<string | null> {
    if (!currentUser) {
      throw new UnauthorizedError("User not authorized");
    }

    const email = currentUser.emailAddresses[0].emailAddress;
    return this.prismaTransaction.run(async () => {
      try {
        const invitation =
          await this.invitationRepository.getInivitationByEmail(email);

        if (!invitation) {
          const agency = await this.userRepository.findByEmail(email);
          return agency?.agencyId ?? null;
        }

        const createUserDto: CreateUserDto = {
          name: currentUser.fullName || "",
          email: invitation.email,
          avatarUrl: currentUser.imageUrl,
          agencyId: invitation.agencyId,
          role: invitation.role
        };

        const userDetails =
          await this.userService.createTeamUser(createUserDto);

        if (userDetails) {
          await Promise.all([
            this.clerkService.updateMetadata(currentUser.id, {
              privateMetadata: { role: userDetails.role || "SUBACCOUNT_USER" }
            }),

            this.invitationRepository.updateInvitationStatus(
              invitation.id,
              "ACCEPTED"
            )
          ]);
        }

        return userDetails?.agencyId ?? null;
      } catch (error: unknown) {
        serverLogger.error("Failed to accept invitation", error as Error);
        throw error;
      }
    });
  }
}
