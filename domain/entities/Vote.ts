export interface Vote {
  id: string;
  votingId: string;
  optionId: string;
  userId: string;
  timestamp: Date;
  isAnonymous?: boolean;
}

export interface CreateVoteData {
  votingId: string;
  optionId: string;
  userId: string;
  isAnonymous?: boolean;
}