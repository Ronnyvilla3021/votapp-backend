import mongoose, { Schema, Document } from 'mongoose';

export interface IUserDocument extends Document {
  name: string;
  email?: string;
  password: string;
  role: 'admin' | 'voter';
  votedIn: string[];
  createdAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'voter'],
      required: true,
      default: 'voter',
    },
    votedIn: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índices para optimizar búsquedas
UserSchema.index({ name: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);