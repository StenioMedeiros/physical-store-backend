//routes/LojaRoutes.ts
import { Router } from 'express'; 
import LojaController from '../controllers/LojaControllers'; 

const router = Router(); // Cria uma instância do Router

// CRUD routes para LojaController

// Criar loja
router.post('/create', LojaController.createLoja);

//Atualizar loja
router.put('/:id', LojaController.updateLoja);

//Buscar lojas procimas
router.get('/buscarLojas', LojaController.buscarLojasProximas);

//Apagar loja por id
router.delete('/:id', LojaController.apagarLoja);

export default router; 
