import { IUserRepository } from '../../domain/port/IUserRepository';
import { User } from '../../domain/entities/User';
import { PasswordUtil } from '../../shared/utils/password';
import { JWTUtil } from '../../shared/utils/jwt';
import { UnauthorizedError, NotFoundError } from '../../shared/errors/errorTypes';

export class AuthService {
  constructor(private userRepository: IUserRepository) {}

  /**
   * Login de usuario
   * @param name - Nombre del usuario
   * @param password - Contraseña en texto plano
   * @returns Token JWT y datos del usuario
   */
  async login(name: string, password: string): Promise<{ token: string; user: Omit<User, 'password'> }> {
    // Buscar usuario por nombre
    const user = await this.userRepository.findByName(name);

    if (!user) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await PasswordUtil.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    // Generar token JWT
    const token = JWTUtil.generateToken({
      userId: user.id,
      name: user.name,
      role: user.role,
    });

    // Retornar token y usuario (sin contraseña)
    const { password: _, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword,
    };
  }

  /**
   * Verificar token y obtener usuario
   * @param token - Token JWT
   * @returns Usuario autenticado
   */
  async verifyToken(token: string): Promise<Omit<User, 'password'>> {
    const payload = JWTUtil.verifyToken(token);

    const user = await this.userRepository.findById(payload.userId);

    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Obtener usuario actual
   * @param userId - ID del usuario
   * @returns Usuario sin contraseña
   */
  async getCurrentUser(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}