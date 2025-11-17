import { Router } from 'express';
import { AuthHandler } from '../handlers/AuthHandler';
import { authenticate } from '../middlewares/authMiddleware';

export const createAuthRouter = (authHandler: AuthHandler): Router => {
  const router = Router();

  /**
   * POST /api/auth/login
   * Login de usuario
   */
  router.post('/login', authHandler.login);

  /**
   * POST /api/auth/logout
   * Logout de usuario
   */
  router.post('/logout', authHandler.logout);

  /**
   * GET /api/auth/me
   * Obtener usuario autenticado actual
   * Requiere autenticación
   */
  router.get('/me', authenticate, authHandler.getCurrentUser);

  return router;
};