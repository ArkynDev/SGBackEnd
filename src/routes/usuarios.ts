import { Router } from 'express';
import {
  listarUsuarios,
  editarUsuario,
  desativarUsuario,
  registrarAcesso,
  marcarOnline,
  marcarOffline,
  adicionarUsuario
} from '../controllers/usuariosController';

import { autenticarToken } from '../middlewares/authMiddleware';
import { autorizarAdmin } from '../middlewares/autorizarAdmin';

export const router = Router();

// 🔓 Listar e editar (qualquer usuário autenticado)
router.get('/', autenticarToken, listarUsuarios);
router.put('/:id', autenticarToken, editarUsuario);

// 🔐 Apenas administradores
router.post('/adicionar', autenticarToken, autorizarAdmin, adicionarUsuario);
router.patch('/:id/desativar', autenticarToken, autorizarAdmin, desativarUsuario);

// 🔓 Ações de status e acesso (qualquer usuário autenticado)
router.patch('/:id/acesso', autenticarToken, registrarAcesso);
router.patch('/:id/online', autenticarToken, marcarOnline);
router.patch('/:id/offline', autenticarToken, marcarOffline);