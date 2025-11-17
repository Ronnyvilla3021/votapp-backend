import { IVoteRepository } from '../../domain/port/IVoteRepository';
import { IVotingRepository } from '../../domain/port/IVotingRepository';
import { IUserRepository } from '../../domain/port/IUserRepository';
import { Vote } from '../../domain/entities/Vote';
import { Voting } from '../../domain/entities/Voting';
import { NotFoundError, BadRequestError, ConflictError } from '../../shared/errors/errorTypes';

export class VoteService {
  constructor(
    private voteRepository: IVoteRepository,
    private votingRepository: IVotingRepository,
    private userRepository: IUserRepository
  ) {}

  /**
   * Emitir un voto
   * @param votingId - ID de la votación
   * @param optionId - ID de la opción seleccionada
   * @param userId - ID del usuario que vota
   * @returns Voto registrado
   */
  async castVote(votingId: string, optionId: string, userId: string): Promise<Vote> {
    // Verificar que la votación exista
    const voting = await this.votingRepository.findById(votingId);

    if (!voting) {
      throw new NotFoundError('Votación no encontrada');
    }

    // Verificar que la votación esté activa
    if (!voting.isActive) {
      throw new BadRequestError('Esta votación ya está cerrada');
    }

    // Verificar que la opción exista en la votación
    const optionExists = voting.options.some((opt) => opt.id === optionId);

    if (!optionExists) {
      throw new NotFoundError('Opción no encontrada en esta votación');
    }

    // Verificar que el usuario no haya votado ya
    const hasVoted = await this.userRepository.hasVotedIn(userId, votingId);

    if (hasVoted) {
      throw new ConflictError('Ya has votado en esta votación');
    }

    // Registrar el voto
    const vote = await this.voteRepository.create({
      votingId,
      optionId,
      userId,
      isAnonymous: false,
    });

    // Incrementar contador de votos en la opción
    await this.votingRepository.incrementOptionVotes(votingId, optionId);

    // Agregar votación al array votedIn del usuario
    await this.userRepository.addVotedVoting(userId, votingId);

    return vote;
  }

  /**
   * Obtener resultados de una votación
   * @param votingId - ID de la votación
   * @returns Votación con resultados actualizados
   */
  async getVotingResults(votingId: string): Promise<Voting> {
    const voting = await this.votingRepository.findById(votingId);

    if (!voting) {
      throw new NotFoundError('Votación no encontrada');
    }

    return voting;
  }

  /**
   * Obtener resultados por código
   * @param code - Código de la votación
   * @returns Votación con resultados
   */
  async getVotingResultsByCode(code: string): Promise<Voting> {
    const voting = await this.votingRepository.findByCode(code);

    if (!voting) {
      throw new NotFoundError('Votación no encontrada con ese código');
    }

    return voting;
  }

  /**
   * Verificar si un usuario ya votó en una votación
   * @param userId - ID del usuario
   * @param votingId - ID de la votación
   * @returns true si ya votó
   */
  async hasUserVoted(userId: string, votingId: string): Promise<boolean> {
    return await this.userRepository.hasVotedIn(userId, votingId);
  }

  /**
   * Obtener votos de un usuario
   * @param userId - ID del usuario
   * @returns Lista de votos
   */
  async getUserVotes(userId: string): Promise<Vote[]> {
    return await this.voteRepository.findByUserId(userId);
  }

  /**
   * Obtener todos los votos de una votación (solo para auditoría)
   * @param votingId - ID de la votación
   * @returns Lista de votos
   */
  async getVotingVotes(votingId: string): Promise<Vote[]> {
    return await this.voteRepository.findByVotingId(votingId);
  }
}