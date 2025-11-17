export interface User {
  id: string;
  name: string;
  email?: string;
  password: string;
  role: 'admin' | 'voter';
  votedIn: string[]; // Array de IDs de votaciones en las que ya votó
  createdAt?: Date;
}

export interface CreateUserData {
  name: string;
  email?: string;
  password: string;
  role: 'admin' | 'voter';
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
}