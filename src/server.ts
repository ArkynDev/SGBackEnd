import express from 'express';
import cors from 'cors'; // 👈 importa o middleware CORS
import { db } from './db/connection';
import { env } from './config/env';
import { router as authRouter } from './routes/auth'; // rota de login
import { router as perfilRouter } from './routes/perfil'; // rota de perfil

const app = express();
const port = env.PORT || 3001;

// ✅ Middleware CORS para permitir acesso do front-end
app.use(cors({
  origin: 'http://localhost:5173', // permite acesso do seu front-end
  credentials: true, // se for usar cookies ou headers com auth
}));

// Middleware para interpretar JSON
app.use(express.json());

// Rota de teste de conexão com o banco
app.get('/api/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS resultado');
        res.json({ sucesso: true, resultado: rows });
    } catch (error) {
        console.error('Erro ao conectar com o banco:', error);
        res.status(500).json({ sucesso: false, erro: 'Falha na conexão com o banco' });
    }
});

// Rotas da API
app.use('/api', authRouter);
app.use('/api', perfilRouter);

// Inicializa o servidor
app.listen(port, () => {
    console.log(`✅ Servidor rodando na porta ${port}`);
});