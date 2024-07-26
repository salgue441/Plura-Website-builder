import { db } from "../database/prisma";
import type { IUserRepository } from "@/domain/interfaces";
import type { User } from "@/domain/models";
import { mapPrismaUserToUser } from "../mappers/user.mapper";
import { BadRequestError, NotFoundError } from "../errors";
import { serverLogger } from "../logger";

export class UserRepository implements IUserRepository {
  /**
   * Finds a user by ID
   *
   * @param {string} id - The ID of the user
   * @returns {Promise<User | null>} The user if found, otherwise null
   * @throws {NotFoundError} If the user is not found
   * @throws {Error} Any errors that occur while finding the user
   */
  async findById(id: string): Promise<User | null> {
    try {
      const user = await db.user.findUnique({
        where: {
          id
        }
      });

      if (!user) {
        throw new NotFoundError("User not found");
      }

      return mapPrismaUserToUser(user);
    } catch (error: unknown) {
      serverLogger.error("Error finding user by ID", error as Error);
      throw error;
    }
  }

  /**
   * Finds a user by email
   *
   * @param {string} email - The email of the user
   * @returns {Promise<User | null>} The user if found, otherwise null
   * @throws {NotFoundError} If the user is not found
   * @throws {Error} Any errors that occur while finding the user
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await db.user.findUnique({
        where: { email: email }
      });

      if (!user) {
        throw new NotFoundError("User not found");
      }

      return mapPrismaUserToUser(user);
    } catch (error: unknown) {
      serverLogger.error("Error finding user by email", error as Error);
      throw error;
    }
  }

  /**
   * Creates a user
   *
   * @param {User} user - The user to create
   * @returns {Promise<User>} The created user
   * @throws {BadRequestError} If the user is not created
   * @throws {Error} Any errors that occur while creating the user
   */
  async create(user: User): Promise<User> {
    try {
      const createdUser = await db.user.create({ data: user });

      if (!createdUser) {
        throw new BadRequestError("User not created");
      }

      return mapPrismaUserToUser(createdUser);
    } catch (error: unknown) {
      serverLogger.error("Error creating user", error as Error, { user });
      throw error;
    }
  }

  /**
   * Updates a user
   *
   * @param {string} id - The ID of the user
   * @param {User} user - The user to update
   * @returns {Promise<User>} The updated user
   * @throws {NotFoundError} If the user is not found
   * @throws {BadRequestError} If the user is not updated
   * @throws {Error} Any errors that occur while updating the user
   */
  async update(id: string, user: User): Promise<User> {
    try {
      const updatedUser = await db.user.update({
        where: { id },
        data: user
      });

      if (!updatedUser) {
        throw new BadRequestError("User not updated");
      }

      return mapPrismaUserToUser(updatedUser);
    } catch (error: unknown) {
      serverLogger.error("Error updating user", error as Error, { id, user });
      throw error;
    }
  }
}
