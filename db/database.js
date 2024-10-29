"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const logger = __importStar(require("c:/Users/ESTENIO/prog/estagio-compas/p1.2/E-commerce/bakend/utils/logger"));
const dotenv_1 = __importDefault(require("dotenv"));
const console_1 = require("console");
dotenv_1.default.config();
const pool = new pg_1.Pool({
    max: 10, // Equivalente a connectionLimit no MySQL
    host: process.env.DB_HOST,
    user: process.env.DB_USER, // Substitua pelo usuário do PostgreSQL
    password: process.env.DB_PASS, // Substitua pela senha do PostgreSQL, se houver
    database: process.env.DB_NAME, // Nome do banco de dados
    port: Number(process.env.DB_PORT), // Porta padrão do PostgreSQL
    // URL de conexão com o PostgreSQL
});
const conn = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield pool.connect();
        logger.loggerConn.info('Conectado ao banco de dados com sucesso');
        console.log('Conectado ao banco de dados com sucesso');
    }
    catch (err) {
        console.error('Erro ao conectar-se ao banco de dados', err);
        logger.loggerConn.error('Erro ao conectar-se ao banco de dados', console_1.error, err.message);
    }
});
exports.conn = conn;
(0, exports.conn)();
exports.default = pool;
