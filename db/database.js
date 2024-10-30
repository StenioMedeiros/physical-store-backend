"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conn = void 0;
// db/database.ts
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("c:/Users/ESTENIO/prog/estagio-compas/p1.2/E-commerce/bakend/utils/logger");
dotenv_1.default.config();
const pool = new pg_1.Pool({
    max: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
});
const conn = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield pool.connect();
        (0, logger_1.logConn)('Conectado ao banco de dados com sucesso');
        console.log('Conectado ao banco de dados com sucesso');
    }
    catch (error) {
        console.error('Erro ao conectar-se ao banco de dados', error);
        (0, logger_1.logError)(`Erro ao conectar-se ao banco de dados ${error instanceof Error ? error.message : error}`);
    }
});
exports.conn = conn;
(0, exports.conn)();
exports.default = pool;
