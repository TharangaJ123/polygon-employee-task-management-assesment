import tasksReducer, { setTasks, addTask, updateTask, removeTask, clearTasks } from '../tasksSlice';
import { Task } from '../../../types';

describe('tasksSlice', () => {
  const initialState = {
    tasks: [] as Task[],
    lastFetched: null as number | null,
  };

  const mockTask1: Task = {
    id: 1,
    title: 'Task 1',
    description: 'Description 1',
    status: 'Pending',
    assignee_id: null,
    creator_id: 1,
    created_at: '2023-01-01',
    updated_at: '2023-01-01',
  };

  const mockTask2: Task = {
    id: 2,
    title: 'Task 2',
    description: 'Description 2',
    status: 'In Progress',
    assignee_id: 2,
    creator_id: 1,
    created_at: '2023-01-02',
    updated_at: '2023-01-02',
  };

  it('should return initial state', () => {
    expect(tasksReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setTasks', () => {
    const action = setTasks([mockTask1, mockTask2]);
    const nextState = tasksReducer(initialState, action);
    expect(nextState.tasks).toHaveLength(2);
    expect(nextState.tasks).toEqual([mockTask1, mockTask2]);
    expect(nextState.lastFetched).not.toBeNull();
  });

  it('should handle addTask', () => {
    const stateWithOneTask = { tasks: [mockTask2], lastFetched: 123 };
    const action = addTask(mockTask1);
    const nextState = tasksReducer(stateWithOneTask, action);
    // Task should be prepended
    expect(nextState.tasks).toEqual([mockTask1, mockTask2]);
  });

  it('should handle updateTask', () => {
    const stateWithTask = { tasks: [mockTask1], lastFetched: 123 };
    const updatedTask = { ...mockTask1, status: 'Completed' as const };
    const action = updateTask(updatedTask);
    const nextState = tasksReducer(stateWithTask, action);
    expect(nextState.tasks[0].status).toBe('Completed');
  });

  it('should handle removeTask', () => {
    const stateWithTasks = { tasks: [mockTask1, mockTask2], lastFetched: 123 };
    const action = removeTask(1);
    const nextState = tasksReducer(stateWithTasks, action);
    expect(nextState.tasks).toEqual([mockTask2]);
  });

  it('should handle clearTasks', () => {
    const stateWithTasks = { tasks: [mockTask1], lastFetched: 123 };
    const action = clearTasks();
    const nextState = tasksReducer(stateWithTasks, action);
    expect(nextState.tasks).toEqual([]);
    expect(nextState.lastFetched).toBeNull();
  });
});
