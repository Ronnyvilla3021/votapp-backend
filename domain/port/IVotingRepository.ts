import { Voting, CreateVotingData, UpdateVotingData } from '../entities/Voting';

export interface IVotingRepository {
  /**
   * Crear una nueva votación
   */
  create(votingData: CreateVotingData): Promise<Voting>;

  /**
   * Buscar votación por ID
   */
  findById(id: string): Promise<Voting | null>;

  /**
   * Buscar votación por código único
   */
  findByCode(code: string): Promise<Voting | null>;

  /**
   * Obtener todas las votaciones
   */
  findAll(): Promise<Voting[]>;

  /**
   * Obtener votaciones activas
   */
  findActive(): Promise<Voting[]>;

  /**
   * Obtener votaciones creadas por un admin específico
   */
  findByCreator(creatorId: string): Promise<Voting[]>;

  /**
   * Actualizar votación
   */
  update(id: string, updateData: UpdateVotingData): Promise<Voting | null>;

  /**
   * Eliminar votación
   */
  delete(id: string): Promise<boolean>;

  /**
   * Incrementar votos de una opción específica
   */
  incrementOptionVotes(votingId: string, optionId: string): Promise<Voting | null>;

  /**
   * Cerrar una votación (desactivar)
   */
  close(id: string): Promise<Voting | null>;

  /**
   * Generar un código único de 6 caracteres
   */
  generateUniqueCode(): Promise<string>;
}