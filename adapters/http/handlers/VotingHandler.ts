import { Request, Response, NextFunction } from 'express';
import { VotingService } from '../../../core/services/VotingService';
import { CreateVotingDtoValidator } from '../../../core/services/dtos/CreateVotingDto';

export class VotingHandler {
  constructor(private votingService: VotingService) {}

  /**
   * POST /api/votings
   * Crear nueva votación (solo admin)
   */
  createVoting = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Usuario no autenticado',
        });
        return;
      }

      // Validar datos de entrada
      const votingDto = CreateVotingDtoValidator.validate(req.body);

      // Crear votación
      const voting = await this.votingService.createVoting(votingDto, req.user.userId);

      res.status(201).json({
        success: true,
        message: 'Votación creada exitosamente',
        data: voting,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/votings
   * Obtener todas las votaciones
   */
  getAllVotings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const votings = await this.votingService.getAllVotings();

      res.status(200).json({
        success: true,
        message: 'Votaciones obtenidas',
        data: votings,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/votings/active
   * Obtener solo votaciones activas
   */
  getActiveVotings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const votings = await this.votingService.getActiveVotings();

      res.status(200).json({
        success: true,
        message: 'Votaciones activas obtenidas',
        data: votings,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/votings/code/:code
   * Buscar votación por código
   */
  getVotingByCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { code } = req.params;

      const voting = await this.votingService.getVotingByCode(code);

      res.status(200).json({
        success: true,
        message: 'Votación encontrada',
        data: voting,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/votings/:id
   * Obtener votación por ID
   */
  getVotingById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const voting = await this.votingService.getVotingById(id);

      res.status(200).json({
        success: true,
        message: 'Votación obtenida',
        data: voting,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/votings/:id
   * Actualizar votación (solo admin creador)
   */
  updateVoting = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Usuario no autenticado',
        });
        return;
      }

      const { id } = req.params;

      const voting = await this.votingService.updateVoting(id, req.body, req.user.userId);

      res.status(200).json({
        success: true,
        message: 'Votación actualizada',
        data: voting,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/votings/:id
   * Eliminar votación (solo admin creador)
   */
  deleteVoting = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Usuario no autenticado',
        });
        return;
      }

      const { id } = req.params;

      await this.votingService.deleteVoting(id, req.user.userId);

      res.status(200).json({
        success: true,
        message: 'Votación eliminada',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/votings/:id/close
   * Cerrar votación (solo admin creador)
   */
  closeVoting = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Usuario no autenticado',
        });
        return;
      }

      const { id } = req.params;

      const voting = await this.votingService.closeVoting(id, req.user.userId);

      res.status(200).json({
        success: true,
        message: 'Votación cerrada',
        data: voting,
      });
    } catch (error) {
      next(error);
    }
  };
}