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

// Função para buscar loja pelo ID
async function buscarLojaPorId(id: string) {
    const query = 'SELECT * FROM lojas WHERE id = $1'; 
    const values = [id];

    try {
        const result = await pool.query(query, values); 
        return result.rows[0]; 
    } catch (error) {
        console.error('Erro ao buscar a loja:', error);
        throw error; 
    }
}
async function atualizarLoja(id: string, novosDados: Partial<Loja>) {
    console.log(novosDados,id)
    const fields = [];
    const values = [];
    let index = 1;

    if (novosDados.nome) {
        fields.push(`nome = $${index++}`);
        values.push(novosDados.nome);
    }
    if (novosDados.endereco) {
        if (novosDados.endereco.logradouro) {
            fields.push(`logradouro = $${index++}`);
            values.push(novosDados.endereco.logradouro);
        }
        if (novosDados.endereco.bairro) {
            fields.push(`bairro = $${index++}`);
            values.push(novosDados.endereco.bairro);
        }
        if (novosDados.endereco.cidade) {
            fields.push(`cidade = $${index++}`);
            values.push(novosDados.endereco.cidade);
        }
        if (novosDados.endereco.estado) {
            fields.push(`estado = $${index++}`);
            values.push(novosDados.endereco.estado);
        }
        if (novosDados.endereco.numero) {
            fields.push(`numero = $${index++}`);
            values.push(novosDados.endereco.numero);
        }
        if (novosDados.endereco.cep) {
            fields.push(`cep = $${index++}`);
            values.push(novosDados.endereco.cep);
        }
    }
    if (novosDados.coordenadas) {
        if (novosDados.coordenadas.latitude) {
            fields.push(`latitude = $${index++}`);
            values.push(novosDados.coordenadas.latitude);
        }
        if (novosDados.coordenadas.longitude) {
            fields.push(`longitude = $${index++}`);
            values.push(novosDados.coordenadas.longitude);
        }
    }
    if (novosDados.telefone) {
        fields.push(`telefone = $${index++}`);
        values.push(novosDados.telefone);
    }

    if (fields.length === 0) {
        throw new Error('Nenhum campo para atualizar.');
    }
    
    console.log(fields.join(', '), values)
    const query = `UPDATE lojas SET ${fields.join(', ')} WHERE id = $${index}`;
    values.push(id);

    await pool.query(query, values); 
}

export { Loja, criarLoja, buscarLojaPorId, atualizarLoja };
