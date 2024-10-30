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
                if (!nome) {
                    logger_1.warnLogger.warn('Nome inválido ao tentar criar uma loja', { nome });
                    return res.status(400).json({ message: 'O campo "nome" é obrigatório.' });
                }
                const isValidCep = (cep) => /^[0-9]{8}$/.test(cep);
                if (!endereco.cep || !isValidCep(endereco.cep)) {
                    logger_1.warnLogger.warn('CEP inválido ao tentar criar uma loja', { cep: endereco === null || endereco === void 0 ? void 0 : endereco.cep });
                    return res.status(400).json({ message: 'O campo "cep" é obrigatório e deve ser um CEP válido de 8 dígitos.' });
                }
                const enderecoCompleto = yield (0, buscarEnderecoCep_1.buscarEnderecoCep)(endereco.cep);
                if (!enderecoCompleto) {
                    logger_1.warnLogger.warn('Endereço não encontrado para o CEP fornecido', { cep: endereco.cep });
                    return res.status(400).json({ message: 'CEP inválido ou não encontrado.' });
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
                    return res.status(400).json({
                        message: `Os seguintes campos do endereço estão pendentes e precisam ser fornecidos: ${camposPendentes.join(', ')}`,
                        camposPendentes
                    });
                }
                let novasCoordenadas;
                // Buscar as coordenadas do CEP        
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
                        latitude: coordenadasCepLoja.lat,
                        longitude: coordenadasCepLoja.lng
                    };
                }
                // Criar a loja no banco de dados
                yield (0, loja_1.criarLoja)({
                    nome,
                    endereco: novoEndereco,
                    coordenadas: novasCoordenadas,
                    telefone
                });
                logger_1.infoLogger.info('Loja criada com sucesso', { nome, endereco: novoEndereco });
                res.status(201).json({ message: 'Loja criada com sucesso' });
            }
            catch (err) {
                logger_1.errorLogger.error('Erro ao criar a loja', { error: err.message });
                res.status(500).json({ message: 'Erro ao criar a loja', error: err.message });
            }
        });
    }
    static updateLoja(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { nome, telefone, endereco: { logradouro, bairro, cidade, estado, numero, cep, } = {}, coordenadas: { latitude, longitude } = {} } = req.body;
                // Buscar a loja pelo ID
                const loja = yield (0, loja_1.buscarLojaPorId)(id);
                if (!loja) {
                    logger_1.warnLogger.warn('Loja não encontrada', { id });
                    return res.status(404).json({ message: 'Loja não encontrada.' });
                }
                // Criar um objeto de atualização somente com os campos definidos
                const novosDados = {};
                if (logradouro || bairro || cidade || estado || numero || cep) {
                    novosDados.endereco = {
                        logradouro: logradouro || "",
                        bairro: bairro || "",
                        cidade: cidade || "",
                        estado: estado || "",
                        numero: numero || "",
                        cep: cep || "",
                    };
                    if (cep) {
                        let novasCoordenadas;
                        const coordenadasCepLoja = yield (0, converterCep_1.converterCepCoordenadas)(cep);
                        if (!coordenadasCepLoja) {
                            logger_1.warnLogger.warn('Coordenadas não encontradas para o CEP fornecido.', { cep });
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
                                latitude: coordenadasCepLoja.lat,
                                longitude: coordenadasCepLoja.lng
                            };
                        }
                        novosDados.coordenadas = novasCoordenadas;
                    }
                }
                if (nome) {
                    novosDados.nome = nome;
                }
                if (telefone) {
                    novosDados.telefone = telefone;
                }
                // Atualizar a loja com os dados fornecidos
                const lojaAtualizada = yield (0, loja_1.atualizarLoja)(id, novosDados);
                logger_1.infoLogger.info('Loja atualizada com sucesso', { id, novosDados });
                res.status(200).json({ message: 'Loja atualizada com sucesso', loja: lojaAtualizada });
            }
            catch (err) {
                logger_1.errorLogger.error('Erro ao atualizar a loja', { error: err.message });
                res.status(500).json({ message: 'Erro ao atualizar a loja', error: err.message });
            }
        });
    }
}
exports.default = LojaController;
