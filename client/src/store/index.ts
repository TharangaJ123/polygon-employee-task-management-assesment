import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import tasksReducer from './slices/tasksSlice';
import employeesReducer from './slices/employeesSlice';

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
};

const themePersistConfig = {
  key: 'theme',
  storage: AsyncStorage,
};

const tasksPersistConfig = {
  key: 'tasks',
  storage: AsyncStorage,
};

const employeesPersistConfig = {
  key: 'employees',
  storage: AsyncStorage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedThemeReducer = persistReducer(themePersistConfig, themeReducer);
const persistedTasksReducer = persistReducer(tasksPersistConfig, tasksReducer);
const persistedEmployeesReducer = persistReducer(employeesPersistConfig, employeesReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    theme: persistedThemeReducer,
    tasks: persistedTasksReducer,
    employees: persistedEmployeesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
