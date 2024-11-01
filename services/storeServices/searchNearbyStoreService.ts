import pool from '../../db/database';
import calculateDistance from '../../utils/calculateDistance';
import { convertCepInCoordinate } from '../convertCep';
import { logError, logWarn } from '../../utils/logger';

export async function searchNearbyStoreService(cep: string) {
    // Obter coordenadas do CEP do usuário
    const coordenadasUsuario = await convertCepInCoordinate(cep);
    if (!coordenadasUsuario) {
        logWarn(`Coordenadas não encontradas para o CEP: ${cep}`);
        throw new Error('Coordenadas não encontradas para o CEP fornecido');
    }

    // Buscar todas as lojas do banco de dados
    const lojas = await pool.query(
        'SELECT nome, logradouro, numero, bairro, cidade, estado, latitude, longitude FROM lojas'
    );

    if (!lojas.rows || lojas.rows.length === 0) {
        logWarn('Nenhuma loja encontrada no banco de dados');
        throw new Error('Nenhuma loja encontrada');
    }

    const lojasDistancias = lojas.rows
        .map((loja) => {
            const distancia = calculateDistance(
                coordenadasUsuario.lat,
                coordenadasUsuario.lng,
                loja.latitude,
                loja.longitude
            );

            return {
                nome: loja.nome,
                distancia: parseFloat(distancia.toFixed(2)),
                endereco: {
                    logradouro: loja.logradouro,
                    numero: loja.numero,
                    bairro: loja.bairro,
                    cidade: loja.cidade,
                    estado: loja.estado,
                },
            };
        })
        .filter((loja) => loja.distancia <= 100);

    if (lojasDistancias.length > 0) {
        // Ordenar as lojas por distância
        lojasDistancias.sort((a, b) => a.distancia - b.distancia);
        return {
            cepConsultado: cep,
            coordenadasConsulta: coordenadasUsuario,
            lojasProximas: lojasDistancias,
        };
    } else {
        // Se nenhuma loja estiver dentro de 100km, retornar as mais próximas
        const todasLojasDistancias = lojas.rows
            .map((loja) => ({
                nome: loja.nome,
                distancia: calculateDistance(
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
            }))
            .sort((a, b) => a.distancia - b.distancia)
            .slice(0, 2)
            .map((loja) => ({
                nome: loja.nome,
                distancia: parseFloat(loja.distancia.toFixed(2)),
                endereco: loja.endereco,
            }));

        return {
            message: 'Não há lojas dentro de um raio de 100KM, as lojas mais próximas são:',
            lojasProximas: todasLojasDistancias,
            cepConsultado: cep,
            coordenadasConsulta: coordenadasUsuario,
        };
    }
}
