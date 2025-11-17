import { CorsOptions } from 'cors';
import { env } from './env';

export const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = [
      env.cors.origin,
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'https://votapp-backend-w939.onrender.com',
      'https://votapp-frontend.onrender.com', // ← TU FRONTEND
    ];

    // Permitir peticiones sin origin
    if (!origin) {
      return callback(null, true);
    }

    // En desarrollo, permitir todos
    if (env.server.nodeEnv === 'development') {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`⚠️ Origen bloqueado por CORS: ${origin}`);
      callback(null, true); // Permisivo por ahora para testing
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 86400,
};