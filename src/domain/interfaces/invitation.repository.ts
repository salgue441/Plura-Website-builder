import { Invitation } from "../models";

export interface IInvitationRepository {
  findById(id: string): Promise<Invitation | null>;
  findByEmail(email: string): Promise<Invitation | null>;
  create(invitation: Invitation): Promise<Invitation>;
  updateStatus(id: string, status: Invitation["status"]): Promise<Invitation>;
}
