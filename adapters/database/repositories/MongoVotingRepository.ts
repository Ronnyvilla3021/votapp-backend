import { IVotingRepository } from '../../../domain/port/IVotingRepository';
import { Voting, CreateVotingData, UpdateVotingData } from '../../../domain/entities/Voting';
import { VotingModel } from '../models/VotingModel';
import { v4 as uuidv4 } from 'uuid';

export class MongoVotingRepository implements IVotingRepository {
  async create(votingData: CreateVotingData): Promise<Voting> {
    const code = await this.generateUniqueCode();

    const voting = await VotingModel.create({
      title: votingData.title,
      description: votingData.description,
      code,
      options: votingData.options.map((optionText) => ({
        id: uuidv4(),
        text: optionText,
        votes: 0,
      })),
      createdBy: votingData.createdBy,
      isActive: true,
    });

    return this.toEntity(voting);
  }

  async findById(id: string): Promise<Voting | null> {
    const voting = await VotingModel.findById(id);
    return voting ? this.toEntity(voting) : null;
  }

  async findByCode(code: string): Promise<Voting | null> {
    const voting = await VotingModel.findOne({ code: code.toUpperCase() });
    return voting ? this.toEntity(voting) : null;
  }

  async findAll(): Promise<Voting[]> {
    const votings = await VotingModel.find().sort({ createdAt: -1 });
    return votings.map((voting) => this.toEntity(voting));
  }

  async findActive(): Promise<Voting[]> {
    const votings = await VotingModel.find({ isActive: true }).sort({ createdAt: -1 });
    return votings.map((voting) => this.toEntity(voting));
  }

  async findByCreator(creatorId: string): Promise<Voting[]> {
    const votings = await VotingModel.find({ createdBy: creatorId }).sort({ createdAt: -1 });
    return votings.map((voting) => this.toEntity(voting));
  }

  async update(id: string, updateData: UpdateVotingData): Promise<Voting | null> {
    const voting = await VotingModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    return voting ? this.toEntity(voting) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await VotingModel.findByIdAndDelete(id);
    return result !== null;
  }

  async incrementOptionVotes(votingId: string, optionId: string): Promise<Voting | null> {
    const voting = await VotingModel.findOneAndUpdate(
      { _id: votingId, 'options.id': optionId },
      { $inc: { 'options.$.votes': 1 } }, // Incrementar votos de la opción específica
      { new: true }
    );
    return voting ? this.toEntity(voting) : null;
  }

  async close(id: string): Promise<Voting | null> {
    const voting = await VotingModel.findByIdAndUpdate(
      id,
      {
        isActive: false,
        closedAt: new Date().toISOString(),
      },
      { new: true }
    );
    return voting ? this.toEntity(voting) : null;
  }

  async generateUniqueCode(): Promise<string> {
    let code: string;
    let exists: boolean;

    do {
      // Generar código aleatorio de 6 caracteres alfanuméricos
      code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const existing = await VotingModel.findOne({ code });
      exists = existing !== null;
    } while (exists);

    return code;
  }

  // Mapper: Convierte documento de Mongoose a entidad de dominio
  private toEntity(doc: any): Voting {
    return {
      id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      code: doc.code,
      options: doc.options.map((opt: any) => ({
        id: opt.id,
        text: opt.text,
        votes: opt.votes,
      })),
      createdAt: doc.createdAt,
      closedAt: doc.closedAt,
      isActive: doc.isActive,
      createdBy: doc.createdBy,
    };
  }
}