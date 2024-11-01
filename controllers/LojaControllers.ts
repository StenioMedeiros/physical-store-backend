// controllers/lojaController.ts
import { Request, Response } from 'express';
import { createStoreInDB, Loja, searchStoreID, updateStoreInDB  } from '../models/loja';
import { searchAddressCep } from '../services/buscarEnderecoCep';
import { convertCepInCoordinate } from '../services/converterCep';
//import { infoLogger, warnLogger, errorLogger } from '../utils/logger';
import { logError, logWarn, logInfo } from '../utils/logger';
import calculateDistamce from '../utils/calcularDistancia';
import pool from '../db/database';


// Controlador de Loja
class storeController {
    // Método para criar uma nova loja
    static async createStore(req: any, res:any) {
        try {
            const { nome, endereco, telefone } = req.body as { 
                nome: string; 
                endereco: { logradouro: string; bairro: string; cidade: string; estado: string; numero: string; cep: string };
                coordenadas:{latitude: Number; longitude: Number} 
                telefone: string; 
            };

            if (!nome) {
                logWarn('Nome inválido ao tentar criar uma loja');
                return res.status(400).json({ message: 'O campo "nome" é obrigatório.' });
            }

            const isValidCep = (cep: string) => /^[0-9]{8}$/.test(cep);
            if (!endereco.cep || !isValidCep(endereco.cep)) {
                logWarn(`CEP inválido ao tentar criar uma loja: ${endereco?.cep}`);
                return res.status(400).json({ message: 'O campo "cep" é obrigatório e deve ser um CEP válido de 8 dígitos.' });
            }


            const enderecoCompleto = await searchAddressCep(endereco.cep);

            if (!enderecoCompleto) {
                logWarn(`Endereço não encontrado para o CEP fornecido: ${endereco?.cep}`);
                return res.status(400).json({ message: 'CEP inválido ou não encontrado.' });
            }
            const novoEndereco = {
                logradouro: enderecoCompleto.logradouro || endereco.logradouro,
                bairro: enderecoCompleto.bairro || endereco.bairro,
                cidade: enderecoCompleto.localidade || endereco.cidade,
                estado: enderecoCompleto.uf || endereco.estado,
                cep: endereco.cep,
                numero: endereco.numero
            };

            const camposObrigatorios = ['logradouro', 'bairro', 'cidade', 'estado'] as const;
            const camposPendentes = camposObrigatorios.filter(campo => !novoEndereco[campo]);

            if (camposPendentes.length > 0) {
                return res.status(400).json({
                    message: `Os seguintes campos do endereço estão pendentes e precisam ser fornecidos: ${camposPendentes.join(', ')}`,
                    camposPendentes
                });
            }
            
 
            let novasCoordenadas: { latitude: number; longitude: number };

            // Buscar as coordenadas do CEP        
            const coordenadasCepLoja = await convertCepInCoordinate(endereco.cep);

            if (!coordenadasCepLoja) {
                logWarn(`Coordenadas não encontradas para o CEP fornecido.', ${ endereco.cep }`);
                if (!req.body.coordenadas || !req.body.coordenadas.latitude || !req.body.coordenadas.longitude) {
                    return res.status(400).json({ message: 'Coordenadas não encontradas para o CEP fornecido. Por favor, forneça latitude e longitude.' });
                } else {
                    const { latitude, longitude } = req.body.coordenadas;
                    novasCoordenadas = {
                        latitude,
                        longitude
                    };
                }
            } else {
                novasCoordenadas = {
                    latitude: coordenadasCepLoja.lat ,
                    longitude: coordenadasCepLoja.lng
                };
            }

            // Criar a loja no banco de dados
            await createStoreInDB({
                nome,
                endereco: novoEndereco,
                coordenadas: novasCoordenadas,
                telefone
            });
            logInfo(`Loja criada com sucesso. Nome: ${nome}, Endereço: ${novoEndereco}`)
            res.status(201).json({ message: 'Loja criada com sucesso' });
        } catch (err:any) {
            logError(`Erro ao criar a loja: ${err.message}`);
            res.status(500).json({ message: 'Erro ao criar a loja', error: err.message });
        }
    }
        // Atualizar loja
        static async updateStore(req: Request, res: any) {
        try {
            const { id } = req.params;
            const {
                nome,
                telefone,
                endereco: {logradouro, bairro, cidade, estado, numero, cep,} = {},
            } = req.body;

            // Buscar a loja pelo ID
            const loja = await searchStoreID(id);
            
            if (!loja) {
                logWarn(`Loja não encontrada', ${ id }`);
                return res.status(404).json({ message: 'Loja não encontrada.' });
            }

            // Criar um objeto de atualização somente com os campos definidos
            const novosDados: Partial<Loja> = {};
                if (logradouro || bairro || cidade || estado || numero || cep) {
                    novosDados.endereco = {
                        logradouro: logradouro || "",
                        bairro: bairro || "",
                        cidade: cidade || "",
                        estado: estado || "",
                        numero: numero || "",
                        cep: cep || "",  
                    };
                    if(cep){
                        let novasCoordenadas: { latitude: number; longitude: number };
                        const coordenadasCepLoja = await convertCepInCoordinate(cep);
                            if (!coordenadasCepLoja) {
                                logWarn(`Coordenadas não encontradas para o CEP fornecido: ${cep}`);
                                if (!req.body.coordenadas || !req.body.coordenadas.latitude || !req.body.coordenadas.longitude) {
                                    return res.status(400).json({ message: 'Coordenadas não encontradas para o CEP fornecido. Por favor, forneça latitude e longitude.' });
                                } else {
                                    const { latitude, longitude } = req.body.coordenadas;
                                    novasCoordenadas = {
                                        latitude,
                                        longitude
                                    };
                                }
                            } else {
                                novasCoordenadas = {
                                    latitude: coordenadasCepLoja.lat ,
                                    longitude: coordenadasCepLoja.lng
                                };
                            }
                            novosDados.coordenadas = novasCoordenadas;
                            }
                }
                if (nome) {
                    novosDados.nome = nome;
                }

                if (telefone) {
                    novosDados.telefone = telefone;
                }

            // Atualizar a loja com os dados fornecidos
            const lojaAtualizada = await updateStoreInDB(id, novosDados);
            logInfo(`Loja atualizada com sucesso. ID: ${id}, Novos dados: ${JSON.stringify(novosDados)}`);

            res.status(200).json({ message: 'Loja atualizada com sucesso', loja: lojaAtualizada });
        } catch (err: any) {
            logError(`Erro ao atualizar a loja: ${err.message}`);
            res.status(500).json({ message: 'Erro ao atualizar a loja', error: err.message });
        }
    }
    // buscr lojas próximas 

