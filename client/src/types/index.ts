export type Role = 'admin' | 'employee';

export interface User {
  id: string;
  email: string;
  role: Role;
  name?: string;
}

export type RootStackParamList = {
  Auth: undefined;
  AdminApp: undefined;
  EmployeeApp: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};

export type AdminStackParamList = {
  AdminDashboard: undefined;
};

export type EmployeeStackParamList = {
  EmployeeDashboard: undefined;
};
