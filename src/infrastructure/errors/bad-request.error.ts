import { BaseError } from "./base/base-error";

/**
 * Not Found Error
 */
export class BadRequestError extends BaseError {
  constructor(message: string) {
    super("Bad Request", message, 400);
  }
}
