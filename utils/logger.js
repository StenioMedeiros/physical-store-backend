"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logConn = exports.logError = exports.logWarn = exports.logInfo = void 0;
// utils/logger.ts
const winston_1 = require("winston");
const { combine, timestamp, json } = winston_1.format;
// Logger para informações
const infoLogger = (0, winston_1.createLogger)({
    level: 'info',
    format: combine(timestamp(), json()),
    transports: [new winston_1.transports.File({ filename: 'logs/info.json' })],
});
// Logger para conexões
const loggerConn = (0, winston_1.createLogger)({
    level: 'info',
    format: combine(timestamp(), json()),
    transports: [new winston_1.transports.File({ filename: 'logs/connections.json' })],
});
// Logger para erros
const errorLogger = (0, winston_1.createLogger)({
    level: 'error',
    format: combine(timestamp(), json()),
    transports: [new winston_1.transports.File({ filename: 'logs/error.json' })],
});
// Logger para avisos
const warnLogger = (0, winston_1.createLogger)({
    level: 'warn',
    format: combine(timestamp(), json()),
    transports: [new winston_1.transports.File({ filename: 'logs/warn.json' })],
});
// Exportando os loggers
//export { infoLogger, loggerConn, errorLogger, warnLogger };
// Funções de log simplificadas
const logInfo = (message) => infoLogger.info(message);
exports.logInfo = logInfo;
const logWarn = (message) => warnLogger.warn(message);
exports.logWarn = logWarn;
const logError = (message) => errorLogger.error(message);
exports.logError = logError;
const logConn = (message) => loggerConn.info(message);
exports.logConn = logConn;
