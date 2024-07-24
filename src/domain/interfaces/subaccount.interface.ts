import { SubAccount } from "@prisma/client";

/**
 * @interface ISubaccountRepository
 */
export interface ISubaccountRepository {
  findSubaccountByAgency(subaccountId: string): Promise<string | null>;
}
