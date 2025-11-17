import { CorsOptions } from 'cors';
import { env } from './env';

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Permitir peticiones del frontend configurado
    const allowedOrigins = [
      env.cors.origin,
      'http://localhost:5173', // Vite dev
      'http://localhost:5174', // Vite dev alternativo
      'http://localhost:3000', // React dev
    ];

    // En desarrollo, permitir peticiones sin origin (Postman, curl, etc.)
    if (!origin && env.server.nodeEnv === 'development') {
      return callback(null, true);
    }

    if (origin && allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true, // Permitir cookies y headers de autenticación
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 86400, // 24 horas de cache para preflight requests
};