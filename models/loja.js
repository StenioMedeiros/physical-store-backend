"use strict";
// models/loja.ts
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
exports.criarLoja = void 0;
const database_1 = __importDefault(require("../db/database")); // Importa a função de conexão
// Função para criar uma nova loja no banco de dados
const criarLoja = (loja) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
        INSERT INTO lojas (nome, logradouro, bairro, cidade, estado, numero,telefone, cep)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    const values = [
        loja.nome,
        loja.endereco.logradouro,
        loja.endereco.bairro,
        loja.endereco.cidade,
        loja.endereco.estado,
        loja.endereco.numero,
        loja.endereco.cep,
        loja.telefone,
    ];
    try {
        yield database_1.default.query(query, values);
        console.log('Loja criada com sucesso!');
    }
    catch (error) {
        console.error('Erro ao criar loja:', error);
    }
});
exports.criarLoja = criarLoja;
