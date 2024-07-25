import { Invitation } from "@prisma/client";

/**
 * @interface IInvitationRepository
 */
export interface IInvitationRepository {
  getInvitationByEmail(email: string): Promise<Invitation | null>;
  updateInvitationStatus(
    id: string,
    status: string
  ): Promise<Invitation | null>;
}
