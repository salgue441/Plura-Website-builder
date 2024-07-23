import { currentUser } from "@clerk/nextjs/server";
import { UserRepository } from "@/infrastructure/repositories/user.repository";
import { User } from "@prisma/client";
import { NotFoundError, UnauthorizedError } from "@/infrastructure/errors";
import { serverLogger } from "@/infrastructure/logger/server-logger";

export class UserServices {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Get authenticated user details
   *
   * @returns {Promise<User | null>} Authenticated user details
   * @throws {UnauthorizedError} User not authenticated
   * @throws {NotFoundError} User not found
   */
  async getAuthDetails(): Promise<User | null> {
    try {
      const user = await currentUser();
      if (!user) {
        throw new UnauthorizedError("User not authenticated");
      }

      const userRecord = await this.userRepository.findByEmail(
        user.emailAddresses[0].emailAddress
      );

      if (!userRecord) {
        throw new NotFoundError("User not found");
      }

      return userRecord;
    } catch (error: unknown) {
      serverLogger.error(
        "Failed to get authenticated user details",
        error as Error
      );

      throw error;
    }
  }

  /**
   * Create a new user
   *
   * @param {string} agencyId - The agency id to associate the user with
   * @param {User} user - The user object
   * @returns {Promise<User>} The created user
   */
  async createTeamUser(agencyId: string, user: User): Promise<User | null> {
    try {
      if (user.role === "AGENCY_OWNER") {
        throw new UnauthorizedError("Agency owner cannot be created");
      }

      return this.userRepository.create(user);
    } catch (error: unknown) {
      serverLogger.error("Failed to create user", error as Error, { user });
      throw error;
    }
  }
}
