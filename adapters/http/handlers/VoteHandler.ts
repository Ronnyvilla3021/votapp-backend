import { Request, Response, NextFunction } from 'express';
import { VoteService } from '../../../core/services/VoteService';
import { CastVoteDtoValidator } from '../../../core/services/dtos/CastVoteDto';

export class VoteHandler {
  constructor(private voteService: VoteService) {}

  /**
   * POST /api/votes
   * Emitir un voto
   */
  castVote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Usuario no autenticado',
        });
        return;
      }

      // Validar datos de entrada
      const voteDto = CastVoteDtoValidator.validate(req.body);

      // Emitir voto
      const vote = await this.voteService.castVote(
        voteDto.votingId,
        voteDto.optionId,
        req.user.userId
      );

      res.status(201).json({
        success: true,
        message: 'Voto registrado exitosamente',
        data: vote,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/votes/voting/:id/results
   * Obtener resultados de una votación por ID
   */
  getVotingResults = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const results = await this.voteService.getVotingResults(id);

      res.status(200).json({
        success: true,
        message: 'Resultados obtenidos',
        data: results,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/votes/voting/code/:code/results
   * Obtener resultados de una votación por código
   */
  getVotingResultsByCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { code } = req.params;

      const results = await this.voteService.getVotingResultsByCode(code);

      res.status(200).json({
        success: true,
        message: 'Resultados obtenidos',
        data: results,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/votes/user/:votingId/has-voted
   * Verificar si el usuario actual ya votó en una votación
   */
  checkUserVoted = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Usuario no autenticado',
        });
        return;
      }

      const { votingId } = req.params;

      const hasVoted = await this.voteService.hasUserVoted(req.user.userId, votingId);

      res.status(200).json({
        success: true,
        message: 'Estado de votación verificado',
        data: {
          hasVoted,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/votes/user/my-votes
   * Obtener votos del usuario autenticado
   */
  getUserVotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Usuario no autenticado',
        });
        return;
      }

      const votes = await this.voteService.getUserVotes(req.user.userId);

      res.status(200).json({
        success: true,
        message: 'Votos del usuario obtenidos',
        data: votes,
      });
    } catch (error) {
      next(error);
    }
  };
}