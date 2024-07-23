import { db } from "../database";
import { User } from "@prisma/client";
import { serverLogger } from "../logger/server-logger";

export class UserRepository {
  /**
   * Find a user by email
   *
   * @param {string} email - User email
   * @returns {Promise<User | null | undefined>} User or null if not found
   */
  async findByEmail(email: string): Promise<User | null | undefined> {
    try {
      return await db.user.findUnique({
        where: { email },
        include: {
          Agency: {
            include: {
              SidebarOption: true,
              SubAccount: { include: { SidebarOption: true } }
            }
          }
        }
      });
    } catch (error: unknown) {
      serverLogger.error("Failed to find user by email", error as Error, {
        email
      });

      throw error;
    }
  }

  /**
   * Creates a new user and associates it to a team
   *
   * @param {User} user - The user object
   * @return {Promise<User>} The created user
   */
  async create(user: User): Promise<User> {
    try {
      return await db.user.create({
        data: user
      });
    } catch (error: unknown) {
      serverLogger.error("Failed to create user", error as Error, { user });
      throw error;
    }
  }
}
