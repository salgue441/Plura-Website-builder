import { db } from "../database/prisma";
import { User } from "@prisma/client";
import { serverLogger } from "../logger";

export class UserRepository {
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

  /**
   * Find a user by email
   *
   * @param {string} email - User email
   * @returns {Promise<User | null | undefined>} User or null if not found
   */
  async findByEmail(email: string): Promise<User | null> {
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
   * Finds a user by the subaccount ID
   *
   * @param {string} agencyId - The agency ID
   * @param {string} subaccountId - The subaccount ID
   * @returns {Promise<User | null | undefined>} The user or null if not found
   * @throws {Error} If the user cannot be found
   */
  async findBySubaccountId(
    agencyId: string,
    subaccountId: string
  ): Promise<User | null> {
    try {
      return await db.user.findFirst({
        where: {
          OR: [
            { Agency: { id: agencyId } },
            { Agency: { SubAccount: { some: { id: subaccountId } } } }
          ]
        }
      });
    } catch (error: unknown) {
      serverLogger.error(
        "Failed to find user by subaccount ID",
        error as Error,
        {
          subaccountId
        }
      );

      throw error;
    }
  }
}
