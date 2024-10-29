// db/database.ts
import { Pool } from 'pg';
import * as logger from 'c:/Users/ESTENIO/prog/estagio-compas/p1.2/E-commerce/bakend/utils/logger';
import dotenv from 'dotenv';
import { error } from 'console';

dotenv.config();

const pool = new Pool({
    max: 10, // Equivalente a connectionLimit no MySQL
    host: process.env.DB_HOST,
    user: process.env.DB_USER, // Substitua pelo usuário do PostgreSQL
    password: process.env.DB_PASS, // Substitua pela senha do PostgreSQL, se houver
    database: process.env.DB_NAME, // Nome do banco de dados
    port: Number(process.env.DB_PORT), // Porta padrão do PostgreSQL
    // URL de conexão com o PostgreSQL
});


export const conn = async () => {
    try {
        await pool.connect();
        logger.loggerConn.info('Conectado ao banco de dados com sucesso');
        console.log('Conectado ao banco de dados com sucesso');
    } catch (err:any) {
        console.error('Erro ao conectar-se ao banco de dados', err);
        logger.loggerConn.error('Erro ao conectar-se ao banco de dados', error, err.message);
    }
};

conn()

export default pool;
