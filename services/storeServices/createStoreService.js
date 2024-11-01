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
exports.createStoreService = createStoreService;
const buscarEnderecoCep_1 = require("../buscarEnderecoCep");
const converterCep_1 = require("../converterCep");
const logger_1 = require("../../utils/logger");
const loja_1 = require("../../models/loja");
function createStoreService(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { nome, endereco, telefone, coordenadas } = data;
        if (!nome) {
            (0, logger_1.logWarn)('Nome inválido ao tentar criar uma loja');
            throw new Error('O campo "nome" é obrigatório.');
        }
        const isValidCep = (cep) => /^[0-9]{8}$/.test(cep);
        if (!endereco.cep || !isValidCep(endereco.cep)) {
            (0, logger_1.logWarn)(`CEP inválido ao tentar criar uma loja: ${endereco.cep}`);
            throw new Error('O campo "cep" é obrigatório e deve ser um CEP válido de 8 dígitos.');
        }
        const enderecoCompleto = yield (0, buscarEnderecoCep_1.searchAddressCep)(endereco.cep);
        if (!enderecoCompleto) {
            (0, logger_1.logWarn)(`Endereço não encontrado para o CEP fornecido: ${endereco.cep}`);
            throw new Error('CEP inválido ou não encontrado.');
        }
        const novoEndereco = {
            logradouro: enderecoCompleto.logradouro || endereco.logradouro,
            bairro: enderecoCompleto.bairro || endereco.bairro,
            cidade: enderecoCompleto.localidade || endereco.cidade,
            estado: enderecoCompleto.uf || endereco.estado,
            cep: endereco.cep,
            numero: endereco.numero
        };
        const camposObrigatorios = ['logradouro', 'bairro', 'cidade', 'estado'];
        const camposPendentes = camposObrigatorios.filter(campo => !novoEndereco[campo]);
        if (camposPendentes.length > 0) {
            throw new Error(`Os seguintes campos do endereço estão pendentes e precisam ser fornecidos: ${camposPendentes.join(', ')}`);
        }
        let novasCoordenadas = coordenadas;
        if (!coordenadas) {
            const coordenadasCepLoja = yield (0, converterCep_1.convertCepInCoordinate)(endereco.cep);
            if (!coordenadasCepLoja) {
                (0, logger_1.logWarn)(`Coordenadas não encontradas para o CEP fornecido: ${endereco.cep}`);
                throw new Error('Coordenadas não encontradas para o CEP fornecido. Por favor, forneça latitude e longitude.');
            }
            novasCoordenadas = {
                latitude: coordenadasCepLoja.lat,
                longitude: coordenadasCepLoja.lng
            };
        }
        yield (0, loja_1.createStoreInDB)({
            nome,
            endereco: novoEndereco,
            coordenadas: novasCoordenadas,
            telefone
        });
        (0, logger_1.logInfo)(`Loja criada com sucesso. Nome: ${nome}, Endereço: ${JSON.stringify(novoEndereco)}`);
        return { message: 'Loja criada com sucesso' };
    });
}
