//services/storeServices/createStoreService

import { searchAddressCep } from "../searchAddressCep";
import { convertCepInCoordinate } from "../convertCep";
import { logWarn, logInfo } from "../../utils/logger";
import { createStoreInDB } from "../../models/store";

interface StoreData {
    nome: string;
    endereco: {
        logradouro: string;
        bairro: string;
        cidade: string;
        estado: string;
        numero: string;
        cep: string;
    };
    telefone: string;
    coordenadas?: { latitude: number; longitude: number };
}

export async function createStoreService(data: StoreData) {
    const { nome, endereco, telefone, coordenadas } = data;

    if (!nome) {
        logWarn('Nome inválido ao tentar criar uma loja');
        throw new Error('O campo "nome" é obrigatório.');
    }

    const isValidCep = (cep: string) => /^[0-9]{8}$/.test(cep);
    if (!endereco.cep || !isValidCep(endereco.cep)) {
        logWarn(`CEP inválido ao tentar criar uma loja: ${endereco.cep}`);
        throw new Error('O campo "cep" é obrigatório e deve ser um CEP válido de 8 dígitos.');
    }

    const enderecoCompleto = await searchAddressCep(endereco.cep);
    if (!enderecoCompleto) {
        logWarn(`Endereço não encontrado para o CEP fornecido: ${endereco.cep}`);
        throw new Error('CEP inválido ou não encontrado.');
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
        throw new Error(`Os seguintes campos do endereço estão pendentes e precisam ser fornecidos: ${camposPendentes.join(', ')}`);
    }

    let novasCoordenadas = coordenadas;

    if (!coordenadas) {
        const coordenadasCepLoja = await convertCepInCoordinate(endereco.cep);
        if (!coordenadasCepLoja) {
            logWarn(`Coordenadas não encontradas para o CEP fornecido: ${endereco.cep}`);
            throw new Error('Coordenadas não encontradas para o CEP fornecido. Por favor, forneça latitude e longitude.');
        }
        novasCoordenadas = {
            latitude: coordenadasCepLoja.lat,
            longitude: coordenadasCepLoja.lng
        };
    }

    await createStoreInDB({
        nome,
        endereco: novoEndereco,
        coordenadas: novasCoordenadas,
        telefone
    });

    logInfo(`Loja criada com sucesso. Nome: ${nome}, Endereço: ${JSON.stringify(novoEndereco)}`);
    return { message: 'Loja criada com sucesso' };
}
