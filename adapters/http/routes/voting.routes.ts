import { Router } from 'express';
import { VotingHandler } from '../handlers/VotingHandler';
import { authenticate, requireAdmin } from '../middlewares/authMiddleware';

export const createVotingRouter = (votingHandler: VotingHandler): Router => {
  const router = Router();

  /**
   * GET /api/votings
   * Obtener todas las votaciones
   * Requiere autenticación
   */
  router.get('/', authenticate, votingHandler.getAllVotings);

  /**
   * GET /api/votings/active
   * Obtener solo votaciones activas
   * Requiere autenticación
   */
  router.get('/active', authenticate, votingHandler.getActiveVotings);

  /**
   * GET /api/votings/code/:code
   * Buscar votación por código
   * Requiere autenticación
   */
  router.get('/code/:code', authenticate, votingHandler.getVotingByCode);

  /**
   * GET /api/votings/:id
   * Obtener votación por ID
   * Requiere autenticación
   */
  router.get('/:id', authenticate, votingHandler.getVotingById);

  /**
   * POST /api/votings
   * Crear nueva votación
   * Requiere autenticación y ser admin
   */
  router.post('/', authenticate, requireAdmin, votingHandler.createVoting);

  /**
   * PUT /api/votings/:id
   * Actualizar votación
   * Requiere autenticación y ser admin
   */
  router.put('/:id', authenticate, requireAdmin, votingHandler.updateVoting);

  /**
   * DELETE /api/votings/:id
   * Eliminar votación
   * Requiere autenticación y ser admin
   */
  router.delete('/:id', authenticate, requireAdmin, votingHandler.deleteVoting);

  /**
   * PATCH /api/votings/:id/close
   * Cerrar votación
   * Requiere autenticación y ser admin
   */
  router.patch('/:id/close', authenticate, requireAdmin, votingHandler.closeVoting);

  return router;
};