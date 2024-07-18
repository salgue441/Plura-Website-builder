import winston from "winston";
import { BaseLogger } from "./base-logger";
import { LogEntry, LogLevel } from "./logger.interface";

export class ServerLogger extends BaseLogger {
  private static instance: ServerLogger;
  private logger: winston.Logger;

  private constructor() {
    super();

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
      ),
      defaultMeta: { service: process.env.SERVICE_NAME || "api" },
      transports: [
        new winston.transports.File({
          filename: "logs/error.log",
          level: "error"
        }),
        new winston.transports.File({ filename: "logs/combined.log" })
      ]
    });

    if (process.env.NODE_ENV !== "production") {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        })
      );
    }
  }

  /**
   * Returns the singleton instance of the ServerLogger class.
   * If an instance does not exist, a new instance is created and returned.
   *
   * @returns The singleton instance of the ServerLogger class.
   */
  public static getInstance(): ServerLogger {
    if (!ServerLogger.instance) {
      ServerLogger.instance = new ServerLogger();
    }

    return ServerLogger.instance;
  }

  protected log(entry: LogEntry): void {
    const { level, message, meta, error } = entry;
    const logMethod = this.logger[
      level as keyof winston.Logger
    ] as winston.LeveledLogMethod;

    logMethod(message, { ...meta, error });
  }
}

export const serverLogger = ServerLogger.getInstance();
