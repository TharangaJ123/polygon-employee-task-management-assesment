import employeesReducer, { setEmployees, addEmployee, clearEmployees } from '../employeesSlice';
import { User } from '../../../types';

describe('employeesSlice', () => {
  const initialState = {
    employees: [] as User[],
    lastFetched: null as number | null,
  };

  const mockEmployee1: User = {
    id: '1',
    name: 'Alice',
    email: 'alice@test.com',
    role: 'employee',
  };

  const mockEmployee2: User = {
    id: '2',
    name: 'Bob',
    email: 'bob@test.com',
    role: 'employee',
  };

  it('should return initial state', () => {
    expect(employeesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setEmployees', () => {
    const action = setEmployees([mockEmployee1, mockEmployee2]);
    const nextState = employeesReducer(initialState, action);
    expect(nextState.employees).toHaveLength(2);
    expect(nextState.employees).toEqual([mockEmployee1, mockEmployee2]);
    expect(nextState.lastFetched).not.toBeNull();
  });

  it('should handle addEmployee', () => {
    const stateWithOne = { employees: [mockEmployee1], lastFetched: 123 };
    const action = addEmployee(mockEmployee2);
    const nextState = employeesReducer(stateWithOne, action);
    expect(nextState.employees).toEqual([mockEmployee1, mockEmployee2]);
  });

  it('should handle clearEmployees', () => {
    const stateWithEmployees = { employees: [mockEmployee1], lastFetched: 123 };
    const action = clearEmployees();
    const nextState = employeesReducer(stateWithEmployees, action);
    expect(nextState.employees).toEqual([]);
    expect(nextState.lastFetched).toBeNull();
  });
});
