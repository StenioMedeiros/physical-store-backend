// models/loja.ts

import pool from '../db/database'; // Importa a função de conexão

// Define a interface para o modelo Loja
interface Endereco {
    logradouro: string;
    bairro: string;
    cidade: string;
    estado: string;
    numero: string;
    cep: string;
}

interface coordenadas{
    latitude: Number;
    longitude: Number;
}

interface Loja {
    nome: string;
    endereco: Endereco;
    coordenadas: coordenadas;
    telefone: string;



}

// Função para criar uma nova loja no banco de dados
const criarLoja = async (loja: Loja): Promise<void> => {
    const query = `
        INSERT INTO lojas (nome, logradouro, bairro, cidade, estado, numero,telefone, cep, latitude, longitude)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    const values = [
        loja.nome,
        loja.endereco.logradouro,
        loja.endereco.bairro,
        loja.endereco.cidade,
        loja.endereco.estado,
        loja.endereco.numero,
        loja.endereco.cep,
        loja.coordenadas.latitude,
        loja.coordenadas.longitude,
        loja.telefone,
        
    ];

    try {
        await pool.query(query, values);
        console.log('Loja criada com sucesso!');
    } catch (error) {
        console.error('Erro ao criar loja:', error);
    }
};

export { Loja, criarLoja };
