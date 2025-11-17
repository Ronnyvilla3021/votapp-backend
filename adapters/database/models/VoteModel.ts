import mongoose, { Schema, Document } from 'mongoose';

export interface IVoteDocument extends Document {
  votingId: string;
  optionId: string;
  userId: string;
  timestamp: Date;
  isAnonymous: boolean;
}

const VoteSchema = new Schema<IVoteDocument>(
  {
    votingId: {
      type: String,
      required: true,
      index: true,
    },
    optionId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índices compuestos para optimizar búsquedas
VoteSchema.index({ votingId: 1, userId: 1 }, { unique: true }); // Un usuario solo puede votar una vez por votación
VoteSchema.index({ votingId: 1, optionId: 1 });

export const VoteModel = mongoose.model<IVoteDocument>('Vote', VoteSchema);