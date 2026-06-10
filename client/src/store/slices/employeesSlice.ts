import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface EmployeesState {
  employees: User[];
  lastFetched: number | null;
}

const initialState: EmployeesState = {
  employees: [],
  lastFetched: null,
};

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setEmployees(state, action: PayloadAction<User[]>) {
      state.employees = action.payload;
      state.lastFetched = Date.now();
    },
    addEmployee(state, action: PayloadAction<User>) {
      state.employees.push(action.payload);
    },
    clearEmployees(state) {
      state.employees = [];
      state.lastFetched = null;
    }
  },
});

export const { setEmployees, addEmployee, clearEmployees } = employeesSlice.actions;
export default employeesSlice.reducer;
