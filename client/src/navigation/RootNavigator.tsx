import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

import LoginScreen from '../screens/LoginScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import EmployeeDashboardScreen from '../screens/EmployeeDashboardScreen';
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
    </AdminStack.Navigator>
  );
}

function EmployeeNavigator() {
  return (
    <EmployeeStack.Navigator screenOptions={{ headerShown: false }}>
      <EmployeeStack.Screen name="EmployeeDashboard" component={EmployeeDashboardScreen} />
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
