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
const loja_1 = require("../models/loja");
const buscarEnderecoCep_1 = require("../services/buscarEnderecoCep");
const converterCep_1 = require("../services/converterCep");
const logger_1 = require("../utils/logger");
const calcularDistancia_1 = __importDefault(require("../utils/calcularDistancia"));
const database_1 = __importDefault(require("../db/database"));
// Controlador de Loja
class storeController {
    // Método para criar uma nova loja
    static createStore(req, res) {
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
                const enderecoCompleto = yield (0, buscarEnderecoCep_1.searchAddressCep)(endereco.cep);
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
                const coordenadasCepLoja = yield (0, converterCep_1.convertCepInCoordinate)(endereco.cep);
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
                yield (0, loja_1.createStoreInDB)({
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
    // Atualizar loja
    static updateStore(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { nome, telefone, endereco: { logradouro, bairro, cidade, estado, numero, cep, } = {}, } = req.body;
                // Buscar a loja pelo ID
                const loja = yield (0, loja_1.searchStoreID)(id);
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
                        const coordenadasCepLoja = yield (0, converterCep_1.convertCepInCoordinate)(cep);
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
                const lojaAtualizada = yield (0, loja_1.updateStoreInDB)(id, novosDados);
                logger_1.infoLogger.info('Loja atualizada com sucesso', { id, novosDados });
                res.status(200).json({ message: 'Loja atualizada com sucesso', loja: lojaAtualizada });
            }
            catch (err) {
                logger_1.errorLogger.error('Erro ao atualizar a loja', { error: err.message });
                res.status(500).json({ message: 'Erro ao atualizar a loja', error: err.message });
            }
        });
    }
    // buscr lojas próximas 
    static searchNearbyStore(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { endereco } = req.body;
            try {
                const coordenadasUsuario = yield (0, converterCep_1.convertCepInCoordinate)(endereco.cep);
                if (!coordenadasUsuario) {
                    logger_1.infoLogger.warn(`Coordenadas não encontradas para o CEP: ${endereco.cep}`);
                    return res.status(404).json({ error: 'Coordenadas não encontradas para o CEP fornecido' });
                }
                const lojas = yield database_1.default.query('SELECT nome, logradouro, numero, bairro, cidade, estado, latitude, longitude FROM lojas');
                if (!lojas.rows || lojas.rows.length === 0) {
                    logger_1.infoLogger.warn('Nenhuma loja encontrada no banco de dados');
                    return res.status(404).json({ error: 'Nenhuma loja encontrada' });
                }
                const lojasDistancias = [];
                // Calcular a distância de 100 km
                for (const loja of lojas.rows) {
                    const distancia = (0, calcularDistancia_1.default)(coordenadasUsuario.lat, coordenadasUsuario.lng, loja.latitude, loja.longitude);
                    if (distancia <= 100) {
                        lojasDistancias.push({
                            nome: loja.nome,
                            distancia: parseFloat(distancia.toFixed(2)),
                            endereco: {
                                logradouro: loja.logradouro,
                                numero: loja.numero,
                                bairro: loja.bairro,
                                cidade: loja.cidade,
                                estado: loja.estado,
                            },
                        });
                    }
                }
                let lojasProximas;
                if (lojasDistancias.length > 0) {
                    // Se houver lojas no raio de 100 km
                    lojasDistancias.sort((a, b) => a.distancia - b.distancia);
                    lojasProximas = lojasDistancias;
                }
                else {
                    // Se não houver lojas no raio de 100 km
                    const todasLojasDistancias = lojas.rows.map(loja => ({
                        nome: loja.nome,
                        distancia: (0, calcularDistancia_1.default)(coordenadasUsuario.lat, coordenadasUsuario.lng, loja.latitude, loja.longitude),
                        endereco: {
                            logradouro: loja.logradouro,
                            numero: loja.numero,
                            bairro: loja.bairro,
                            cidade: loja.cidade,
                            estado: loja.estado,
                        },
                    }));
                    todasLojasDistancias.sort((a, b) => a.distancia - b.distancia);
                    lojasProximas = todasLojasDistancias.slice(0, 2).map(loja => ({
                        nome: loja.nome,
                        distancia: parseFloat(loja.distancia.toFixed(2)),
                        endereco: loja.endereco,
                    }));
                    return res.status(200).json({
                        message: 'Não há lojas dentro de um raio de 100KM, as lojas mais próximas são:',
                        lojasProximas,
                        cep_Consultado: endereco,
                        coordenadas_do_cep: coordenadasUsuario,
                    });
                }
                res.json({
                    cepConsulta: endereco,
                    coordenadasConsulta: coordenadasUsuario,
                    lojasProximas,
                });
            }
            catch (error) {
                logger_1.errorLogger.error('Erro ao buscar lojas próximas: ' + error);
                res.status(500).json({ error: 'Erro ao buscar lojas próximas' });
            }
        });
    }
    //Apagar loja 
    static deleteStore(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                if (!id) {
                    return res.status(400).json({ error: 'ID da loja não fornecido' });
                }
                const resultado = yield database_1.default.query('DELETE FROM lojas WHERE id = $1', [id]);
                if (resultado.rowCount === 0) {
                    return res.status(404).json({ error: 'Loja não encontrada' });
                }
                res.status(200).json({ message: 'Loja apagada com sucesso' });
            }
            catch (error) {
                logger_1.errorLogger.error('Erro ao apagar loja: ' + error);
                res.status(500).json({ error: 'Erro ao apagar loja' });
            }
        });
    }
}
exports.default = storeController;
