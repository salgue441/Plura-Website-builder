/**
 * Data Transfer Object for creating a notification
 *
 * @class CreateNotificationDto
 *
 * @property {string} description - The description of the notification
 * @property {string} [agencyId] - The agency ID
 * @property {string} [subaccountId] - The subaccount ID
 */
export class CreateNotificationDto {
  description: string;
  agencyId?: string;
  subaccountId?: string;

  constructor(description: string, agencyId?: string, subaccountId?: string) {
    this.description = description;
    this.agencyId = agencyId;
    this.subaccountId = subaccountId;
  }
}
