//routes/LojaRoutes.ts
import { Router } from 'express'; // Importa Router do Express
import LojaController from '../controllers/LojaControllers'; // Importa o LojaController

const router = Router(); // Cria uma instância do Router

// CRUD routes para LojaController

// Criar loja
router.post('/create', LojaController.createLoja);

export default router; // Exporta o roteador
