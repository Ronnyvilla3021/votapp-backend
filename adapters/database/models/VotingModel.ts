import mongoose, { Schema, Document } from 'mongoose';

export interface IVotingOptionDocument {
  id: string;
  text: string;
  votes: number;
}

export interface IVotingDocument extends Document {
  title: string;
  description?: string;
  code: string;
  options: IVotingOptionDocument[];
  createdAt: string;
  closedAt?: string;
  isActive: boolean;
  createdBy?: string;
}

const VotingOptionSchema = new Schema<IVotingOptionDocument>(
  {
    id: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    votes: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    _id: false, // No crear _id automático para subdocumentos
  }
);

const VotingSchema = new Schema<IVotingDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      length: 6,
      // ELIMINADO: index: true,  <-- Esta línea causaba el warning de índice duplicado
    },
    options: {
      type: [VotingOptionSchema],
      required: true,
      validate: {
        validator: function (options: IVotingOptionDocument[]) {
          return options.length >= 2; // Mínimo 2 opciones
        },
        message: 'Debe haber al menos 2 opciones',
      },
    },
    createdAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
    closedAt: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índices para optimizar búsquedas
VotingSchema.index({ code: 1 }, { unique: true });
VotingSchema.index({ isActive: 1 });
VotingSchema.index({ createdBy: 1 });

export const VotingModel = mongoose.model<IVotingDocument>('Voting', VotingSchema);