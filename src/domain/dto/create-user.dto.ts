/**
 * Data Transfer Object for creating a new user
 *
 * @class CreateUserDto
 *
 * @property {string} name - The user's name
 * @property {string} email - The user's email
 * @property {string} avatarUrl - The user's avatar URL
 * @property {UUID} agencyId - The agency ID related to the user
 * @property {string} role - The user's role
 * @property {Date} [createdAt] - The user's creation date
 */
export class CreateUserDto {
  name: string;
  email: string;
  avatarUrl: string;
  agencyId: string;
  role: string;
  createdAt?: Date;

  constructor(
    name: string,
    email: string,
    avatarUrl: string,
    agencyId: string,
    role: string,
    createdAt?: Date
  ) {
    this.name = name;
    this.email = email;
    this.avatarUrl = avatarUrl;
    this.agencyId = agencyId;
    this.role = role;
    this.createdAt = createdAt;
  }
}
