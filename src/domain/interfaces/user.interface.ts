import { User } from "@prisma/client";

/**
 * @interface IUserRepository
 */
export interface IUserRepository {
  create(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findBySubaccountId(
    agencyId: string,
    subaccountId: string
  ): Promise<User | null>;
}
