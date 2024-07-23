/**
 * Represents a base error class that extends the built-in Error class.
 */
export class BaseError extends Error {
  public statusCode: number;

  /**
   * Creates an instance of BaseError.
   * @param name - The name of the error.
   * @param message - The error message.
   * @param statusCode - The HTTP status code associated with the error.
   */
  constructor(name: string, message: string, statusCode: number) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.statusCode = statusCode;

    Error.captureStackTrace(this);
  }

  /**
   * Converts the error object to a JSON representation.
   * @returns The JSON representation of the error object.
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode
    };
  }
}
