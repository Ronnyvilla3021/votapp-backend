import { IVoteRepository } from '../../../domain/port/IVoteRepository';
import { Vote, CreateVoteData } from '../../../domain/entities/Vote';
import { VoteModel } from '../models/VoteModel';

export class MongoVoteRepository implements IVoteRepository {
  async create(voteData: CreateVoteData): Promise<Vote> {
    const vote = await VoteModel.create({
      ...voteData,
      timestamp: new Date(),
    });

    return this.toEntity(vote);
  }

  async findById(id: string): Promise<Vote | null> {
    const vote = await VoteModel.findById(id);
    return vote ? this.toEntity(vote) : null;
  }

  async findByVotingId(votingId: string): Promise<Vote[]> {
    const votes = await VoteModel.find({ votingId });
    return votes.map((vote) => this.toEntity(vote));
  }

  async findByUserId(userId: string): Promise<Vote[]> {
    const votes = await VoteModel.find({ userId });
    return votes.map((vote) => this.toEntity(vote));
  }

  async hasUserVoted(userId: string, votingId: string): Promise<boolean> {
    const vote = await VoteModel.findOne({ userId, votingId });
    return vote !== null;
  }

  async countVotesByOption(votingId: string, optionId: string): Promise<number> {
    const count = await VoteModel.countDocuments({ votingId, optionId });
    return count;
  }

  async deleteByVotingId(votingId: string): Promise<number> {
    const result = await VoteModel.deleteMany({ votingId });
    return result.deletedCount || 0;
  }

  // Mapper: Convierte documento de Mongoose a entidad de dominio
  private toEntity(doc: any): Vote {
    return {
      id: doc._id.toString(),
      votingId: doc.votingId,
      optionId: doc.optionId,
      userId: doc.userId,
      timestamp: doc.timestamp,
      isAnonymous: doc.isAnonymous || false,
    };
  }
}