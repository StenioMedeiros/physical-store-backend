"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//routes/LojaRoutes.ts
const express_1 = require("express");
const storeControllers_1 = __importDefault(require("../controllers/storeControllers"));
const router = (0, express_1.Router)(); // Cria uma instância do Router
// CRUD routes para LojaController
// Criar loja
router.post('/create', storeControllers_1.default.createStore);
//Atualizar loja
router.put('/:id', storeControllers_1.default.updateStore);
//Buscar lojas procimas
router.get('/searchStore', storeControllers_1.default.searchNearbyStore);
//Apagar loja por id
router.delete('/:id', storeControllers_1.default.deleteStore);
exports.default = router;
