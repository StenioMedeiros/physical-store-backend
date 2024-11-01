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
exports.deleteStoreService = deleteStoreService;
const database_1 = __importDefault(require("../../db/database"));
const logger_1 = require("../../utils/logger");
function deleteStoreService(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield database_1.default.query('DELETE FROM lojas WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            throw new Error('Loja não encontrada');
        }
        (0, logger_1.logInfo)(`Loja apagada com sucesso. ID: ${id}`);
    });
}
