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
const createStoreService_1 = require("../services/storeServices/createStoreService");
const updateStoreService_1 = require("../services/storeServices/updateStoreService");
const searchNearbyStoreService_1 = require("../services/storeServices/searchNearbyStoreService");
const deleteStoreService_1 = require("../services/storeServices/deleteStoreService");
const logger_1 = require("../utils/logger");
// Controlador de Loja
class StoreController {
    // Método para criar uma nova loja 
    static createStore(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome, endereco, telefone, coordenadas } = req.body;
                const resultado = yield (0, createStoreService_1.createStoreService)({ nome, endereco, telefone, coordenadas });
                res.status(201).json(resultado);
            }
            catch (error) {
                (0, logger_1.logError)(`Erro ao criar a loja: ${error.message}`);
                res.status(500).json({ error: error.message });
            }
        });
    }
    // Atualizar loja
    static updateStore(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, updateStoreService_1.updateStoreService)(req.params.id, req.body);
                res.status(200).json({ message: 'Loja atualizada com sucesso' });
            }
            catch (error) {
                (0, logger_1.logError)(`Erro ao atualizar a loja: ${error.message}`);
                res.status(500).json({ error: error.message });
            }
        });
    }
    // buscr lojas próximas 
    static searchNearbyStore(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lojasProximas = yield (0, searchNearbyStoreService_1.searchNearbyStoreService)(req.body.endereco.cep);
                res.status(200).json({ lojasProximas });
            }
            catch (error) {
                (0, logger_1.logError)(`Erro ao buscar lojas próximas: ${error.message}`);
                res.status(500).json({ error: error.message });
            }
        });
    }
    //Apagar loja
    static deleteStore(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, deleteStoreService_1.deleteStoreService)(req.params.id);
                res.status(200).json({ message: 'Loja apagada com sucesso' });
            }
            catch (error) {
                (0, logger_1.logError)(`Erro ao apagar loja: ${error.message}`);
                res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.default = StoreController;
