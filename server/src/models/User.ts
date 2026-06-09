export type Role = 'admin' | 'employee';

export interface IUser {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: Role;
  created_at: string;
}
