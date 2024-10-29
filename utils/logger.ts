// utils/logger.ts
import { createLogger, format, transports } from 'winston';
const { combine, timestamp, json } = format;

const infoLogger = createLogger({
    format: combine(timestamp(), json()),
    transports: [new transports.File({ filename: 'logs/info.json' })],
});

const loggerConn = createLogger({
    format: combine(timestamp(), json()),
    transports: [new transports.File({ filename: 'logs/connections.json' })],
});

const errorLogger = createLogger({
    format: combine(timestamp(), json()),
    transports: [new transports.File({ filename: 'logs/error.json' })],
});

const warnLogger = createLogger({
    format: combine(timestamp(), json()),
    transports: [new transports.File({ filename: 'logs/warn.json' })],
});

export { infoLogger, loggerConn, errorLogger, warnLogger };