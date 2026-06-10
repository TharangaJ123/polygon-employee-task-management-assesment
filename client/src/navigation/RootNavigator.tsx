import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

import LoginScreen from '../screens/LoginScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import EmployeesListScreen from '../screens/EmployeesListScreen';
import EmployeeDashboardScreen from '../screens/EmployeeDashboardScreen';
import CreateTaskScreen from '../screens/CreateTaskScreen';
import TaskDetailsScreen from '../screens/TaskDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CreateEmployeeScreen from '../screens/CreateEmployeeScreen';
import { AuthStackParamList, AdminStackParamList, EmployeeStackParamList, AdminTabParamList, EmployeeTabParamList } from '../types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AdminStack = createNativeStackNavigator<AdminStackParamList>();
const EmployeeStack = createNativeStackNavigator<EmployeeStackParamList>();
const AdminTab = createBottomTabNavigator<AdminTabParamList>();
const EmployeeTab = createBottomTabNavigator<EmployeeTabParamList>();

import OnboardingScreen from '../screens/OnboardingScreen';

function AuthNavigator({ initialRouteName }: { initialRouteName: keyof AuthStackParamList }) {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRouteName}>
      <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
}

function AdminTabs() {
  const { colorScheme } = useColorScheme();
  return (
    <AdminTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: any = 'home';
          if (route.name === 'Dashboard') iconName = 'grid';
          else if (route.name === 'Employees') iconName = 'users';
          else if (route.name === 'Profile') iconName = 'user';
          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#7F246C',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#ffffff',
          borderTopColor: colorScheme === 'dark' ? '#374151' : '#e5e7eb',
        }
      })}
    >
      <AdminTab.Screen name="Dashboard" component={AdminDashboardScreen} />
      <AdminTab.Screen name="Employees" component={EmployeesListScreen} />
      <AdminTab.Screen name="Profile" component={ProfileScreen} />
    </AdminTab.Navigator>
  );
}

function EmployeeTabs() {
  const { colorScheme } = useColorScheme();
  return (
    <EmployeeTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: any = 'home';
          if (route.name === 'Dashboard') iconName = 'grid';
          else if (route.name === 'Profile') iconName = 'user';
          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#7F246C',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#ffffff',
          borderTopColor: colorScheme === 'dark' ? '#374151' : '#e5e7eb',
        }
      })}
    >
      <EmployeeTab.Screen name="Dashboard" component={EmployeeDashboardScreen} />
      <EmployeeTab.Screen name="Profile" component={ProfileScreen} />
    </EmployeeTab.Navigator>
  );
}

function AdminNavigator() {
  return (
    <AdminStack.Navigator screenOptions={{ headerShown: false }}>
      <AdminStack.Screen name="AdminTabs" component={AdminTabs} />
      <AdminStack.Screen name="CreateEmployee" component={CreateEmployeeScreen} />
      <AdminStack.Screen name="CreateTask" component={CreateTaskScreen} />
      <AdminStack.Screen name="TaskDetails" component={TaskDetailsScreen} />
    </AdminStack.Navigator>
  );
}

function EmployeeNavigator() {
  return (
    <EmployeeStack.Navigator screenOptions={{ headerShown: false }}>
      <EmployeeStack.Screen name="EmployeeTabs" component={EmployeeTabs} />
      <EmployeeStack.Screen name="TaskDetails" component={TaskDetailsScreen} />
    </EmployeeStack.Navigator>
  );
}

export default function RootNavigator() {
  const { isAuthenticated, user, hasSeenOnboarding } = useSelector((state: RootState) => state.auth);
  const { mode } = useSelector((state: RootState) => state.theme);
  const { setColorScheme, colorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(mode);
  }, [mode, setColorScheme]);

  return (
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      {!isAuthenticated || !user ? (
        <AuthNavigator initialRouteName={hasSeenOnboarding ? "Login" : "Onboarding"} />
      ) : user.role === 'admin' ? (
        <AdminNavigator />
      ) : (
        <EmployeeNavigator />
      )}
    </NavigationContainer>
  );
}
