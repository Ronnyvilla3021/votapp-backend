import { IVotingRepository } from '../../domain/port/IVotingRepository';
import { Voting, CreateVotingData, UpdateVotingData } from '../../domain/entities/Voting';
import { NotFoundError, ForbiddenError, BadRequestError } from '../../shared/errors/errorTypes';

export class VotingService {
  constructor(private votingRepository: IVotingRepository) {}

  /**
   * Crear una nueva votación (solo admin)
   * @param votingData - Datos de la votación
   * @param creatorId - ID del usuario que crea la votación
   * @returns Votación creada
   */
  async createVoting(votingData: CreateVotingData, creatorId: string): Promise<Voting> {
    const voting = await this.votingRepository.create({
      ...votingData,
      createdBy: creatorId,
    });

    return voting;
  }

  /**
   * Obtener todas las votaciones
   * @returns Lista de votaciones
   */
  async getAllVotings(): Promise<Voting[]> {
    return await this.votingRepository.findAll();
  }

  /**
   * Obtener solo votaciones activas
   * @returns Lista de votaciones activas
   */
  async getActiveVotings(): Promise<Voting[]> {
    return await this.votingRepository.findActive();
  }

  /**
   * Buscar votación por código
   * @param code - Código de 6 caracteres
   * @returns Votación encontrada
   */
  async getVotingByCode(code: string): Promise<Voting> {
    const voting = await this.votingRepository.findByCode(code);

    if (!voting) {
      throw new NotFoundError('Votación no encontrada con ese código');
    }

    return voting;
  }

  /**
   * Buscar votación por ID
   * @param id - ID de la votación
   * @returns Votación encontrada
   */
  async getVotingById(id: string): Promise<Voting> {
    const voting = await this.votingRepository.findById(id);

    if (!voting) {
      throw new NotFoundError('Votación no encontrada');
    }

    return voting;
  }

  /**
   * Actualizar votación (solo admin)
   * @param id - ID de la votación
   * @param updateData - Datos a actualizar
   * @param userId - ID del usuario que actualiza
   * @returns Votación actualizada
   */
  async updateVoting(id: string, updateData: UpdateVotingData, userId: string): Promise<Voting> {
    const voting = await this.votingRepository.findById(id);

    if (!voting) {
      throw new NotFoundError('Votación no encontrada');
    }

    // Verificar que el usuario sea el creador
    if (voting.createdBy && voting.createdBy !== userId) {
      throw new ForbiddenError('No tienes permiso para modificar esta votación');
    }

    const updated = await this.votingRepository.update(id, updateData);

    if (!updated) {
      throw new BadRequestError('Error al actualizar votación');
    }

    return updated;
  }

  /**
   * Eliminar votación (solo admin)
   * @param id - ID de la votación
   * @param userId - ID del usuario que elimina
   * @returns true si se eliminó
   */
  async deleteVoting(id: string, userId: string): Promise<boolean> {
    const voting = await this.votingRepository.findById(id);

    if (!voting) {
      throw new NotFoundError('Votación no encontrada');
    }

    // Verificar que el usuario sea el creador
    if (voting.createdBy && voting.createdBy !== userId) {
      throw new ForbiddenError('No tienes permiso para eliminar esta votación');
    }

    return await this.votingRepository.delete(id);
  }

  /**
   * Cerrar una votación (desactivar)
   * @param id - ID de la votación
   * @param userId - ID del usuario que cierra
   * @returns Votación cerrada
   */
  async closeVoting(id: string, userId: string): Promise<Voting> {
    const voting = await this.votingRepository.findById(id);

    if (!voting) {
      throw new NotFoundError('Votación no encontrada');
    }

    // Verificar que el usuario sea el creador
    if (voting.createdBy && voting.createdBy !== userId) {
      throw new ForbiddenError('No tienes permiso para cerrar esta votación');
    }

    if (!voting.isActive) {
      throw new BadRequestError('La votación ya está cerrada');
    }

    const closed = await this.votingRepository.close(id);

    if (!closed) {
      throw new BadRequestError('Error al cerrar votación');
    }

    return closed;
  }

  /**
   * Obtener votaciones creadas por un admin
   * @param adminId - ID del admin
   * @returns Lista de votaciones
   */
  async getVotingsByCreator(adminId: string): Promise<Voting[]> {
    return await this.votingRepository.findByCreator(adminId);
  }
}