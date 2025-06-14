// logger.ts
import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf, colorize } = format;

// Define log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create the logger
const logger = createLogger({
  format: combine(
    timestamp(),
    colorize(), // Colorize for console output
    logFormat
  ),
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // Log errors to file
    new transports.File({ filename: 'logs/app.log' }), // Log all messages to app.log
  ],
});

export default logger;
