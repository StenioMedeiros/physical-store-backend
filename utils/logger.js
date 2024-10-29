"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warnLogger = exports.errorLogger = exports.loggerConn = exports.infoLogger = void 0;
// utils/logger.ts
const winston_1 = require("winston");
const { combine, timestamp, json } = winston_1.format;
const infoLogger = (0, winston_1.createLogger)({
    format: combine(timestamp(), json()),
    transports: [new winston_1.transports.File({ filename: 'logs/info.json' })],
});
exports.infoLogger = infoLogger;
const loggerConn = (0, winston_1.createLogger)({
    format: combine(timestamp(), json()),
    transports: [new winston_1.transports.File({ filename: 'logs/connections.json' })],
});
exports.loggerConn = loggerConn;
const errorLogger = (0, winston_1.createLogger)({
    format: combine(timestamp(), json()),
    transports: [new winston_1.transports.File({ filename: 'logs/error.json' })],
});
exports.errorLogger = errorLogger;
const warnLogger = (0, winston_1.createLogger)({
    format: combine(timestamp(), json()),
    transports: [new winston_1.transports.File({ filename: 'logs/warn.json' })],
});
exports.warnLogger = warnLogger;
