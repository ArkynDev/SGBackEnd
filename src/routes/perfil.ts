import { Router } from 'express';
import { autenticarToken } from '../middlewares/authMiddleware';

export const router = Router();

router.get('/perfil', autenticarToken, (req, res) => {
    const usuario = req.usuario;
    res.json({ usuario });
});