import { Injectable } from "@nestjs/common";
import { Notification, User } from "@prisma/client";
import type {
  INotificationRepository,
  IUserRepository,
  ISubaccountRepository
} from "../interfaces";
import { CreateNotificationDto } from "../dtos";
import { NotificationFactory } from "../factories";
import { BadRequestError } from "@/infrastructure/errors";
import { serverLogger } from "@/infrastructure/logger";

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: INotificationRepository,
    private readonly userRepository: IUserRepository,
    private readonly subaccountRepository: ISubaccountRepository,
    private readonly notificationFactory: NotificationFactory
  ) {}

  /**
   * Creates a notification
   *
   * @version 1.0.0
   *
   * @param {CreateNotificationDto} dto - The notification data transfer object
   * @returns {Promise<Notification>} The created notification
   * @throws {BadRequestError} If the notification cannot be created
   * @throws {Error} If an unexpected error occurs
   */
  async createNotification(dto: CreateNotificationDto): Promise<Notification> {
    try {
      const user = await this.getUser(dto.agencyId, dto.subaccountId);
      const agencyId = await this.getAgencyId(dto.agencyId, dto.subaccountId);

      const notificationData = this.notificationFactory.create({
        description: dto.description,
        user: user,
        agencyId: agencyId,
        subaccountId: dto.subaccountId
      });

      return await this.notificationRepository.create(notificationData);
    } catch (error: unknown) {
      serverLogger.error("Failed to create notification", error as Error, {
        dto
      });

      throw new BadRequestError("Failed to create notification");
    }
  }

  /**
   * Gets the user based off either a specified agency ID or subaccount ID
   *
   * @private
   * @version 1.0.0
   *
   * @param {string} [agencyId] - The agency ID
   * @param {string} [subaccountId] - The subaccount ID
   * @returns {Promise<User>} The user
   * @throws {BadRequestError} If the user cannot be found
   */
  private async getUser(
    agencyId?: string,
    subaccountId?: string
  ): Promise<User> {
    const user = await this.userRepository.findBySubaccountId(
      agencyId as string,
      subaccountId as string
    );

    if (!user) {
      throw new BadRequestError("User not found");
    }

    return user;
  }

  /**
   * Gets the agency ID based off either a specified agency ID or subaccount ID
   *
   * @private
   * @version 1.0.0
   *
   * @param {string} [agencyId] - The agency ID
   * @param {string} [subaccountId] - The subaccount ID
   * @returns {Promise<string>} The agency ID
   * @throws {BadRequestError} If the agency cannot be found
   */
  private async getAgencyId(
    agencyId?: string,
    subaccountId?: string
  ): Promise<string> {
    if (agencyId) return agencyId;

    if (subaccountId) {
      const subaccount =
        await this.subaccountRepository.findSubaccountByAgency(subaccountId);

      if (subaccount) return subaccount;
    }

    throw new BadRequestError("Agency not found");
  }
}
