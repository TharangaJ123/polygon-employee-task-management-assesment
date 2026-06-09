import pool from '../config/db.js';
import { type ITask, type TaskStatus } from '../models/Task.js';

export class TaskService {
  static async getAllTasks(): Promise<ITask[]> {
    const query = `
      SELECT t.*, u.name as assignee_name, u.email as assignee_email 
      FROM tasks t 
      LEFT JOIN users u ON t.assignee_id = u.id
      ORDER BY t.created_at DESC
    `;
    const [rows] = await pool.query(query);
    return rows as ITask[];
  }

  static async getTasksByAssignee(assigneeId: number): Promise<ITask[]> {
    const query = `
      SELECT t.*, u.name as assignee_name, u.email as assignee_email 
      FROM tasks t 
      LEFT JOIN users u ON t.assignee_id = u.id
      WHERE t.assignee_id = ?
      ORDER BY t.created_at DESC
    `;
    const [rows] = await pool.query(query, [assigneeId]);
    return rows as ITask[];
  }

  static async createTask(title: string, description: string | null, assigneeId: number | null, creatorId: number): Promise<number> {
    const [result]: any = await pool.query(
      'INSERT INTO tasks (title, description, assignee_id, creator_id) VALUES (?, ?, ?, ?)',
      [title, description, assigneeId, creatorId]
    );
    return result.insertId;
  }

  static async updateTaskFull(taskId: number, title: string, description: string | null, status: TaskStatus, assigneeId: number | null): Promise<void> {
    await pool.query(
      'UPDATE tasks SET title = ?, description = ?, status = ?, assignee_id = ? WHERE id = ?',
      [title, description, status, assigneeId, taskId]
    );
  }

  static async getTaskAssigneeId(taskId: number): Promise<number | null> {
    const [rows]: any = await pool.query('SELECT assignee_id FROM tasks WHERE id = ?', [taskId]);
    if (rows.length === 0) return null;
    return rows[0].assignee_id;
  }

  static async updateTaskStatus(taskId: number, status: TaskStatus): Promise<void> {
    await pool.query(
      'UPDATE tasks SET status = ? WHERE id = ?',
      [status, taskId]
    );
  }

  static async deleteTask(taskId: number): Promise<void> {
    await pool.query('DELETE FROM tasks WHERE id = ?', [taskId]);
  }
}
