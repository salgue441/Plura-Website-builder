import { Role } from "@prisma/client";
import type { User } from "../models";
import { randomUUID } from "crypto";

export class UserFactory {
  /**
   * Creates a new user object
   *
   * @param {object} params - The parameters to create the user
   * @param {string} params.name - The name of the user
   * @param {string} params.email - The email of the user
   * @param {string} params.avatarUrl - The avatar URL of the user
   * @param {string} params.agencyId - The agency ID related to the user
   * @param {string} params.role - The role of the user
   * @param {string} [params.createdAt] - The creation date of the user
   * @returns {Omit<User, "updatedAt">} The created user
   */
  create(params: {
    name: string;
    email: string;
    avatarUrl: string;
    agencyId: string;
    role: string;
    createdAt?: Date;
  }): Omit<User, "updatedAt"> {
    return {
      id: randomUUID(),
      name: params.name,
      email: params.email,
      avatarUrl: params.avatarUrl,
      agencyId: params.agencyId,
      role: params.role as Role,
      createdAt: params.createdAt ?? new Date()
    };
  }
}
