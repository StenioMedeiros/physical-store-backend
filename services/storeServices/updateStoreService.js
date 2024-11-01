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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStoreService = updateStoreService;
const loja_1 = require("../../models/loja");
const converterCep_1 = require("../converterCep");
const logger_1 = require("../../utils/logger");
function updateStoreService(id, body) {
    return __awaiter(this, void 0, void 0, function* () {
        const { nome, telefone, endereco: { logradouro, bairro, cidade, estado, numero, cep } = {} } = body;
        // Buscar a loja pelo ID
        const loja = yield (0, loja_1.searchStoreID)(id);
        if (!loja) {
            (0, logger_1.logWarn)(`Loja não encontrada. ID: ${id}`);
            throw new Error('Loja não encontrada.');
        }
        // Criar um objeto de atualização somente com os campos definidos
        const novosDados = {};
        // Atualizar endereço se algum campo for fornecido
        if (logradouro || bairro || cidade || estado || numero || cep) {
            novosDados.endereco = {
                logradouro: logradouro || "",
                bairro: bairro || "",
                cidade: cidade || "",
                estado: estado || "",
                numero: numero || "",
                cep: cep || ""
            };
            // Obter coordenadas baseadas no CEP, se fornecido
            if (cep) {
                const coordenadasCepLoja = yield (0, converterCep_1.convertCepInCoordinate)(cep);
                if (!coordenadasCepLoja) {
                    (0, logger_1.logWarn)(`Coordenadas não encontradas para o CEP: ${cep}`);
                    const { latitude, longitude } = body.coordenadas || {};
                    if (!latitude || !longitude) {
                        throw new Error('Coordenadas não encontradas para o CEP fornecido. Por favor, forneça latitude e longitude.');
                    }
                    novosDados.coordenadas = { latitude, longitude };
                }
                else {
                    novosDados.coordenadas = {
                        latitude: coordenadasCepLoja.lat,
                        longitude: coordenadasCepLoja.lng
                    };
                }
            }
        }
        // Atualizar nome e telefone, se fornecidos
        if (nome)
            novosDados.nome = nome;
        if (telefone)
            novosDados.telefone = telefone;
        // Atualizar a loja com os dados fornecidos
        const lojaAtualizada = yield (0, loja_1.updateStoreInDB)(id, novosDados);
        (0, logger_1.logInfo)(`Loja atualizada com sucesso. ID: ${id}, Novos dados: ${JSON.stringify(novosDados)}`);
        return lojaAtualizada;
    });
}
