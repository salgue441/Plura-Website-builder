import { ILogger, LogLevel, LogEntry } from "./logger.interface"

export abstract class BaseLogger implements ILogger {
  protected abstract log(entry: LogEntry): void

  /**
   * Creates a log entry
   *
   * @param level: LogLevel - The log level
   * @param message: string - The message to log
   * @param meta: Record<string, unknown> - Additional metadata to log
   * @param error: Error - The error to log
   *
   * @returns LogEntry - The log entry object
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    meta?: Record<string, unknown>,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level: level,
      message: message,
      meta: meta,
      error: error,
    }
  }

  /**
   * Used to log debug messages
   *
   * @param message: string - The message to log
   * @param meta: Record<string, unknown> - Additional metadata to log
   */
  debug(message: string, meta?: Record<string, unknown> | undefined): void {
    this.log(this.createLogEntry(LogLevel.DEBUG, message, meta))
  }

  /**
   * Used to log info messages
   *
   * @param message: string - The message to log
   * @param meta: Record<string, unknown> - Additional metadata to log
   */
  info(message: string, meta?: Record<string, unknown> | undefined): void {
    this.log(this.createLogEntry(LogLevel.INFO, message, meta))
  }

  /**
   * Used to log warning messages
   *
   * @param message: string - The message to log
   * @param meta: Record<string, unknown> - Additional metadata to log
   */
  warn(message: string, meta?: Record<string, unknown> | undefined): void {
    this.log(this.createLogEntry(LogLevel.WARN, message, meta))
  }

  /**
   * Used to log error messages
   *
   * @param message: string - The message to log
   * @param error: Error - The error to log
   * @param meta: Record<string, unknown> - Additional metadata to log
   */
  error(
    message: string,
    error?: Error | undefined,
    meta?: Record<string, unknown> | undefined
  ): void {
    this.log(this.createLogEntry(LogLevel.ERROR, message, meta, error))
  }
}
