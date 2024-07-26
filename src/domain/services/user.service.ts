import type { User } from "../models";
import type { IUserRepository } from "../interfaces";
import { CreateUserDto } from "../dto";
import { BadRequestError, NotFoundError } from "@/infrastructure/errors";
import { UserFactory } from "../factories";

export class UserService {
  constructor(
    private userRepository: IUserRepository,
    private userFactory: UserFactory
  ) {}

  /**
   * Get a user by ID
   *
   * @param {string} userId - The ID of the user
   * @returns {Promise<User>} The user
   * @throws {NotFoundError} If the user is not found
   */
  async getUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  /**
   * Create a user
   *
   * @param {CreateUserDto} dto - The user data
   * @returns {Promise<User>} The created user
   * @throws {BadRequestError} If the user role is invalid
   */
  async createUser(dto: CreateUserDto): Promise<User> {
    if (dto.role === "AGENCY_OWNER") {
      throw new BadRequestError(
        "Cannot create agency owner through this method"
      );
    }

    const user = this.userFactory.create(dto);
    return await this.userRepository.create(user);
  }

  /**
   * Check if a user with the given email already exists
   *
   * @param {string} email - The email to check
   * @returns {Promise<boolean>} True if the user exists, otherwise false
   */
  async checkExistingUser(email: string): Promise<boolean> {
    return (await this.userRepository.findByEmail(email)) !== null;
  }
}
