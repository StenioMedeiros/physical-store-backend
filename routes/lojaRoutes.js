"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//routes/LojaRoutes.ts
const express_1 = require("express"); // Importa Router do Express
const LojaControllers_1 = __importDefault(require("../controllers/LojaControllers")); // Importa o LojaController
const router = (0, express_1.Router)(); // Cria uma instância do Router
// CRUD routes para LojaController
// Criar loja
router.post('/create', LojaControllers_1.default.createLoja);
exports.default = router; // Exporta o roteador
