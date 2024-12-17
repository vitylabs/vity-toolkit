import { createLogger, format, transports } from "winston";

const logger = createLogger({
    level: process.env.LOG_LEVEL || "info", // Default to "info" if LOG_LEVEL is not set
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }), // Include stack traces for errors
        format.json() // JSON format for structured logging in files
    ),
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(), // Add colors to the console output
                format.printf(({ level, message, timestamp, stack }) => {
                    // Check if the message is an object, and stringify it for console logging
                    const msg =
                        typeof message === "object"
                            ? JSON.stringify(message, null, 2) // Pretty-print object
                            : message;

                    const base = `${timestamp} [${level}]: ${msg}`;
                    return stack ? `${base}\n${stack}` : base;
                })
            ),
        }),
        new transports.File({ filename: "logs/app.log", level: "info" }),
        new transports.File({ filename: "logs/errors.log", level: "error" }),
    ],
});

export default logger;
