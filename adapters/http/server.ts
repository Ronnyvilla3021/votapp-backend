import express, { Application } from 'express';
import cors from 'cors';
import { corsOptions } from '../configurations/cors';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

// Importar handlers
import { AuthHandler } from './handlers/AuthHandler';
import { VotingHandler } from './handlers/VotingHandler';
import { VoteHandler } from './handlers/VoteHandler';

// Importar rutas
import { createAuthRouter } from './routes/auth.routes';
import { createVotingRouter } from './routes/voting.routes';
import { createVoteRouter } from './routes/vote.routes';

interface ServerDependencies {
  authHandler: AuthHandler;
  votingHandler: VotingHandler;
  voteHandler: VoteHandler;
}

export class Server {
  private app: Application;

  constructor(private dependencies: ServerDependencies) {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddlewares(): void {
    // CORS
    this.app.use(cors(corsOptions));

    // Body parser
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging en desarrollo
    if (process.env.NODE_ENV === 'development') {
      this.app.use((req, res, next) => {
        console.log(`📨 ${req.method} ${req.path}`);
        next();
      });
    }
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        success: true,
        message: 'VotApp API funcionando correctamente',
        timestamp: new Date().toISOString(),
      });
    });

    // API Routes
    this.app.use('/api/auth', createAuthRouter(this.dependencies.authHandler));
    this.app.use('/api/votings', createVotingRouter(this.dependencies.votingHandler));
    this.app.use('/api/votes', createVoteRouter(this.dependencies.voteHandler));

    // Ruta raíz
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'Bienvenido a VotApp API',
        version: '1.0.0',
        endpoints: {
          health: '/health',
          auth: '/api/auth',
          votings: '/api/votings',
          votes: '/api/votes',
        },
      });
    });
  }

  private setupErrorHandling(): void {
    // 404 - Ruta no encontrada
    this.app.use(notFoundHandler);

    // Manejo global de errores
    this.app.use(errorHandler);
  }

  public getApp(): Application {
    return this.app;
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      console.log('🚀 Servidor Express iniciado');
      console.log(`📡 Escuchando en puerto: ${port}`);
      console.log(`🌐 URL: http://localhost:${port}`);
      console.log(`✅ Endpoints disponibles:`);
      console.log(`   - GET  /health`);
      console.log(`   - POST /api/auth/login`);
      console.log(`   - GET  /api/auth/me`);
      console.log(`   - GET  /api/votings`);
      console.log(`   - POST /api/votings`);
      console.log(`   - POST /api/votes`);
      console.log(`   - GET  /api/votes/voting/code/:code/results`);
    });
  }
}