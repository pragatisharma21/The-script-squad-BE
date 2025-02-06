import winston from 'winston'
import path from 'path'
import DailyRotateFile from 'winston-daily-rotate-file'

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `[${level.toUpperCase()}] ${timestamp} - ${message}`
})

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat,
  ),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: path.join('logs', 'app-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ],
})

export default logger
