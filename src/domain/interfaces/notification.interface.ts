import { Notification } from "@prisma/client";

/**
 * @interface INotificationRepository
 */
export interface INotificationRepository {
  create(data: Omit<Notification, "id" | "updatedAt">): Promise<Notification>;
}
