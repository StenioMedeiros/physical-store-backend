
// utils/logger.ts
import { createLogger, format, transports } from 'winston';
const { combine, timestamp, json } = format;

// Logger para informações
const infoLogger = createLogger({
    level: 'info',  
    format: combine(timestamp(), json()),
    transports: [new transports.File({ filename: 'logs/info.json' })],
});

// Logger para conexões
const loggerConn = createLogger({
    level: 'info', 
    format: combine(timestamp(), json()),
    transports: [new transports.File({ filename: 'logs/connections.json' })],
});

// Logger para erros
const errorLogger = createLogger({
    level: 'error',  
    format: combine(timestamp(), json()),
    transports: [new transports.File({ filename: 'logs/error.json' })],
});

// Logger para avisos
const warnLogger = createLogger({
    level: 'warn', 
    format: combine(timestamp(), json()),
    transports: [new transports.File({ filename: 'logs/warn.json' })],
});

// Exportando os loggers
export { infoLogger, loggerConn, errorLogger, warnLogger };

// Funções de log simplificadas
export const logInfo = (message: string) => infoLogger.info(message);
export const logWarn = (message: string) => warnLogger.warn(message);
export const logError = (message: string) => errorLogger.error(message);
export const logConn = (message: string) => loggerConn.info(message);

