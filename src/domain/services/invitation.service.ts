import type { Invitation } from "../models";
import type { IInvitationRepository, IUserRepository } from "../interfaces";
import { InvitationFactory } from "../factories";
import { BadRequestError, NotFoundError } from "@/infrastructure/errors";
import { CreateInvitationDto } from "../dto";

export class InvitationService {
  constructor(
    private invitationRepository: IInvitationRepository,
    private userRepository: IUserRepository,
    private invitationFactory: InvitationFactory
  ) {}

  /**
   * Creates a new invitation and returns it
   *
   * @param {CreateInvitationDto} dto - The data to create the invitation with
   * @returns {Promise<Invitation>} The created invitation
   * @throws {BadRequestError} If a user with the email already exists
   */
  async createInvitation(dto: CreateInvitationDto): Promise<Invitation> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestError("User with this email already exists");
    }

    const invitation = this.invitationFactory.create(dto);
    return await this.invitationRepository.create(invitation);
  }

  /**
   * Accepts an invitation and assigns the user to the agency
   *
   * @param {string} id - The ID of the invitation
   * @param {string} userId - The ID of the user to accept the invitation for
   * @returns {Promise<void>}
   * @throws {NotFoundError} If the invitation or user is not found
   * @throws {BadRequestError} If the invitation has already been accepted
   * @throws {BadRequestError} If the email does not match the invitation email
   */
  async acceptInvitation(id: string, userId: string): Promise<void> {
    const invitation = await this.invitationRepository.findById(id);
    if (!invitation) {
      throw new NotFoundError("Invitation not found");
    }

    if (invitation.status !== "PENDING") {
      throw new BadRequestError("Invitation has already been accepted");
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.email !== invitation.email) {
      throw new BadRequestError("User email does not match invitation email");
    }

    await Promise.all([
      this.invitationRepository.updateStatus(id, "ACCEPTED"),
      this.userRepository.update(userId, {
        ...user,
        role: invitation.role,
        agencyId: invitation.agencyId
      })
    ]);
  }
}
