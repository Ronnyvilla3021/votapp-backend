import { Request, Response, NextFunction } from 'express';
import { JWTUtil } from '../../../shared/utils/jwt';
import { UnauthorizedError, ForbiddenError } from '../../../shared/errors/errorTypes';

// Extender el tipo Request de Express para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        name: string;
        role: 'admin' | 'voter';
      };
    }
  }
}

/**
 * Middleware para verificar autenticación JWT
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    // Extraer token del header
    const token = JWTUtil.extractTokenFromHeader(authHeader);

    if (!token) {
      throw new UnauthorizedError('Token no proporcionado');
    }

    // Verificar y decodificar token
    const payload = JWTUtil.verifyToken(token);

    // Agregar datos del usuario al request
    req.user = {
      userId: payload.userId,
      name: payload.name,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware para verificar que el usuario sea admin
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Usuario no autenticado');
    }

    if (req.user.role !== 'admin') {
      throw new ForbiddenError('Acceso restringido a administradores');
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware para verificar que el usuario sea voter
 */
export const requireVoter = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Usuario no autenticado');
    }

    if (req.user.role !== 'voter') {
      throw new ForbiddenError('Acceso restringido a votantes');
    }

    next();
  } catch (error) {
    next(error);
  }
};