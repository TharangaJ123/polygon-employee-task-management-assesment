import pool from '../config/db.js';
import { type IUser } from '../models/User.js';

export class UserService {
  static async getEmployees(): Promise<any[]> {
    const [rows] = await pool.query(`
      SELECT 
        u.id, 
        u.name, 
        u.email,
        COUNT(t.id) as total_tasks,
        SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) as completed_tasks,
        SUM(CASE WHEN t.status = 'In Progress' THEN 1 ELSE 0 END) as in_progress_tasks,
        SUM(CASE WHEN t.status = 'Pending' THEN 1 ELSE 0 END) as pending_tasks
      FROM users u
      LEFT JOIN tasks t ON u.id = t.assignee_id
      WHERE u.role = 'employee'
      GROUP BY u.id
      ORDER BY u.name ASC
    `);
    return rows as any[];
  }

  static async updateProfileName(userId: number, name: string): Promise<void> {
    await pool.query('UPDATE users SET name = ? WHERE id = ?', [name, userId]);
  }

  static async getUserById(userId: number): Promise<Partial<IUser> | null> {
    const [rows]: any = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) return null;
    return rows[0] as Partial<IUser>;
  }

  static async createEmployee(name: string, email: string, passwordHash: string): Promise<number> {
    const [result]: any = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, 'employee']
    );
    return result.insertId;
  }
}
