import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../types';

interface TasksState {
  tasks: Task[];
  lastFetched: number | null;
}

const initialState: TasksState = {
  tasks: [],
  lastFetched: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload;
      state.lastFetched = Date.now();
    },
    addTask(state, action: PayloadAction<Task>) {
      state.tasks.unshift(action.payload);
    },
    updateTask(state, action: PayloadAction<Task>) {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    removeTask(state, action: PayloadAction<number>) {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },
    clearTasks(state) {
      state.tasks = [];
      state.lastFetched = null;
    }
  },
});

export const { setTasks, addTask, updateTask, removeTask, clearTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
