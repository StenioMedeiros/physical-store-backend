import { searchStoreID, updateStoreInDB } from "../../models/loja";
import { convertCepInCoordinate } from "../converterCep";
import { logWarn, logInfo } from "../../utils/logger";
import { Loja } from "../../models/loja";

export async function updateStoreService(id: string, body: any) {
    const { nome, telefone, endereco: { logradouro, bairro, cidade, estado, numero, cep } = {} } = body;

    // Buscar a loja pelo ID
    const loja = await searchStoreID(id);
    if (!loja) {
        logWarn(`Loja não encontrada. ID: ${id}`);
        throw new Error('Loja não encontrada.');
    }

    // Criar um objeto de atualização somente com os campos definidos
    const novosDados: Partial<Loja> = {};

    // Atualizar endereço se algum campo for fornecido
    if (logradouro || bairro || cidade || estado || numero || cep) {
        novosDados.endereco = {
            logradouro: logradouro || "",
            bairro: bairro || "",
            cidade: cidade || "",
            estado: estado || "",
            numero: numero || "",
            cep: cep || ""
        };

        // Obter coordenadas baseadas no CEP, se fornecido
        if (cep) {
            const coordenadasCepLoja = await convertCepInCoordinate(cep);
            if (!coordenadasCepLoja) {
                logWarn(`Coordenadas não encontradas para o CEP: ${cep}`);
                const { latitude, longitude } = body.coordenadas || {};

                if (!latitude || !longitude) {
                    throw new Error('Coordenadas não encontradas para o CEP fornecido. Por favor, forneça latitude e longitude.');
                }

                novosDados.coordenadas = { latitude, longitude };
            } else {
                novosDados.coordenadas = {
                    latitude: coordenadasCepLoja.lat,
                    longitude: coordenadasCepLoja.lng
                };
            }
        }
    }

    // Atualizar nome e telefone, se fornecidos
    if (nome) novosDados.nome = nome;
    if (telefone) novosDados.telefone = telefone;

    // Atualizar a loja com os dados fornecidos
    const lojaAtualizada = await updateStoreInDB(id, novosDados);
    logInfo(`Loja atualizada com sucesso. ID: ${id}, Novos dados: ${JSON.stringify(novosDados)}`);
    return lojaAtualizada;
}