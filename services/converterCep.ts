//services/converterCep


import axios from 'axios';
import * as logger from 'c:/Users/ESTENIO/prog/estagio-compas/p1.2/E-commerce/bakend/utils/logger';

// Define a interface para coordenadas (latitude e longitude)
interface Coordenadas {
    latitude: number;
    longitude: number;
}

// Interface para o formato da resposta geocodificada da API google
interface GeocodeResponse {
    results: {
        formatted_address: string;
        geometry: {
            location: {
                lat: number;
                lng: number;
            };
        };
    }[];
}

// Função para validar o formato do CEP
const isValidCep = (cep: string): boolean => /^[0-9]{8}$/.test(cep);

// Função para buscar as coordenadas com base no CEP
const converterCepCoordenadas = async (cep: string): Promise<Coordenadas | null> => {
    // Verifica se o CEP é válido
    if (!isValidCep(cep)) {
        const errorMsg = 'Formato de CEP inválido. O CEP deve conter 8 dígitos numéricos.';
        logger.errorLogger.error(errorMsg, { cep });
        return null;
    }

    try {
        // Loga o início da busca de coordenadas
        logger.infoLogger.info('Iniciando busca de coordenadas para o CEP', { cep });

        // Faz a requisição para a API
        const response = await axios.get<GeocodeResponse>(process.env.GOOGLE_API_KEY || '', {
            params: {
                address: cep,
                key: process.env.DISTANCEMATRIX_API_KEY,
            },
            timeout: 5000,
        });

        // Loga a resposta da API
        logger.infoLogger.info('Resposta da API:', { response: response.data });

        // Verifica se houve resultados na resposta da API
        if (response.data.results.length === 0) {
            const errorMsg = 'CEP não encontrado na base de dados geocodificada.';
            logger.errorLogger.error(errorMsg, { cep });
            return null;
        }

        const resultado = response.data.results[0];

        // Verifica a presença de geometria e localização
        if (!resultado.geometry || !resultado.geometry.location) {
            const errorMsg = 'Coordenadas não encontradas na resposta da API.';
            logger.errorLogger.error(errorMsg, { cep });
            return null;
        }

        const { formatted_address, geometry } = resultado;

        // Extrai latitude e longitude
        const latitude = geometry.location.lat;
        const longitude = geometry.location.lng;

        // Loga a latitude e longitude obtidas
        logger.infoLogger.info('Coordenadas obtidas com sucesso', {
            cep,
            endereco: formatted_address,
            latitude,
            longitude,
        });

        // Retorna as coordenadas
        return {
            latitude,
            longitude,
        };

    } catch (error: any) {
        // Loga o erro com detalhes
        logger.errorLogger.error('Erro ao buscar coordenadas', {
            message: error.message,
            stack: error.stack,
            responseData: error.response?.data || null,
        });
        throw error;
    }
};

export { converterCepCoordenadas };
