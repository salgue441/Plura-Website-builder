import { InvitationStatus, Role } from "@prisma/client";
import type { Invitation } from "../models";
import { randomUUID } from "crypto";

export class InvitationFactory {
  /**
   * Creates a new invitation object
   *
   * @param {object} params - The parameters to create the invitation
   * @param {string} params.email - The email of the invitation
   * @param {string} params.role - The role of the invitation
   * @param {string} params.agencyId - The agency ID related to the invitation
   * @returns {Invitation} The created invitation
   */
  create(params: {
    email: string;
    role: string;
    agencyId: string;
  }): Invitation {
    return {
      id: randomUUID(),
      email: params.email,
      agencyId: params.agencyId,
      role: params.role as Role,
      status: InvitationStatus.PENDING
    };
  }
}
