import { Router } from 'express';
import { login } from '../controllers/authController';

export const router = Router();

router.post('/login', login);