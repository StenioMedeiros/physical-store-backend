//routes/LojaRoutes.ts
import { Router } from 'express'; 
import storeController from '../controllers/LojaControllers'; 

const router = Router(); // Cria uma instância do Router

// CRUD routes para LojaController

// Criar loja
router.post('/create', storeController.createStore);

//Atualizar loja
router.put('/:id', storeController.updateStore);

//Buscar lojas procimas
router.get('/searchStore', storeController.searchNearbyStore);

//Apagar loja por id
router.delete('/:id', storeController.deleteStore);

export default router; 
