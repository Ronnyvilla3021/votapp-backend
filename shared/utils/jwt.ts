import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/errorTypes';

interface JWTPayload {
  userId: string;
  name: string;
  role: 'admin' | 'voter';
}

export class JWTUtil {
  /**
   * Genera un token JWT
   * @param payload - Datos a incluir en el token
   * @returns Token JWT firmado
   */
  static generateToken(payload: JWTPayload): string {
    const secret = process.env.JWT_SECRET || 'default_secret_change_me';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    // @ts-ignore - TypeScript tiene conflicto con tipos de jsonwebtoken
    return jwt.sign(payload, secret, { expiresIn });
  }

  /**
   * Verifica y decodifica un token JWT
   * @param token - Token a verificar
   * @returns Payload decodificado
   * @throws UnauthorizedError si el token es inválido
   */
  static verifyToken(token: string): JWTPayload {
    const secret = process.env.JWT_SECRET || 'default_secret_change_me';

    try {
      const decoded = jwt.verify(token, secret);
      return decoded as JWTPayload;
    } catch (error: any) {
      if (error?.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Token expirado');
      }
      if (error?.name === 'JsonWebTokenError') {
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
    return authHeader.substring(7);
  }
}