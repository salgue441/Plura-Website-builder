import { UserRepository } from "@/infrastructure/repositories/user.repository";
import { User } from "@prisma/client";
import { NotFoundError, UnauthorizedError } from "@/infrastructure/errors";
import { serverLogger } from "@/infrastructure/logger/server-logger";

export class UserServices {
  private userRepository: UserRepository;
  private currentUser: User;

  constructor(userRepository: UserRepository, currentUser: User) {
    this.userRepository = userRepository;
    this.currentUser = currentUser;
  }

  /**
   * Gets the authenticated user details
   *
   * @returns {Promise<User | null>} The authenticated user
   * @throws {NotFoundError} If the user cannot be found
   * @throws {Error} If the user details cannot be retrieved
   */
  async getAuthDetails(): Promise<User | null> {
    try {
      const userRecord = await this.userRepository.findByEmail(
        this.currentUser.email
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
   * Creates a new user and assigns them to the current user's agency
   *
   * @param {string} agencyId - The agency ID to assign the user to
   * @param {User} user - The user object
   * @returns {Promise<User | null>} The created user
   * @throws {UnauthorizedError} If the user is an agency owner
   * @throws {Error} If the user cannot be created
   */
  async createTeamUser(agencyId: string, user: User): Promise<User | null> {
    try {
      if (user.role === "AGENCY_OWNER") {
        throw new UnauthorizedError("Agency owners cannot be team members");
      }

      return await this.userRepository.create(user);
    } catch (error: unknown) {
      serverLogger.error("Failed to create team user", error as Error, {
        user
      });
      throw error;
    }
  }
}
