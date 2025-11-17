import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../../core/services/AuthService';
import { LoginDtoValidator } from '../../../core/services/dtos/LoginDto';

export class AuthHandler {
  constructor(private authService: AuthService) {}

  /**
   * POST /api/auth/login
   * Login de usuario
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validar datos de entrada
      const loginDto = LoginDtoValidator.validate(req.body);

      // Ejecutar login
      const result = await this.authService.login(loginDto.name, loginDto.password);

      res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/auth/me
   * Obtener usuario actual autenticado
   */
  getCurrentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Usuario no autenticado',
        });
        return;
      }

      const user = await this.authService.getCurrentUser(req.user.userId);

      res.status(200).json({
        success: true,
        message: 'Usuario obtenido',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/auth/logout
   * Logout (en el frontend se elimina el token)
   */
  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({
        success: true,
        message: 'Logout exitoso',
      });
    } catch (error) {
      next(error);
    }
  };
}