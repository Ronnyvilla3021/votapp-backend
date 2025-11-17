import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/errorTypes';

interface JWTPayload {
  userId: string;
  name: string;
  role: 'admin' | 'voter';
}

export class JWTUtil {
  private static secret: string = process.env.JWT_SECRET || 'default_secret_change_me';
  private static expiresIn: string = process.env.JWT_EXPIRES_IN || '7d';

  /**
   * Genera un token JWT
   * @param payload - Datos a incluir en el token
   * @returns Token JWT firmado
   */
  static generateToken(payload: JWTPayload): string {
    // @ts-ignore - TypeScript tiene problemas con los tipos de jsonwebtoken
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  /**
   * Verifica y decodifica un token JWT
   * @param token - Token a verificar
   * @returns Payload decodificado
   * @throws UnauthorizedError si el token es inválido
   */
  static verifyToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.secret) as JWTPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Token expirado');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Token inválido');
      }
      throw new UnauthorizedError('Error al verificar token');
    }
  }

  /**
   * Extrae el token del header Authorization
   * @param authHeader - Header Authorization completo
   * @returns Token extraído o null
   */
  static extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7); // Remueve "Bearer "
  }
}