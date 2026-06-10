import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { RootState } from '../store';
import { API_BASE_URL } from '../utils/api';
import { User } from '../types';

export default function EmployeesListScreen() {
  const navigation = useNavigation();
  const { token } = useSelector((state: RootState) => state.auth);
  
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEmployees();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchEmployees();
  };

  const renderProgress = (user: User) => {
    // Cast strings returned from SQL aggregated SUMs to numbers
    const total = Number(user.total_tasks) || 0;
    const completed = Number(user.completed_tasks) || 0;
    const inProgress = Number(user.in_progress_tasks) || 0;
    const pending = Number(user.pending_tasks) || 0;

    const progressPercentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    const inProgressPercentage = total === 0 ? 0 : Math.round((inProgress / total) * 100);

    return (
      <View className="mt-3">
        <View className="flex-row justify-between mb-1">
          <Text className="text-xs text-gray-500 font-medium">Progress</Text>
          <Text className="text-xs text-polygon-purple font-bold">{progressPercentage}%</Text>
        </View>
        <View className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex-row">
          <View style={{ width: `${progressPercentage}%` }} className="bg-green-400 h-full" />
          <View style={{ width: `${inProgressPercentage}%` }} className="bg-blue-400 h-full" />
        </View>
        <View className="flex-row justify-between mt-3">
          <View className="items-center">
            <Text className="text-xs text-gray-400">Total</Text>
            <Text className="font-bold text-gray-700">{total}</Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-gray-400">Pending</Text>
            <Text className="font-bold text-yellow-600">{pending}</Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-gray-400">In Progress</Text>
            <Text className="font-bold text-blue-600">{inProgress}</Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-gray-400">Completed</Text>
            <Text className="font-bold text-green-600">{completed}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-polygon-bg">
      <View className="bg-polygon-purple pt-14 pb-6 px-6 rounded-b-[30px] shadow-md mb-6 z-10">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="mr-4 items-center justify-center bg-white/20 w-10 h-10 rounded-lg"
          >
            <Feather name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-3xl font-extrabold text-white tracking-tight">Employees</Text>
            <Text className="text-purple-200 font-medium mt-1">Monitor task progress</Text>
          </View>
        </View>
      </View>
      <View className="flex-1 px-6">

      {loading ? (
        <ActivityIndicator size="large" color="#7F246C" className="mt-10" />
      ) : (
        <FlatList
          data={employees}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={<Text className="text-gray-500 text-center mt-10">No employees found.</Text>}
          renderItem={({ item }) => (
            <View className="bg-white p-5 rounded-2xl mb-4 shadow-sm border border-gray-100">
              <View className="flex-row items-center mb-2">
                <View className="w-10 h-10 rounded-full bg-polygon-yellow items-center justify-center mr-3">
                  <Text className="text-polygon-purple font-bold text-lg">
                    {item.name ? item.name.charAt(0).toUpperCase() : 'E'}
                  </Text>
                </View>
                <View>
                  <Text className="text-lg font-bold text-gray-900">{item.name || 'Unknown Employee'}</Text>
                  <Text className="text-sm text-gray-500">{item.email}</Text>
                </View>
              </View>
              {renderProgress(item)}
            </View>
          )}
        />
      )}

        <TouchableOpacity 
          onPress={() => (navigation as any).navigate('CreateEmployee')}
          className="absolute bottom-8 right-6 bg-polygon-red w-16 h-16 rounded-full items-center justify-center shadow-md"
        >
          <Feather name="user-plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
