import { Injectable } from "@nestjs/common";
import { Notification, User } from "@prisma/client";

/**
 * Factory for creating notifications for users and agencies
 *
 * @class NotificationFactory
 */
@Injectable()
export class NotificationFactory {
  /**
   * Creates a notification
   *
   * @param {object} params - The parameters to create the notification
   * @param {string} params.description - The description of the notification
   * @param {User} params.user - The user to create the notification for
   * @param {string} [params.agencyId] - The agency ID
   * @param {string} [params.subaccountId] - The subaccount ID
   * @returns {Omit<Notification, "id" | "updatedAt">} The created notification
   */
  create(params: {
    description: string;
    user: User;
    agencyId?: string;
    subaccountId?: string;
  }): Omit<Notification, "id" | "updatedAt"> {
    return {
      notification: `${params.user.name} | ${params.description}`,
      userId: params.user.id,
      agencyId: params.agencyId?.toString() ?? "",
      subAccountId: params.subaccountId?.toString() ?? "",
      createdAt: new Date()
    };
  }
}
