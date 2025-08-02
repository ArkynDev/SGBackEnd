import { Request, Response } from 'express';
import { db } from '../db/connection';

export async function listarUsuarios(req: Request, res: Response) {
    try {
        const [rows] = await db.execute('SELECT id, nome, telefone, cargo, estado, ultimo_acesso FROM usuarios');
        res.status(200).json(rows);
    } catch (error) {
        console.error("Erro ao listar usuários:", error);
        res.status(500).json({ erro: 'Erro ao listar usuários' });
    }
}

export async function adicionarUsuario(req: Request, res: Response) {
    const { nome, cpf, telefone, email, cargo, estado } = req.body;

    try {
        await db.execute(
        `INSERT INTO usuarios (nome, cpf, telefone, email, cargo, estado, data_criacao, data_modificacao)
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [nome, cpf, telefone, email, cargo, estado]
        );
        res.status(201).json({ mensagem: 'Usuário criado com sucesso' });
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        res.status(500).json({ erro: 'Erro ao criar usuário' });
    }
}

export async function editarUsuario(req: Request, res: Response) {
    const { id } = req.params;
    const { nome, cpf, telefone, email, cargo, estado } = req.body;

    try {
        await db.execute(
        `UPDATE usuarios SET nome = ?, cpf = ?, telefone = ?, email = ?, cargo = ?, estado = ?, data_modificacao = NOW() WHERE id = ?`,
        [nome, cpf, telefone, email, cargo, estado, id]
        );
        res.status(200).json({ mensagem: 'Usuário atualizado com sucesso' });
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        res.status(500).json({ erro: 'Erro ao atualizar usuário' });
    }
}

export async function desativarUsuario(req: Request, res: Response) {
    const { id } = req.params;

    try {
        await db.execute(
        `UPDATE usuarios SET estado = 'desativado', data_modificacao = NOW() WHERE id = ?`,
        [id]
        );
        res.status(200).json({ mensagem: 'Usuário desativado com sucesso' });
    } catch (error) {
        console.error("Erro ao desativar usuário:", error);
        res.status(500).json({ erro: 'Erro ao desativar usuário' });
    }
}

export async function registrarAcesso(req: Request, res: Response) {
    const { id } = req.params;

    try {
        await db.execute(
        `UPDATE usuarios SET ultimo_acesso = NOW(), data_modificacao = NOW() WHERE id = ?`,
        [id]
        );
        res.status(200).json({ mensagem: 'Último acesso registrado' });
    } catch (error) {
        console.error("Erro ao registrar acesso:", error);
        res.status(500).json({ erro: 'Erro ao registrar acesso' });
    }
}

export async function marcarOnline(req: Request, res: Response) {
    const { id } = req.params;

    try {
        await db.execute(
        `UPDATE usuarios SET status = 'online', data_modificacao = NOW() WHERE id = ?`,
        [id]
        );
        res.status(200).json({ mensagem: 'Usuário marcado como online' });
    } catch (error) {
        console.error("Erro ao marcar usuário como online:", error);
        res.status(500).json({ erro: 'Erro ao marcar usuário como online' });
    }
}

export async function marcarOffline(req: Request, res: Response) {
    const { id } = req.params;

    try {
        await db.execute(
        `UPDATE usuarios SET status = 'offline', data_modificacao = NOW() WHERE id = ?`,
        [id]
        );
        res.status(200).json({ mensagem: 'Usuário marcado como offline' });
    } catch (error) {
        console.error("Erro ao marcar usuário como offline:", error);
        res.status(500).json({ erro: 'Erro ao marcar usuário como offline' });
    }
}