import { BaseError } from "./base/base-error";

/**
 * Unauthorized Error
 */
export class UnauthorizedError extends BaseError {
  constructor(message: string) {
    super("UnauthorizedError", message, 401);
  }
}
