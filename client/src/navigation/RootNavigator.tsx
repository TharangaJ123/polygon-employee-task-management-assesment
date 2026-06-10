import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

import LoginScreen from '../screens/LoginScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import EmployeesListScreen from '../screens/EmployeesListScreen';
import EmployeeDashboardScreen from '../screens/EmployeeDashboardScreen';
import CreateTaskScreen from '../screens/CreateTaskScreen';
import TaskDetailsScreen from '../screens/TaskDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { AuthStackParamList, AdminStackParamList, EmployeeStackParamList } from '../types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AdminStack = createNativeStackNavigator<AdminStackParamList>();
const EmployeeStack = createNativeStackNavigator<EmployeeStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
}

function AdminNavigator() {
  return (
    <AdminStack.Navigator screenOptions={{ headerShown: false }}>
      <AdminStack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <AdminStack.Screen name="EmployeesList" component={EmployeesListScreen} />
      <AdminStack.Screen name="CreateTask" component={CreateTaskScreen} />
      <AdminStack.Screen name="TaskDetails" component={TaskDetailsScreen} />
    </AdminStack.Navigator>
  );
}

function EmployeeNavigator() {
  return (
    <EmployeeStack.Navigator screenOptions={{ headerShown: false }}>
      <EmployeeStack.Screen name="EmployeeDashboard" component={EmployeeDashboardScreen} />
      <EmployeeStack.Screen name="TaskDetails" component={TaskDetailsScreen} />
      <EmployeeStack.Screen name="Profile" component={ProfileScreen} />
    </EmployeeStack.Navigator>
  );
}

export default function RootNavigator() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  return (
    <NavigationContainer>
      {!isAuthenticated || !user ? (
        <AuthNavigator />
      ) : user.role === 'admin' ? (
        <AdminNavigator />
      ) : (
        <EmployeeNavigator />
      )}
    </NavigationContainer>
  );
}