    static async searchNearbyStore(req: Request, res: any) {
        const { endereco } = req.body as { endereco: { cep: string } };

        try {
            const coordenadasUsuario = await convertCepInCoordinate(endereco.cep);

            if (!coordenadasUsuario) {
                logWarn(`Coordenadas não encontradas para o CEP: ${endereco.cep}`);
                return res.status(404).json({ error: 'Coordenadas não encontradas para o CEP fornecido' });
            }

            const lojas = await pool.query(
                'SELECT nome, logradouro, numero, bairro, cidade, estado, latitude, longitude FROM lojas'
            );

            if (!lojas.rows || lojas.rows.length === 0) {
                logWarn('Nenhuma loja encontrada no banco de dados');
                return res.status(404).json({ error: 'Nenhuma loja encontrada' });
            }

            const lojasDistancias: {
                nome: string;
                distancia: number;
                endereco: { logradouro: string; numero: string; bairro: string; cidade: string; estado: string };
            }[] = [];

            // Calcular a distância de 100 km
            for (const loja of lojas.rows) {
                const distancia = calculateDistamce(
                    coordenadasUsuario.lat,
                    coordenadasUsuario.lng,
                    loja.latitude,
                    loja.longitude
                );

                if (distancia <= 100) {
                    lojasDistancias.push({
                        nome: loja.nome,
                        distancia: parseFloat(distancia.toFixed(2)),
                        endereco: {
                            logradouro: loja.logradouro,
                            numero: loja.numero,
                            bairro: loja.bairro,
                            cidade: loja.cidade,
                            estado: loja.estado,
                        },
                    });
                }
            }

            let lojasProximas;
            if (lojasDistancias.length > 0) {
                // Se houver lojas no raio de 100 km
                lojasDistancias.sort((a, b) => a.distancia - b.distancia);
                lojasProximas = lojasDistancias;
            } else {
                // Se não houver lojas no raio de 100 km
                const todasLojasDistancias = lojas.rows.map(loja => ({
                    nome: loja.nome,
                    distancia: calculateDistamce(
                        coordenadasUsuario.lat,
                        coordenadasUsuario.lng,
                        loja.latitude,
                        loja.longitude
                    ),
                    endereco: {
                        logradouro: loja.logradouro,
                        numero: loja.numero,
                        bairro: loja.bairro,
                        cidade: loja.cidade,
                        estado: loja.estado,
                    },
                }));

                todasLojasDistancias.sort((a, b) => a.distancia - b.distancia);
                lojasProximas = todasLojasDistancias.slice(0, 2).map(loja => ({
                    nome: loja.nome,
                    distancia: parseFloat(loja.distancia.toFixed(2)),
                    endereco: loja.endereco,
                }));

                return res.status(200).json({
                    message: 'Não há lojas dentro de um raio de 100KM, as lojas mais próximas são:',
                    lojasProximas,
                    cep_Consultado: endereco,
                    coordenadas_do_cep: coordenadasUsuario,                    
                });
            }

            res.json({
                cepConsulta: endereco,
                coordenadasConsulta: coordenadasUsuario,
                lojasProximas,
            });
        } catch (error) {
            logError(`Erro ao buscar lojas próximas: ${error}`);
            res.status(500).json({ error: 'Erro ao buscar lojas próximas' });
        }
    }

        //Apagar loja 
        static async deleteStore(req: Request, res: any) {
            const { id } = req.params; 

            try {
                if (!id) {
                    return res.status(400).json({ error: 'ID da loja não fornecido' });
                }
                const resultado = await pool.query('DELETE FROM lojas WHERE id = $1', [id]);

                if (resultado.rowCount === 0) {
                    return res.status(404).json({ error: 'Loja não encontrada' });
                }

                res.status(200).json({ message: 'Loja apagada com sucesso' });
            } catch (error) {
                logError(`Erro ao apagar loja: ${error}`);
                res.status(500).json({ error: 'Erro ao apagar loja' });
            }
        }
}

export default storeController;
