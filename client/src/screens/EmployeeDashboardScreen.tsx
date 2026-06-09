import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { RootState } from '../store';

export default function EmployeeDashboardScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <View className="flex-1 bg-polygon-bg p-6 pt-12">
      <View className="flex-row justify-between items-center mb-8">
        <View>
          <Text className="text-2xl font-bold text-gray-900">Employee Dashboard</Text>
          <Text className="text-sm text-gray-500 mt-1">Hello, {user?.name || 'Employee'}</Text>
        </View>
        
        <TouchableOpacity 
          onPress={handleLogout}
          className="bg-white px-4 py-2 rounded-lg border border-polygon-pink"
        >
          <Text className="text-polygon-pink font-medium">Logout</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-4">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Your Tasks</Text>
        <Text className="text-gray-600 leading-6">
          This is the employee view. Here you will be able to view and manage tasks assigned to you.
        </Text>
      </View>
    </View>
  );
}
