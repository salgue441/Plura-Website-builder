import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { IUserRepository } from "../interfaces";
import { CreateUserDto } from "../dtos";
import { UserFactory } from "../factories";
import { NotFoundError, UnauthorizedError } from "@/infrastructure/errors";
import { serverLogger } from "@/infrastructure/logger";

export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userFactory: UserFactory,
    private readonly currentUser: User
  ) {}

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
  async createTeamUser(dto: CreateUserDto): Promise<User | null> {
    if (dto.role === "AGENCY_OWNER") {
      throw new UnauthorizedError("Agency owners cannot be team members");
    }

    try {
      const userData = await this.userFactory.create(dto);
      return await this.userRepository.create(userData);
    } catch (error: unknown) {
      serverLogger.error("Failed to create team user", error as Error, {
        dto
      });
      throw error;
    }
  }

  /**
   * Checks if the user exists based off the email address
   *
   * @param {string} email - The email address
   * @returns {Promise<User | null>} The user or null if not found
   * @throws {NotFoundError} If the user cannot be found
   * @throws {Error} If the user details cannot be retrieved
   */
  async checkExistingUser(email: string): Promise<User | null | undefined> {
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
