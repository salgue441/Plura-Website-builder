/**
 * Data transfer object for creating an invitation
 *
 * @class CreateInvitationDto
 *
 * @property {string} email - The email of the user to invite
 * @property {string} role - The role of the user to invite
 * @property {string} agencyId - The ID of the agency to invite the user to
 */
export class CreateInvitationDto {
  email: string;
  role: string;
  agencyId: string;

  constructor(email: string, role: string, agencyId: string) {
    this.email = email;
    this.role = role;
    this.agencyId = agencyId;
  }
}
