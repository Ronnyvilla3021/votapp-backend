import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

interface EnvConfig {
  mongodb: {
    uri: string;
    dbName: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  server: {
    port: number;
    nodeEnv: string;
  };
  cors: {
    origin: string;
  };
  seeds: {
    admin: {
      username: string;
      password: string;
    };
    voter1: {
      username: string;
      password: string;
    };
    voter2: {
      username: string;
      password: string;
    };
  };
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`❌ Variable de entorno requerida no encontrada: ${key}`);
  }
  return value;
};

export const env: EnvConfig = {
  mongodb: {
    uri: getEnvVar('MONGODB_URI'),
    dbName: getEnvVar('DB_NAME', 'votapp'),
  },
  jwt: {
    secret: getEnvVar('JWT_SECRET'),
    expiresIn: getEnvVar('JWT_EXPIRES_IN', '7d'),
  },
  server: {
    port: parseInt(getEnvVar('PORT', '5000'), 10),
    nodeEnv: getEnvVar('NODE_ENV', 'development'),
  },
  cors: {
    origin: getEnvVar('FRONTEND_URL', 'http://localhost:5173'),
  },
  seeds: {
    admin: {
      username: getEnvVar('ADMIN_USERNAME', 'admin'),
      password: getEnvVar('ADMIN_PASSWORD', 'admin123'),
    },
    voter1: {
      username: getEnvVar('VOTER1_USERNAME', 'voter1'),
      password: getEnvVar('VOTER1_PASSWORD', 'voter123'),
    },
    voter2: {
      username: getEnvVar('VOTER2_USERNAME', 'voter2'),
      password: getEnvVar('VOTER2_PASSWORD', 'voter123'),
    },
  },
};

// Validar configuración al importar
console.log('✅ Variables de entorno cargadas correctamente');
console.log(`🌍 Entorno: ${env.server.nodeEnv}`);
console.log(`🔌 Puerto: ${env.server.port}`);
console.log(`🌐 CORS origen: ${env.cors.origin}`);