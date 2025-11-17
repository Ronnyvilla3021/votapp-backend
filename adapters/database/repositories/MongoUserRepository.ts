import { IUserRepository } from '../../../domain/port/IUserRepository';
import { User, CreateUserData, UpdateUserData } from '../../../domain/entities/User';
import { UserModel } from '../models/UserModel';

export class MongoUserRepository implements IUserRepository {
  async create(userData: CreateUserData): Promise<User> {
    const user = await UserModel.create({
      ...userData,
      votedIn: [],
    });

    return this.toEntity(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    return user ? this.toEntity(user) : null;
  }

  async findByName(name: string): Promise<User | null> {
    const user = await UserModel.findOne({ name });
    return user ? this.toEntity(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    return user ? this.toEntity(user) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await UserModel.find();
    return users.map((user) => this.toEntity(user));
  }

  async update(id: string, updateData: UpdateUserData): Promise<User | null> {
    const user = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    return user ? this.toEntity(user) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return result !== null;
  }

  async addVotedVoting(userId: string, votingId: string): Promise<User | null> {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $addToSet: { votedIn: votingId } }, // $addToSet evita duplicados
      { new: true }
    );
    return user ? this.toEntity(user) : null;
  }

  async hasVotedIn(userId: string, votingId: string): Promise<boolean> {
    const user = await UserModel.findById(userId);
    if (!user) return false;
    return user.votedIn.includes(votingId);
  }

  // Mapper: Convierte documento de Mongoose a entidad de dominio
  private toEntity(doc: any): User {
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      password: doc.password,
      role: doc.role,
      votedIn: doc.votedIn || [],
      createdAt: doc.createdAt,
    };
  }
}