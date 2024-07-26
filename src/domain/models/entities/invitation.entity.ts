import { InvitationStatus, Role } from "@prisma/client";

export interface Invitation {
  id: string;
  email: string;
  role: Role;
  agencyId: string;
  status: InvitationStatus;
}
