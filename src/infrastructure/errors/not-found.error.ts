import { BaseError } from "./base/base-error";

/**
 * Not Found Error
 */
export class NotFoundError extends BaseError {
  constructor(message: string) {
    super("Not Found", message, 404);
  }
}
