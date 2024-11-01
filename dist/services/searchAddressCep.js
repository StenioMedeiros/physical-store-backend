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
exports.searchAddressCep = void 0;
//services/buscarEnderecoCep
const axios_1 = __importDefault(require("axios"));
//Buscar endereço por cep
const searchAddressCep = (cep) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`https://viacep.com.br/ws/${cep}/json/`);
        if ('erro' in response.data) {
            return null;
        }
        return response.data;
    }
    catch (error) {
        throw new Error('Erro ao buscar o endereço no ViaCEP');
    }
});
exports.searchAddressCep = searchAddressCep;
