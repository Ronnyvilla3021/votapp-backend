import { User, CreateUserData, UpdateUserData } from '../entities/User';

export interface IUserRepository {
  /**
   * Crear un nuevo usuario
   */
  create(userData: CreateUserData): Promise<User>;

  /**
   * Buscar usuario por ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Buscar usuario por nombre
   */
  findByName(name: string): Promise<User | null>;

  /**
   * Buscar usuario por email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Obtener todos los usuarios
   */
  findAll(): Promise<User[]>;

  /**
   * Actualizar usuario
   */
  update(id: string, updateData: UpdateUserData): Promise<User | null>;

  /**
   * Eliminar usuario
   */
  delete(id: string): Promise<boolean>;

  /**
   * Agregar una votación al array votedIn del usuario
   */
  addVotedVoting(userId: string, votingId: string): Promise<User | null>;

  /**
   * Verificar si un usuario ya votó en una votación específica
   */
  hasVotedIn(userId: string, votingId: string): Promise<boolean>;
}