import pool from '../config/db.js';
import { type IUser } from '../models/User.js';

export class UserService {
  static async getEmployees(): Promise<Partial<IUser>[]> {
    const [rows] = await pool.query('SELECT id, name, email FROM users WHERE role = "employee" ORDER BY name ASC');
    return rows as Partial<IUser>[];
  }

  static async updateProfileName(userId: number, name: string): Promise<void> {
    await pool.query('UPDATE users SET name = ? WHERE id = ?', [name, userId]);
  }

  static async getUserById(userId: number): Promise<Partial<IUser> | null> {
    const [rows]: any = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) return null;
    return rows[0] as Partial<IUser>;
  }
}
