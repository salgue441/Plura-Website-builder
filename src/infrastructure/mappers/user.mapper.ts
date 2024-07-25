import { User as ClerkUser } from "@clerk/nextjs/server";
import { User as PrismaUser, Role } from "@prisma/client";
import { CreateUserDto } from "@/domain/dtos";

/**
 * Maps a Clerk user to a Prisma user.
 *
 * @param {ClerkUser} clerkUser - The Clerk user to map.
 * @param {CreateUserDto} dto - The DTO to map.
 * @returns {PrismaUser} The mapped Prisma user.
 */
export function mapClerkUserToPrismaUser(
  clerkUser: ClerkUser,
  dto: CreateUserDto
): PrismaUser {
  return {
    id: clerkUser.id,
    name: clerkUser.fullName || "",
    email: clerkUser.emailAddresses[0].emailAddress,
    avatarUrl: clerkUser.imageUrl,
    agencyId: dto.agencyId,
    role: dto.role as Role,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}
