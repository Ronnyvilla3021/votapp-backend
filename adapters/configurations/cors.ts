import { CorsOptions } from 'cors';
import { env } from './env';

export const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = [
      env.cors.origin,
      'http://localhost:5173', // Vite dev
      'http://localhost:5174', // Vite dev alternativo
      'http://localhost:3000', // React dev
      'https://votapp-backend-w939.onrender.com', // Tu backend en Render
      'https://tu-frontend.onrender.com',
    ];

    // Permitir peticiones sin origin (útil para Postman, curl, health checks, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // En desarrollo, permitir todos los orígenes
    if (env.server.nodeEnv === 'development') {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`⚠️ Origen bloqueado por CORS: ${origin}`);
      // En producción, puedes cambiar esto a callback(new Error('No permitido por CORS'))
      // Por ahora lo dejamos permisivo para testing
      callback(null, true);
    }
  },
  credentials: true, // Permitir cookies y headers de autenticación
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 86400, // 24 horas de cache para preflight requests
};