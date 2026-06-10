export type Role = 'admin' | 'employee';

export interface User {
  id: string;
  email: string;
  role: Role;
  name?: string;
  // Progress statistics
  total_tasks?: number;
  completed_tasks?: number;
  in_progress_tasks?: number;
  pending_tasks?: number;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  assignee_id: number | null;
  creator_id: number;
  created_at: string;
  updated_at: string;
  assignee_name?: string;
  assignee_email?: string;
}

export type RootStackParamList = {
  Auth: undefined;
  AdminApp: undefined;
  EmployeeApp: undefined;
};

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
};

export type AdminStackParamList = {
  AdminDashboard: undefined;
  EmployeesList: undefined;
  CreateTask: undefined;
  TaskDetails: { task: Task };
};

export type EmployeeStackParamList = {
  EmployeeDashboard: undefined;
  TaskDetails: { task: Task };
  Profile: undefined;
};
