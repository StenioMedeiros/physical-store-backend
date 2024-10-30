// src/index.ts
import express from 'express';
import  pool  from './db/database'; 
import dotenv from 'dotenv';
import LojaRoutes from './routes/lojaRoutes';
import {logConn } from 'c:/Users/ESTENIO/prog/estagio-compas/p1.2/E-commerce/bakend/utils/logger';

dotenv.config();


const PORT = process.env.PORT || 5000;

const app = express();

// Configura resposta em JSON
app.use(express.json());



app.use('/lojas', LojaRoutes);




// Conectar ao servidor
app.listen(PORT, () => {
    logConn(`Servidor rodando na porta ${PORT}`);
    console.log(`Servidor rodando na porta ${PORT}`);
});
pool.connect((err, client, release) => {
  if (err) {
    console.error('Erro ao conectar ao PostgreSQL:', err);
    return;
  }

  console.log('Conectado ao PostgreSQL!');
  // Libera o cliente após uso
  release();
});