"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./db/database"));
const dotenv_1 = __importDefault(require("dotenv"));
const lojaRoutes_1 = __importDefault(require("./routes/lojaRoutes"));
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
// Configura resposta em JSON
app.use(express_1.default.json());
app.use('/lojas', lojaRoutes_1.default);
// Conectar ao servidor
app.listen(PORT, () => {
    //logger.loggerConn.info(`Servidor rodando na porta ${PORT}`);
    console.log(`Servidor rodando na porta ${PORT}`);
});
database_1.default.connect((err, client, release) => {
    if (err) {
        console.error('Erro ao conectar ao PostgreSQL:', err);
        return;
    }
    console.log('Conectado ao PostgreSQL!');
    // Libera o cliente após uso
    release();
});
