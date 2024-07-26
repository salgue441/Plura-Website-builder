import { User } from "@/domain/models";
import { User as PrismaUser } from "@prisma/client";

export function mapPrismaUserToUser(prismaUser: PrismaUser): User {
  return {
    id: prismaUser.id,
    name: prismaUser.name,
    email: prismaUser.email,
    avatarUrl: prismaUser.avatarUrl,
    role: prismaUser.role,
    agencyId: prismaUser.agencyId as string,
    createdAt: prismaUser.createdAt
  };
}
