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
    _id: false,
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
      uppercase: true,
      length: 6,
    },
    options: {
      type: [VotingOptionSchema],
      required: true,
      validate: {
        validator: function (options: IVotingOptionDocument[]) {
          return options.length >= 2;
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

// Solo índices después del schema
VotingSchema.index({ code: 1 }, { unique: true });
VotingSchema.index({ isActive: 1 });
VotingSchema.index({ createdBy: 1 });

export const VotingModel = mongoose.model<IVotingDocument>('Voting', VotingSchema);