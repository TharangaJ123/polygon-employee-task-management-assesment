import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, TextInput, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { logout } from '../store/slices/authSlice';
import { RootState } from '../store';
import { API_BASE_URL } from '../utils/api';
import { Task, EmployeeStackParamList } from '../types';

type EmployeeNavProp = NativeStackNavigationProp<EmployeeStackParamList, 'EmployeeDashboard'>;

export default function EmployeeDashboardScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation<EmployeeNavProp>();
  const { token, user } = useSelector((state: RootState) => state.auth);
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Completed'>('All');

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
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
      fetchTasks();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTasks();
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <View className="flex-1 bg-polygon-bg">
      <View className="bg-polygon-purple pt-14 pb-6 px-6 rounded-b-[30px] shadow-md mb-6 z-10">
        <View className="flex-row justify-between items-center">
          <View>
            <View className="flex-row items-center mb-1 gap-2">
              <Feather name="grid" size={28} color="#FFFFFF" />
              <Text className="text-3xl font-extrabold text-white tracking-tight">
                My Dashboard
              </Text>
            </View>
            <Text className="text-purple-200 font-medium ml-1">
              Hello, {user?.name || 'Employee'}
            </Text>
          </View>
          
          <View className="flex-row items-center gap-3">
            <TouchableOpacity 
              onPress={() => navigation.navigate('Profile')}
              className="items-center justify-center bg-polygon-yellow w-10 h-10 rounded-lg"
            >
              <Feather name="user" size={20} color="#4D1D70" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleLogout}
              className="items-center justify-center bg-white w-10 h-10 rounded-lg border border-polygon-pink"
            >
              <Feather name="log-out" size={20} color="#7F246C" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="flex-1 px-6">
        <Text className="text-lg font-bold text-gray-800 mb-4">Assigned Tasks</Text>

      <View className="mb-4">
        <View className="flex-row items-center bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm mb-3">
          <Feather name="search" size={20} color="#9CA3AF" />
          <TextInput 
            className="flex-1 ml-3 text-base text-gray-800"
            placeholder="Search tasks..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {['All', 'Pending', 'In Progress', 'Completed'].map((status) => (
            <TouchableOpacity
              key={status}
              onPress={() => setStatusFilter(status as any)}
              className={`px-4 py-2 rounded-full mr-2 ${
                statusFilter === status ? 'bg-polygon-purple' : 'bg-white border border-gray-200'
              }`}
            >
              <Text className={`font-medium ${
                statusFilter === status ? 'text-white' : 'text-gray-600'
              }`}>{status}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#7F246C" className="mt-10" />
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          ListEmptyComponent={<Text className="text-gray-500 text-center mt-10">No tasks assigned yet.</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => navigation.navigate('TaskDetails', { task: item })}
              className="bg-white p-4 rounded-2xl mb-4 shadow-sm border border-gray-100"
            >
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-lg font-bold text-gray-900 flex-1 mr-4" numberOfLines={1}>{item.title}</Text>
                <View className={`p-2 rounded-full ${
                  item.status === 'Completed' ? 'bg-green-100' :
                  item.status === 'In Progress' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Feather 
                    name={item.status === 'Completed' ? 'check-circle' : item.status === 'In Progress' ? 'play-circle' : 'clock'} 
                    size={16} 
                    color={item.status === 'Completed' ? '#15803d' : item.status === 'In Progress' ? '#1d4ed8' : '#374151'} 
                  />
                </View>
              </View>
              <Text className="text-sm text-gray-500 mb-2" numberOfLines={2}>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      </View>
    </View>
  );
}
