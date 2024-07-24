import { db } from "../database/prisma";
import { Notification } from "@prisma/client";
import { serverLogger } from "../logger";

export class NotificationRepository {
  /**
   * Creates a new notification record
   *
   * @param {Notification} notificationData - The notification data
   * @returns {Promise<Notification>} The created notification
   */
  async create(notificationData: Notification): Promise<Notification> {
    try {
      return await db.notification.create({
        data: { ...notificationData }
      });
    } catch (error: unknown) {
      serverLogger.error("Failed to create notification", error as Error, {
        notificationData
      });

      throw error;
    }
  }
}
