import pool from '../../db/database';
import { logInfo, logError } from '../../utils/logger';

export async function deleteStoreService(id: string) {
    const result = await pool.query('DELETE FROM lojas WHERE id = $1', [id]);
    if (result.rowCount === 0) {
        throw new Error('Loja não encontrada');
    }
    logInfo(`Loja apagada com sucesso. ID: ${id}`);
}
