import { Router } from 'express';
import { VoteHandler } from '../handlers/VoteHandler';
import { authenticate } from '../middlewares/authMiddleware';

export const createVoteRouter = (voteHandler: VoteHandler): Router => {
  const router = Router();

  /**
   * POST /api/votes
   * Emitir un voto
   * Requiere autenticación
   */
  router.post('/', authenticate, voteHandler.castVote);

  /**
   * GET /api/votes/voting/:id/results
   * Obtener resultados de una votación por ID
   * Requiere autenticación
   */
  router.get('/voting/:id/results', authenticate, voteHandler.getVotingResults);

  /**
   * GET /api/votes/voting/code/:code/results
   * Obtener resultados de una votación por código
   * Requiere autenticación
   */
  router.get('/voting/code/:code/results', authenticate, voteHandler.getVotingResultsByCode);

  /**
   * GET /api/votes/user/:votingId/has-voted
   * Verificar si el usuario ya votó en una votación
   * Requiere autenticación
   */
  router.get('/user/:votingId/has-voted', authenticate, voteHandler.checkUserVoted);

  /**
   * GET /api/votes/user/my-votes
   * Obtener votos del usuario autenticado
   * Requiere autenticación
   */
  router.get('/user/my-votes', authenticate, voteHandler.getUserVotes);

  return router;
};