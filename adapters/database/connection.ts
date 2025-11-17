import mongoose, { ConnectOptions } from 'mongoose';

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected: boolean = false;

  private constructor() {}

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  async connect(uri: string, dbName: string): Promise<void> {
    if (this.isConnected) {
      console.log('⚠️  Ya existe una conexión activa a MongoDB');
      return;
    }

    try {
      await mongoose.connect(uri, {
        dbName,
      } as ConnectOptions);

      this.isConnected = true;
      console.log('✅ MongoDB Atlas conectado exitosamente');
      console.log(`📦 Base de datos: ${dbName}`);
    } catch (error) {
      console.error('❌ Error conectando a MongoDB:', error);
      throw error;
    }

    // Event listeners
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    mongoose.connection.on('connected', () => {
      console.log('🔗 Mongoose conectado a MongoDB Atlas');
    });

    mongoose.connection.on('error', (err: Error) => {
      console.error('❌ Error de conexión Mongoose:', err);
      this.isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🔌 Mongoose desconectado de MongoDB Atlas');
      this.isConnected = false;
    });

    // Cerrar conexión cuando la app termina
    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.connection.close();
      this.isConnected = false;
      console.log('🛑 Conexión MongoDB cerrada correctamente');
    } catch (error) {
      console.error('❌ Error cerrando conexión MongoDB:', error);
      throw error;
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }
}

// Exportar instancia singleton
export const dbConnection = DatabaseConnection.getInstance();