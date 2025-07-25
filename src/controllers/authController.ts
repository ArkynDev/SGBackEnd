import { Request, Response } from 'express';
import { db } from '../db/connection';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta';

export async function login(req: Request, res: Response) {
    const { identificador, senha } = req.body;

    if (!identificador || !senha) {
        return res.status(400).json({ erro: 'Identificador e senha são obrigatórios' });
    }

    try {
        const [rows] = await db.execute(
        `SELECT * FROM usuarios WHERE (email = ? OR nome = ?) AND estado = 'ativo' LIMIT 1`,
        [identificador, identificador]
        );

        console.log('Resultado da consulta:', rows);

        const usuario = Array.isArray(rows) ? rows[0] : null;

        if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado ou desativado' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

        if (!senhaValida) {
        return res.status(401).json({ erro: 'Senha incorreta' });
        }

        await db.execute(
        `UPDATE usuarios SET ultimo_acesso = NOW() WHERE id = ?`,
        [usuario.id]
        );

        // Gerar token JWT
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