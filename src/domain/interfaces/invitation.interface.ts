import { Invitation } from "@prisma/client";

/**
 * @interface IInvitationRepository
 */
export interface IInvitationRepository {
  getInivitationByEmail(email: string): Promise<Invitation | null>;
  updateInvitationStatus(
    id: string,
    status: string,
    transaction?: any
  ): Promise<void>;
}
