export interface VotingOption {
  id: string;
  text: string;
  votes: number;
}

export interface Voting {
  id: string;
  title: string;
  description?: string;
  code: string; // Código único de 6 caracteres
  options: VotingOption[];
  createdAt: string;
  closedAt?: string;
  isActive: boolean;
  createdBy?: string; // userId del admin que la creó
}

export interface CreateVotingData {
  title: string;
  description?: string;
  options: string[]; // Array de textos de opciones
  createdBy?: string;
}

export interface UpdateVotingData {
  title?: string;
  description?: string;
  isActive?: boolean;
  closedAt?: string;
}