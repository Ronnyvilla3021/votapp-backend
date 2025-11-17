import { dbConnection } from './adapters/database/connection';
import { env } from './adapters/configurations/env';
import { Server } from './adapters/http/server';

// Repositorios
import { MongoUserRepository } from './adapters/database/repositories/MongoUserRepository';
import { MongoVotingRepository } from './adapters/database/repositories/MongoVotingRepository';
import { MongoVoteRepository } from './adapters/database/repositories/MongoVoteRepository';

// Servicios
import { AuthService } from './core/services/AuthService';
import { VotingService } from './core/services/VotingService';
import { VoteService } from './core/services/VoteService';

// Handlers
import { AuthHandler } from './adapters/http/handlers/AuthHandler';
import { VotingHandler } from './adapters/http/handlers/VotingHandler';
import { VoteHandler } from './adapters/http/handlers/VoteHandler';

// Utilidades
import { PasswordUtil } from './shared/utils/password';
import { UserModel } from './adapters/database/models/UserModel';

/**
 * Crear usuarios iniciales (seed)
 */
async function seedUsers(): Promise<void> {
  try {
    console.log('Verificando usuarios iniciales...');

    const userRepository = new MongoUserRepository();

    // Verificar si ya existen usuarios
    const existingUsers = await userRepository.findAll();

    if (existingUsers.length > 0) {
      console.log('Usuarios ya existen, omitiendo seed');
      return;
    }

    // Crear usuarios quemados
    const usersToCreate = [
      {
        name: env.seeds.admin.username,
        password: await PasswordUtil.hash(env.seeds.admin.password),
        role: 'admin' as const,
      },
      {
        name: env.seeds.voter1.username,
        password: await PasswordUtil.hash(env.seeds.voter1.password),
        role: 'voter' as const,
      },
      {
        name: env.seeds.voter2.username,
        password: await PasswordUtil.hash(env.seeds.voter2.password),
        role: 'voter' as const,
      },
    ];

    for (const userData of usersToCreate) {
      await userRepository.create(userData);
      console.log(`Usuario creado: ${userData.name} (${userData.role})`);
    }

    console.log('Seed de usuarios completado');
  } catch (error) {
    console.error('Error en seed de usuarios:', error);
    throw error;
  }
}

/**
 * Inicializar aplicación
 */
async function bootstrap(): Promise<void> {
  try {
    console.log('Iniciando VotApp Backend...\n');

    // 1. Conectar a MongoDB
    console.log('Conectando a MongoDB Atlas...');
    await dbConnection.connect(env.mongodb.uri, env.mongodb.dbName);
    console.log('');

    // 2. Crear usuarios iniciales
    await seedUsers();
    console.log('');

    // 3. Inicializar repositorios
    const userRepository = new MongoUserRepository();
    const votingRepository = new MongoVotingRepository();
    const voteRepository = new MongoVoteRepository();

    // 4. Inicializar servicios
    const authService = new AuthService(userRepository);
    const votingService = new VotingService(votingRepository);
    const voteService = new VoteService(voteRepository, votingRepository, userRepository);

    // 5. Inicializar handlers
    const authHandler = new AuthHandler(authService);
    const votingHandler = new VotingHandler(votingService);
    const voteHandler = new VoteHandler(voteService);

    // 6. Crear y arrancar servidor
    const server = new Server({
      authHandler,
      votingHandler,
      voteHandler,
    });

    server.start(env.server.port);

    console.log('');
    console.log('VotApp Backend listo para recibir peticiones ✨');
    console.log('');
    console.log('Usuarios de prueba:');
    console.log(`   Admin:  ${env.seeds.admin.username} / ${env.seeds.admin.password}`);
    console.log(`   Voter1: ${env.seeds.voter1.username} / ${env.seeds.voter1.password}`);
    console.log(`   Voter2: ${env.seeds.voter2.username} / ${env.seeds.voter2.password}`);
    console.log('');
  } catch (error) {
    console.error('Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

// Ejecutar aplicación
bootstrap();