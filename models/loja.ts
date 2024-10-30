// models/loja.ts
import pool from '../db/database'; 

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
const criarLoja = async (loja: { nome: string; endereco: any; coordenadas: any; telefone: string }): Promise<void> => {
    const query = `
        INSERT INTO lojas (nome, logradouro, bairro, cidade, estado, numero,telefone, cep, latitude, longitude)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;

    const values = [
        loja.nome,
        loja.endereco.logradouro,
        loja.endereco.bairro,
        loja.endereco.cidade,
        loja.endereco.estado,
        loja.endereco.numero,       
        loja.telefone,
        loja.endereco.cep,
        loja.coordenadas.latitude,
        loja.coordenadas.longitude,

        
    ];

    try {
        await pool.query(query, values);
        console.log('Loja criada com sucesso!');
    } catch (error) {
        console.error('Erro ao criar loja:', error);
    }
};

export { Loja, criarLoja };