//routes/LojaRoutes.ts
import { Router } from 'express'; 
import StoreController from '../controllers/storeControllers'; 

const router = Router(); // Cria uma instância do Router

// CRUD routes para storeController

// Criar loja
router.post('/create', StoreController.createStore);

//Atualizar loja
router.put('/:id', StoreController.updateStore);

//Buscar lojas procimas
router.get('/searchStore', StoreController.searchNearbyStore);

//Apagar loja por id
router.delete('/:id', StoreController.deleteStore);

export default router; 
