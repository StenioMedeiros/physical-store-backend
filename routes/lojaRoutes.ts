//routes/LojaRoutes.ts
import { Router } from 'express'; 
import LojaController from '../controllers/LojaControllers'; 

const router = Router(); // Cria uma instância do Router

// CRUD routes para LojaController

// Criar loja
router.post('/create', LojaController.createLoja);

export default router; 
