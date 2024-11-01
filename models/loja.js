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
exports.createStoreInDB = void 0;
exports.searchStoreID = searchStoreID;
exports.updateStoreInDB = updateStoreInDB;
// models/loja.ts
const database_1 = __importDefault(require("../db/database"));
// Função para criar uma nova loja no banco de dados
const createStoreInDB = (loja) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
        INSERT INTO lojas (nome, logradouro, bairro, cidade, estado, numero,telefone, cep, latitude, longitude)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;
    const values = [
        loja.nome,
        loja.endereco.logradouro,
        loja.endereco.bairro,
        loja.endereco.cidade,
        loja.endereco.estado,
        loja.endereco.numero,
        loja.telefone,
        loja.endereco.cep,
        loja.coordenadas.latitude,
        loja.coordenadas.longitude,
    ];
    try {
        yield database_1.default.query(query, values);
        console.log('Loja criada com sucesso!');
    }
    catch (error) {
        console.error('Erro ao criar loja:', error);
    }
});
exports.createStoreInDB = createStoreInDB;
// Função para buscar loja pelo ID
function searchStoreID(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'SELECT * FROM lojas WHERE id = $1';
        const values = [id];
        try {
            const result = yield database_1.default.query(query, values);
            return result.rows[0];
        }
        catch (error) {
            console.error('Erro ao buscar a loja:', error);
            throw error;
        }
    });
}
function updateStoreInDB(id, novosDados) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(novosDados, id);
        const fields = [];
        const values = [];
        let index = 1;
        if (novosDados.nome) {
            fields.push(`nome = $${index++}`);
            values.push(novosDados.nome);
        }
        if (novosDados.endereco) {
            if (novosDados.endereco.logradouro) {
                fields.push(`logradouro = $${index++}`);
                values.push(novosDados.endereco.logradouro);
            }
            if (novosDados.endereco.bairro) {
                fields.push(`bairro = $${index++}`);
                values.push(novosDados.endereco.bairro);
            }
            if (novosDados.endereco.cidade) {
                fields.push(`cidade = $${index++}`);
                values.push(novosDados.endereco.cidade);
            }
            if (novosDados.endereco.estado) {
                fields.push(`estado = $${index++}`);
                values.push(novosDados.endereco.estado);
            }
            if (novosDados.endereco.numero) {
                fields.push(`numero = $${index++}`);
                values.push(novosDados.endereco.numero);
            }
            if (novosDados.endereco.cep) {
                fields.push(`cep = $${index++}`);
                values.push(novosDados.endereco.cep);
            }
        }
        if (novosDados.coordenadas) {
            if (novosDados.coordenadas.latitude) {
                fields.push(`latitude = $${index++}`);
                values.push(novosDados.coordenadas.latitude);
            }
            if (novosDados.coordenadas.longitude) {
                fields.push(`longitude = $${index++}`);
                values.push(novosDados.coordenadas.longitude);
            }
        }
        if (novosDados.telefone) {
            fields.push(`telefone = $${index++}`);
            values.push(novosDados.telefone);
        }
        if (fields.length === 0) {
            throw new Error('Nenhum campo para atualizar.');
        }
        console.log(fields.join(', '), values);
        const query = `UPDATE lojas SET ${fields.join(', ')} WHERE id = $${index}`;
        values.push(id);
        yield database_1.default.query(query, values);
    });
}
