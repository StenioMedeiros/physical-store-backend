import { Request, Response } from 'express';
import { createStoreService } from '../services/storeServices/createStoreService';
import { updateStoreService } from '../services/storeServices/updateStoreService';
import { searchNearbyStoreService } from '../services/storeServices/searchNearbyStoreService';
import { deleteStoreService } from '../services/storeServices/deleteStoreService';
import { logError } from '../utils/logger';


// Controlador de Loja
class storeController {
    // Método para criar uma nova loja
    static async createStore(req: Request, res: Response) {
        try {
            const { nome, endereco, telefone, coordenadas } = req.body;
            const resultado = await createStoreService({ nome, endereco, telefone, coordenadas });
            res.status(201).json(resultado);
        } catch (error: any) {
            logError(`Erro ao criar a loja: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }

    // Atualizar loja
    static async updateStore(req: Request, res: Response) {
        try {
            await updateStoreService(req.params.id, req.body);
            res.status(200).json({ message: 'Loja atualizada com sucesso' });
        } catch (error: any) {
            logError(`Erro ao atualizar a loja: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }

    // buscr lojas próximas 
    static async searchNearbyStore(req: Request, res: Response) {
        try {
            const lojasProximas = await searchNearbyStoreService(req.body.endereco.cep);
            res.status(200).json({ lojasProximas });
        } catch (error: any) {
            logError(`Erro ao buscar lojas próximas: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }

    //Apagar loja
    static async deleteStore(req: Request, res: Response) {
        try {
            await deleteStoreService(req.params.id);
            res.status(200).json({ message: 'Loja apagada com sucesso' });
        } catch (error: any) {
            logError(`Erro ao apagar loja: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }
}

export default storeController;