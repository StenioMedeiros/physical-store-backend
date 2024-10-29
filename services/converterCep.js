"use strict";
//services/converterCep
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
exports.converterCepCoordenadas = void 0;
const axios_1 = __importDefault(require("axios"));
const logger = __importStar(require("c:/Users/ESTENIO/prog/estagio-compas/p1.2/E-commerce/bakend/utils/logger"));
// Função para validar o formato do CEP
const isValidCep = (cep) => /^[0-9]{8}$/.test(cep);
// Função para buscar as coordenadas com base no CEP
const converterCepCoordenadas = (cep) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Verifica se o CEP é válido
    if (!isValidCep(cep)) {
        const errorMsg = 'Formato de CEP inválido. O CEP deve conter 8 dígitos numéricos.';
        logger.errorLogger.error(errorMsg, { cep });
        return null;
    }
    try {
        // Loga o início da busca de coordenadas
        logger.infoLogger.info('Iniciando busca de coordenadas para o CEP', { cep });
        // Faz a requisição para a API
        const response = yield axios_1.default.get(process.env.GOOGLE_API_KEY || '', {
            params: {
                address: cep,
                key: process.env.DISTANCEMATRIX_API_KEY,
            },
            timeout: 5000,
        });
        // Loga a resposta da API
        logger.infoLogger.info('Resposta da API:', { response: response.data });
        // Verifica se houve resultados na resposta da API
        if (response.data.results.length === 0) {
            const errorMsg = 'CEP não encontrado na base de dados geocodificada.';
            logger.errorLogger.error(errorMsg, { cep });
            return null;
        }
        const resultado = response.data.results[0];
        // Verifica a presença de geometria e localização
        if (!resultado.geometry || !resultado.geometry.location) {
            const errorMsg = 'Coordenadas não encontradas na resposta da API.';
            logger.errorLogger.error(errorMsg, { cep });
            return null;
        }
        const { formatted_address, geometry } = resultado;
        // Extrai latitude e longitude
        const latitude = geometry.location.lat;
        const longitude = geometry.location.lng;
        // Loga a latitude e longitude obtidas
        logger.infoLogger.info('Coordenadas obtidas com sucesso', {
            cep,
            endereco: formatted_address,
            latitude,
            longitude,
        });
        // Retorna as coordenadas
        return {
            latitude,
            longitude,
        };
    }
    catch (error) {
        // Loga o erro com detalhes
        logger.errorLogger.error('Erro ao buscar coordenadas', {
            message: error.message,
            stack: error.stack,
            responseData: ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || null,
        });
        throw error;
    }
});
exports.converterCepCoordenadas = converterCepCoordenadas;
