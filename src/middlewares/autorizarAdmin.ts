import { Request, Response, NextFunction } from 'express';

export function autorizarAdmin(req: Request, res: Response, next: NextFunction) {
    const usuario = req.usuario;

    if (!usuario || typeof usuario !== 'object') {
        return res.status(403).json({ erro: 'Acesso negado: usuário não autenticado' });
    }

    // Verifica se o cargo é 'administrador'
    if ((usuario as any).cargo !== 'administrador') {
        return res.status(403).json({ erro: 'Acesso negado: apenas administradores podem realizar esta ação' });
    }

    next();
}