import { BaseLogger } from "./base-logger"
import { LogEntry, LogLevel } from "./logger.interface"

export class ClientLogger extends BaseLogger {
  private static instance: ClientLogger
  private constructor() {
    super()
  }

  /**
   * Returns the singleton instance of the ClientLogger class.
   * If an instance does not exist, a new instance is created and returned.
   *
   * @returns The singleton instance of the ClientLogger class.
   */
  public static getInstance(): ClientLogger {
    if (!ClientLogger.instance) {
      ClientLogger.instance = new ClientLogger()
    }

    return ClientLogger.instance
  }

  /**
   * Logs the specified log entry.
   * @param entry - The log entry to be logged.
   */
  protected log(entry: LogEntry): void {
    const { timestamp, level, message, meta, error } = entry
    const consoleMethod = this.getConsoleMethod(level)
    const logParts = [`[${timestamp}] [${level.toUpperCase()}]: ${message}`]

    if (meta) logParts.push(JSON.stringify(meta))
    if (error) logParts.push(error.stack || error.message)

    consoleMethod.apply(console, logParts)
  }

  /**
   * Returns the appropriate console method based on the log level.
   * @param level - The log level.
   *
   * @returns The console method to be used for logging.
   */
  private getConsoleMethod(level: LogLevel): (...data: any[]) => void {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug

      case LogLevel.INFO:
        return console.info

      case LogLevel.WARN:
        return console.warn

      case LogLevel.ERROR:
        return console.error

      default:
        return console.log
    }
  }
}

export const clientLogger = ClientLogger.getInstance()
