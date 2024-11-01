// db/database.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { logError, logConn } from '../utils/logger';

dotenv.config();

const pool = new Pool({
    max: 10, 
    host: process.env.DB_HOST,
    user: process.env.DB_USER, 
    password: process.env.DB_PASS, 
    database: process.env.DB_NAME, 
    port: Number(process.env.DB_PORT), 

});
export const conn = async () => {
    try {
        await pool.connect();
        logConn('Conectado ao banco de dados com sucesso');
        console.log('Conectado ao banco de dados com sucesso');
    } catch (error) {
        console.error('Erro ao conectar-se ao banco de dados', error);
        logError(`Erro ao conectar-se ao banco de dados ${error instanceof Error ? error.message : error}`);
    }
};

conn()



export default pool;