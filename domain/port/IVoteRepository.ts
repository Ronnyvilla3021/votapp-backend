import { Vote, CreateVoteData } from '../entities/Vote';

export interface IVoteRepository {
  /**
   * Registrar un nuevo voto
   */
  create(voteData: CreateVoteData): Promise<Vote>;

  /**
   * Buscar voto por ID
   */
  findById(id: string): Promise<Vote | null>;

  /**
   * Obtener todos los votos de una votación específica
   */
  findByVotingId(votingId: string): Promise<Vote[]>;

  /**
   * Obtener todos los votos de un usuario específico
   */
  findByUserId(userId: string): Promise<Vote[]>;

  /**
   * Verificar si un usuario ya votó en una votación
   */
  hasUserVoted(userId: string, votingId: string): Promise<boolean>;

  /**
   * Contar votos por opción en una votación
   */
  countVotesByOption(votingId: string, optionId: string): Promise<number>;

  /**
   * Eliminar todos los votos de una votación
   */
  deleteByVotingId(votingId: string): Promise<number>;
}