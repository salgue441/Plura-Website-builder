import { db } from "../database/prisma";
import { serverLogger } from "../logger";

export class SubaccountRepository {
  /**
   * Finds the subaccount by agency
   *
   * @param {string} subaccountId - The subaccount ID
   * @returns {Promise<string | null>} The agency ID or null if not found
   * @throws {Error} If the subaccount cannot be found
   */
  async findSubaccountByAgency(subaccountId: string): Promise<string | null> {
    try {
      const subaccount = await db.subAccount.findUnique({
        where: { id: subaccountId },
        select: { agencyId: true }
      });

      return subaccount?.agencyId || null;
    } catch (error: unknown) {
      serverLogger.error(
        "Failed to find subaccount by agency",
        error as Error,
        {
          subaccountId
        }
      );

      throw error;
    }
  }
}
