//services/buscarEnderecoCep

import axios from 'axios';

interface Endereco {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    ibge: string;
    gia: string;
    ddd: string;
    siafi: string;
}

const buscarEnderecoCep = async (cep: string): Promise<Endereco | null> => {
    try {
        const response = await axios.get<Endereco | { erro: boolean }>(`https://viacep.com.br/ws/${cep}/json/`);
        if ('erro' in response.data) {
            return null;
        }
        return response.data;
    } catch (error) {
        throw new Error('Erro ao buscar o endereço no ViaCEP');
    }
};

export { buscarEnderecoCep };
