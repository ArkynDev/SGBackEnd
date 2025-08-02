import express from 'express';
import cors from 'cors';
import { db } from './db/connection';
import { env } from './config/env';
import { router as authRouter } from './routes/auth';
import { router as perfilRouter } from './routes/perfil';
import { router as usuariosRouter } from './routes/usuarios';

const app = express();
const port = env.PORT || 3001;

// 🔐 Defina as origens permitidas
const allowedOrigins = [
    'http://localhost:5173',
    'http://192.168.1.10:5173', // substitua pelo IP da sua máquina
];

// ⚙️ Middleware CORS dinâmico
app.use(cors({
    origin: (origin, callback) => {
        // permite requests sem origin (Postman, CURL, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
        return callback(null, true);
        }
        callback(new Error(`CORS: origem ${origin} não permitida.`));
    },
    credentials: true,
}));

// 🚀 Middleware para interpretar JSON
app.use(express.json());

// 🔍 Rota de teste de conexão com o banco
app.get('/api/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS resultado');
        res.json({ sucesso: true, resultado: rows });
    } catch (error) {
        console.error('Erro ao conectar com o banco:', error);
        res.status(500).json({ sucesso: false, erro: 'Falha na conexão com o banco' });
    }
});

// 📦 Rotas da API
app.use('/api', authRouter);
app.use('/api', perfilRouter);
app.use('/api/usuarios', usuariosRouter);

// 🏁 Inicializa o servidor
app.listen(port, () => {
    console.log(`✅ Servidor rodando na porta ${port}`);
});