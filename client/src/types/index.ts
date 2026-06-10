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

export type AdminTabParamList = {
  Dashboard: undefined;
  Employees: undefined;
  Profile: undefined;
};

export type AdminStackParamList = {
  AdminTabs: undefined;
  CreateEmployee: undefined;
  CreateTask: { task?: Task } | undefined;
  TaskDetails: { task: Task };
};

export type EmployeeTabParamList = {
  Dashboard: undefined;
  Profile: undefined;
};

export type EmployeeStackParamList = {
  EmployeeTabs: undefined;
  TaskDetails: { task: Task };
};
