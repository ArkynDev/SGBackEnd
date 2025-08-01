import { Request, Response } from 'express';
import { db } from '../db/connection';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta';

export async function login(req: Request, res: Response) {
    const identificador = req.body.identificador?.trim().toLowerCase();
    const senha = req.body.senha;

    console.log(`🔐 Tentativa de login com identificador: ${identificador}`);

    if (!identificador || !senha) {
        return res.status(400).json({ erro: 'Identificador e senha são obrigatórios' });
    }

    try {
        const [rows] = await db.execute(
        `SELECT * FROM usuarios 
        WHERE (LOWER(email) = ? OR LOWER(nome) = ?) 
        AND estado = 'ativo' 
        LIMIT 1`,
        [identificador, identificador]
        );

        const usuario = Array.isArray(rows) ? rows[0] : null;

        if (!usuario) {
        return res.status(404).json({
            erro: 'Usuário não encontrado. Verifique se o nome ou email estão corretos ou se a conta está ativa.',
        });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

        if (!senhaValida) {
        return res.status(401).json({ erro: 'Senha incorreta' });
        }

        await db.execute(
        `UPDATE usuarios SET ultimo_acesso = NOW() WHERE id = ?`,
        [usuario.id]
        );

        const token = jwt.sign(
        {
            id: usuario.id,
            nome: usuario.nome,
            cargo: usuario.cargo,
        },
        JWT_SECRET,
        { expiresIn: '2h' }
        );

        res.status(200).json({
        success: true,
        mensagem: 'Login realizado com sucesso',
        token,
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            cargo: usuario.cargo,
            estado: usuario.estado,
        },
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ erro: 'Erro interno ao realizar login' });
    }
}