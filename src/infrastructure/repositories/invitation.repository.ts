import { db } from "../database/prisma";
import type { IInvitationRepository } from "@/domain/interfaces";
import type { Invitation } from "@/domain/models";
import { mapPrismaInvitationToInvitation } from "../mappers/invitation.mapper";
import { BadRequestError, NotFoundError } from "../errors";
import { serverLogger } from "../logger";
import type { InvitationStatus } from "@prisma/client";

export class InvitationRepository implements IInvitationRepository {
  /**
   * Finds an invitation by ID
   *
   * @param {string} id - The ID of the invitation
   * @returns {Promise<Invitation | null>} The invitation if found,
   *                                       otherwise null
   * @throws {NotFoundError} If the invitation is not found
   * @throws {Error} Any errors that occur while finding the invitation
   */
  async findById(id: string): Promise<Invitation | null> {
    try {
      const invitation = await db.invitation.findUnique({
        where: {
          id
        }
      });

      if (!invitation) {
        throw new NotFoundError("Invitation not found");
      }

      return mapPrismaInvitationToInvitation(invitation);
    } catch (error: unknown) {
      serverLogger.error("Error finding invitation by ID", error as Error);
      throw error;
    }
  }

  /**
   * Finds an invitation by email
   *
   * @param {string} email - The email of the invitation
   * @returns {Promise<Invitation | null>} The invitation if found,
   *                                       otherwise null
   * @throws {NotFoundError} If the invitation is not found
   * @throws {Error} Any errors that occur while finding the invitation
   */
  async findByEmail(email: string): Promise<Invitation | null> {
    try {
      const invitation = await db.invitation.findUnique({
        where: { email: email }
      });

      if (!invitation) {
        throw new NotFoundError("Invitation not found");
      }

      return mapPrismaInvitationToInvitation(invitation);
    } catch (error: unknown) {
      serverLogger.error("Error finding invitation by email", error as Error);
      throw error;
    }
  }

  /**
   * Creates an invitation
   *
   * @param {Invitation} invitation - The invitation to create
   * @returns {Promise<Invitation>} The created invitation
   * @throws {BadRequestError} If the invitation could not be created
   * @throws {Error} Any errors that occur while creating the invitation
   */
  async create(invitation: Invitation): Promise<Invitation> {
    try {
      const createdInvitation = await db.invitation.create({
        data: {
          id: invitation.id,
          email: invitation.email,
          role: invitation.role,
          agencyId: invitation.agencyId
        }
      });

      if (!createdInvitation) {
        throw new BadRequestError("Invitation not created");
      }

      return mapPrismaInvitationToInvitation(createdInvitation);
    } catch (error: unknown) {
      serverLogger.error("Error creating invitation", error as Error);
      throw error;
    }
  }

  /**
   * Updates the status of an invitation
   *
   * @param {string} id - The ID of the invitation
   * @param {InvitationStatus} status - The new status of the invitation
   * @returns {Promise<Invitation>} The updated invitation
   * @throws {NotFoundError} If the invitation is not found
   * @throws {Error} Any errors that occur while updating the invitation
   */
  async updateStatus(
    id: string,
    status: InvitationStatus
  ): Promise<Invitation> {
    try {
      const updatedInvitation = await db.invitation.update({
        where: { id },
        data: { status }
      });

      if (!updatedInvitation) {
        throw new BadRequestError("Invitation not updated");
      }

      return mapPrismaInvitationToInvitation(updatedInvitation);
    } catch (error: unknown) {
      serverLogger.error("Error updating invitation status", error as Error);
      throw error;
    }
  }
}
