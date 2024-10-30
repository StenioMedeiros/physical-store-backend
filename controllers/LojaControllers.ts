// controllers/lojaController.ts
import { Request, Response } from 'express';
import { Pool } from 'pg';
import { criarLoja, Loja, buscarLojaPorId, atualizarLoja  } from '../models/loja';
import { buscarEnderecoCep } from '../services/buscarEnderecoCep';
import { converterCepCoordenadas } from '../services/converterCep';
import { infoLogger, warnLogger, errorLogger } from '../utils/logger';

const pool: Pool = require('../db/database');


// Controlador de Loja
class LojaController {
    // Método para criar uma nova loja
    static async createLoja(req: any, res:any) {
        try {
            const { nome, endereco, telefone } = req.body as { 
                nome: string; 
                endereco: { logradouro: string; bairro: string; cidade: string; estado: string; numero: string; cep: string };
                coordenadas:{latitude: Number; longitude: Number} 
                telefone: string; 
            };

            if (!nome) {
                warnLogger.warn('Nome inválido ao tentar criar uma loja', { nome });
                return res.status(400).json({ message: 'O campo "nome" é obrigatório.' });
            }

            const isValidCep = (cep: string) => /^[0-9]{8}$/.test(cep);
            if (!endereco.cep || !isValidCep(endereco.cep)) {
                warnLogger.warn('CEP inválido ao tentar criar uma loja', { cep: endereco?.cep });
                return res.status(400).json({ message: 'O campo "cep" é obrigatório e deve ser um CEP válido de 8 dígitos.' });
            }


            const enderecoCompleto = await buscarEnderecoCep(endereco.cep);

            if (!enderecoCompleto) {
                warnLogger.warn('Endereço não encontrado para o CEP fornecido', { cep: endereco.cep });
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
            const coordenadasCepLoja = await converterCepCoordenadas(endereco.cep);

            if (!coordenadasCepLoja) {
                warnLogger.warn('Coordenadas não encontradas para o CEP fornecido.', { cep: endereco.cep });
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
            await criarLoja({
                nome,
                endereco: novoEndereco,
                coordenadas: novasCoordenadas,
                telefone
            });
            infoLogger.info('Loja criada com sucesso', { nome, endereco: novoEndereco });
            res.status(201).json({ message: 'Loja criada com sucesso' });
        } catch (err:any) {
            errorLogger.error('Erro ao criar a loja', { error: err.message });
            res.status(500).json({ message: 'Erro ao criar a loja', error: err.message });
        }
    }

        static async updateLoja(req: Request, res: any) {
        try {
            const { id } = req.params;
            const {
                nome,
                telefone,
                endereco: {logradouro, bairro, cidade, estado, numero, cep,} = {},
                coordenadas:{latitude, longitude}= {} 
            } = req.body;

            // Buscar a loja pelo ID
            const loja = await buscarLojaPorId(id);
            
            if (!loja) {
                warnLogger.warn('Loja não encontrada', { id });
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
                        const coordenadasCepLoja = await converterCepCoordenadas(cep);
                            if (!coordenadasCepLoja) {
                                warnLogger.warn('Coordenadas não encontradas para o CEP fornecido.', { cep });
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
            const lojaAtualizada = await atualizarLoja(id, novosDados);
            infoLogger.info('Loja atualizada com sucesso', { id, novosDados });

            res.status(200).json({ message: 'Loja atualizada com sucesso', loja: lojaAtualizada });
        } catch (err: any) {
            errorLogger.error('Erro ao atualizar a loja', { error: err.message });
            res.status(500).json({ message: 'Erro ao atualizar a loja', error: err.message });
        }
    }
}

export default LojaController;
