import { Invitation } from "@/domain/models";
import { Invitation as PrismaInvitation } from "@prisma/client";

export function mapPrismaInvitationToInvitation(
  prismaInvitation: PrismaInvitation
): Invitation {
  return {
    id: prismaInvitation.id,
    email: prismaInvitation.email,
    role: prismaInvitation.role,
    agencyId: prismaInvitation.agencyId as string,
    status: prismaInvitation.status
  };
}
