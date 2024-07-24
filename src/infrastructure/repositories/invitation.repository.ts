import { Invitation, InvitationStatus } from "@prisma/client";
import { db } from "../database/prisma";
import { serverLogger } from "../logger";

export class InvitationRepository {
  /**
   * Gets an invitation by email
   *
   * @param {string} email - The email address to search for
   * @returns {Promise<Invitation | null>} The invitation record
   */
  async getInvitationByEmail(email: string): Promise<Invitation | null> {
    try {
      return await db.invitation.findUnique({
        where: { email: email, status: "PENDING" }
      });
    } catch (error: unknown) {
      serverLogger.error("Failed to find invitation by email", error as Error, {
        email
      });

      throw error;
    }
  }

  /**
   * Creates a new invitation
   *
   * @param {Invitation} invitation - The invitation object
   * @returns {Promise<Invitation | null>} The created invitation
   */
  async updateInvitationStatus(
    id: string,
    status: InvitationStatus
  ): Promise<Invitation | null> {
    try {
      return await db.invitation.update({
        where: { id },
        data: { status }
      });
    } catch (error: unknown) {
      serverLogger.error("Failed to update invitation status", error as Error, {
        id,
        status
      });

      throw error;
    }
  }
}
