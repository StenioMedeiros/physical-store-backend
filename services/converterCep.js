"use strict";
//services/convwerterCep
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
exports.convertCepInCoordinate = convertCepInCoordinate;
const logger_1 = require("../utils/logger");
const axios_1 = __importDefault(require("axios"));
const chalk_1 = __importDefault(require("chalk"));
function convertCepInCoordinate(cep) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        (0, logger_1.logInfo)(`Iniciando a conversão do CEP: ${cep}`);
        try {
            const response = yield axios_1.default.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${cep}&key=${process.env.GOOGLE_API_KEY}`);
            (0, logger_1.logInfo)('Resposta da API: ' + JSON.stringify(response.data)); // Convertendo a resposta 
            const lojaLocation = (_b = (_a = response.data.results[0]) === null || _a === void 0 ? void 0 : _a.geometry) === null || _b === void 0 ? void 0 : _b.location;
            if (lojaLocation) {
                const { lat, lng } = lojaLocation;
                (0, logger_1.logInfo)(`Coordenadas encontradas para o CEP ${cep}: Latitude ${lat}, Longitude ${lng}`);
                return { lat, lng };
            }
            else {
                (0, logger_1.logWarn)(`Nenhuma coordenada encontrada para o CEP ${cep}`);
                console.log(chalk_1.default.bgRed.black(`Nenhuma coordenada encontrada para o CEP ${cep}`));
                return null;
            }
        }
        catch (error) {
            (0, logger_1.logError)(`Erro ao obter coordenadas para o CEP ${cep}: ${error instanceof Error ? error.message : error}`);
            console.log(chalk_1.default.bgRed.black(`Erro ao obter coordenadas para o CEP ${cep}`));
            return null;
        }
    });
}
