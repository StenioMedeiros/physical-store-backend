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
exports.searchNearbyStoreService = searchNearbyStoreService;
const database_1 = __importDefault(require("../../db/database"));
const calculateDistance_1 = __importDefault(require("../../utils/calculateDistance"));
const convertCep_1 = require("../convertCep");
const logger_1 = require("../../utils/logger");
function searchNearbyStoreService(cep) {
    return __awaiter(this, void 0, void 0, function* () {
        // Obter coordenadas do CEP do usuário
        const coordenadasUsuario = yield (0, convertCep_1.convertCepInCoordinate)(cep);
        if (!coordenadasUsuario) {
            (0, logger_1.logWarn)(`Coordenadas não encontradas para o CEP: ${cep}`);
            throw new Error('Coordenadas não encontradas para o CEP fornecido');
        }
        // Buscar todas as lojas do banco de dados
        const lojas = yield database_1.default.query('SELECT nome, logradouro, numero, bairro, cidade, estado, latitude, longitude FROM lojas');
        if (!lojas.rows || lojas.rows.length === 0) {
            (0, logger_1.logWarn)('Nenhuma loja encontrada no banco de dados');
            throw new Error('Nenhuma loja encontrada');
        }
        const lojasDistancias = lojas.rows
            .map((loja) => {
            const distancia = (0, calculateDistance_1.default)(coordenadasUsuario.lat, coordenadasUsuario.lng, loja.latitude, loja.longitude);
            return {
                nome: loja.nome,
                distancia: parseFloat(distancia.toFixed(2)),
                endereco: {
                    logradouro: loja.logradouro,
                    numero: loja.numero,
                    bairro: loja.bairro,
                    cidade: loja.cidade,
                    estado: loja.estado,
                },
            };
        })
            .filter((loja) => loja.distancia <= 100);
        if (lojasDistancias.length > 0) {
            // Ordenar as lojas por distância
            lojasDistancias.sort((a, b) => a.distancia - b.distancia);
            return {
                cepConsultado: cep,
                coordenadasConsulta: coordenadasUsuario,
                lojasProximas: lojasDistancias,
            };
        }
        else {
            // Se nenhuma loja estiver dentro de 100km, retornar as mais próximas
            const todasLojasDistancias = lojas.rows
                .map((loja) => ({
                nome: loja.nome,
                distancia: (0, calculateDistance_1.default)(coordenadasUsuario.lat, coordenadasUsuario.lng, loja.latitude, loja.longitude),
                endereco: {
                    logradouro: loja.logradouro,
                    numero: loja.numero,
                    bairro: loja.bairro,
                    cidade: loja.cidade,
                    estado: loja.estado,
                },
            }))
                .sort((a, b) => a.distancia - b.distancia)
                .slice(0, 2)
                .map((loja) => ({
                nome: loja.nome,
                distancia: parseFloat(loja.distancia.toFixed(2)),
                endereco: loja.endereco,
            }));
            return {
                message: 'Não há lojas dentro de um raio de 100KM, as lojas mais próximas são:',
                lojasProximas: todasLojasDistancias,
                cepConsultado: cep,
                coordenadasConsulta: coordenadasUsuario,
            };
        }
    });
}
