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
const loja_1 = require("../models/loja");
const buscarEnderecoCep_1 = require("../services/buscarEnderecoCep");
const converterCep_1 = require("../services/converterCep");
const logger_1 = require("../utils/logger");
const pool = require('../db/database');
// Controlador de Loja
class LojaController {
    // Método para criar uma nova loja
    static createLoja(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome, endereco, telefone } = req.body;
                // Validação do campo "nome"
                if (!nome) {
                    logger_1.warnLogger.warn('Nome inválido ao tentar criar uma loja', { nome });
                    return res.status(400).json({ message: 'O campo "nome" é obrigatório.' });
                }
                // Validação do campo "cep"
                const isValidCep = (cep) => /^[0-9]{8}$/.test(cep);
                if (!endereco.cep || !isValidCep(endereco.cep)) {
                    logger_1.warnLogger.warn('CEP inválido ao tentar criar uma loja', { cep: endereco === null || endereco === void 0 ? void 0 : endereco.cep });
                    return res.status(400).json({ message: 'O campo "cep" é obrigatório e deve ser um CEP válido de 8 dígitos.' });
                }
                // Buscar o endereço completo pelo CEP utilizando a API ViaCEP
                const enderecoCompleto = yield (0, buscarEnderecoCep_1.buscarEnderecoCep)(endereco.cep);
                if (!enderecoCompleto) {
                    logger_1.warnLogger.warn('Endereço não encontrado para o CEP fornecido', { cep: endereco.cep });
                    return res.status(400).json({ message: 'CEP inválido ou não encontrado.' });
                }
                // Verificação dos campos obrigatórios
                const camposObrigatorios = ['logradouro', 'bairro', 'localidade', 'uf'];
                const camposPendentes = camposObrigatorios.filter(campo => !enderecoCompleto[campo]);
                if (camposPendentes.length > 0) {
                    return res.status(400).json({
                        message: `Os seguintes campos do endereço estão pendentes e precisam ser fornecidos: ${camposPendentes.join(', ')}`,
                        camposPendentes
                    });
                }
                const novoEndereco = {
                    logradouro: enderecoCompleto.logradouro || endereco.logradouro,
                    bairro: enderecoCompleto.bairro || endereco.bairro,
                    cidade: enderecoCompleto.localidade || endereco.cidade,
                    estado: enderecoCompleto.uf || endereco.estado,
                    cep: endereco.cep,
                    numero: endereco.numero
                };
                // Declaração da variável novasCoordenadas
                let novasCoordenadas;
                // Buscar as coordenadas do CEP da loja
                const coordenadasCepLoja = yield (0, converterCep_1.converterCepCoordenadas)(endereco.cep);
                if (!coordenadasCepLoja) {
                    logger_1.warnLogger.warn('Coordenadas não encontradas para o CEP fornecido.', { cep: endereco.cep });
                    if (!req.body.coordenadas || !req.body.coordenadas.latitude || !req.body.coordenadas.longitude) {
                        return res.status(400).json({ message: 'Coordenadas não encontradas para o CEP fornecido. Por favor, forneça latitude e longitude.' });
                    }
                    else {
                        const { latitude, longitude } = req.body.coordenadas;
                        novasCoordenadas = {
                            latitude,
                            longitude
                        };
                    }
                }
                else {
                    novasCoordenadas = {
                        latitude: coordenadasCepLoja.latitude,
                        longitude: coordenadasCepLoja.longitude
                    };
                }
                // Criar a loja no banco de dados
                yield (0, loja_1.criarLoja)({
                    nome,
                    endereco: Object.assign({}, novoEndereco),
                    telefone
                });
                logger_1.infoLogger.info('Loja criada com sucesso', { nome, endereco: novoEndereco });
                res.status(201).json({ message: 'Loja criada com sucesso' });
            }
            catch (err) {
                logger_1.errorLogger.error('Erro ao criar a loja', { error: err.message });
                res.status(500).json({ message: 'Erro ao criar a loja', error: err.message });
            }
            return res.status(201).json({ message: 'Loja criada com sucesso' });
        });
    }
}
exports.default = LojaController;
