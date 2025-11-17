import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../shared/errors/AppError';
import { env } from '../../configurations/env';

interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  stack?: string;
}

/**
 * Middleware para manejo global de errores
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Si es un error operacional (AppError)
  if (err instanceof AppError) {
    const response: ErrorResponse = {
      success: false,
      message: err.message,
    };

    // En desarrollo, incluir stack trace
    if (env.server.nodeEnv === 'development') {
      response.stack = err.stack;
    }

    res.status(err.statusCode).json(response);
    return;
  }

  // Errores de Mongoose/MongoDB
  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: 'Error de validación',
      error: err.message,
    });
    return;
  }

  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: 'ID inválido',
      error: err.message,
    });
    return;
  }

  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    res.status(409).json({
      success: false,
      message: 'Recurso duplicado',
      error: 'Ya existe un registro con esos datos',
    });
    return;
  }

  // Error genérico (no manejado)
  console.error('❌ Error no manejado:', err);

  const response: ErrorResponse = {
    success: false,
    message: env.server.nodeEnv === 'development' 
      ? err.message 
      : 'Error interno del servidor',
  };

  if (env.server.nodeEnv === 'development') {
    response.error = err.message;
    response.stack = err.stack;
  }

  res.status(500).json(response);
};

/**
 * Middleware para rutas no encontradas (404)
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.path}`,
  });
};