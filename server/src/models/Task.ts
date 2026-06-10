export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface ITask {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  assignee_id: number | null;
  creator_id: number;
  created_at: string;
  updated_at: string;
  
  // Joined fields
  assignee_name?: string;
  assignee_email?: string;
}
