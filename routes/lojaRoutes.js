"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//routes/LojaRoutes.ts
const express_1 = require("express");
const LojaControllers_1 = __importDefault(require("../controllers/LojaControllers"));
const router = (0, express_1.Router)(); // Cria uma instância do Router
// CRUD routes para LojaController
// Criar loja
router.post('/create', LojaControllers_1.default.createLoja);
//Atualizar loja
router.put('/:id', LojaControllers_1.default.updateLoja);
//Buscar lojas procimas
router.get('/buscarLojas', LojaControllers_1.default.buscarLojasProximas);
//Apagar loja por id
router.delete('/:id', LojaControllers_1.default.apagarLoja);
exports.default = router;
