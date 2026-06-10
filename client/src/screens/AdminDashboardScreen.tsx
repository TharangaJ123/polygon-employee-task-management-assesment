import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, TextInput, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { logout } from '../store/slices/authSlice';
import { RootState } from '../store';
import { API_BASE_URL } from '../utils/api';
import { Task, AdminStackParamList } from '../types';

type AdminNavProp = NativeStackNavigationProp<AdminStackParamList, 'AdminDashboard'>;

export default function AdminDashboardScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation<AdminNavProp>();
  const { token } = useSelector((state: RootState) => state.auth);
  
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
              Admin Area
            </Text>
          </View>
          <Text className="text-purple-200 font-medium ml-1">
            Manage tasks and monitor progress
          </Text>
        </View>
        
        <View className="flex-row gap-3">
          <TouchableOpacity 
            onPress={() => navigation.navigate('EmployeesList')}
            className="items-center justify-center bg-polygon-yellow w-10 h-10 rounded-lg"
          >
            <Feather name="users" size={20} color="#4D1D70" />
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
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={<Text className="text-gray-500 text-center mt-10">No tasks found. Create one!</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => navigation.navigate('TaskDetails', { task: item })}
              className="bg-white p-4 rounded-2xl mb-4 shadow-sm border border-gray-100"
            >
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-lg font-bold text-gray-900 flex-1 mr-4" numberOfLines={1}>{item.title}</Text>
                <View className={`px-2 py-1 rounded-md ${
                  item.status === 'Completed' ? 'bg-green-100' :
                  item.status === 'In Progress' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Text className={`text-xs font-bold ${
                    item.status === 'Completed' ? 'text-green-700' :
                    item.status === 'In Progress' ? 'text-blue-700' : 'text-gray-700'
                  }`}>{item.status}</Text>
                </View>
              </View>
              <Text className="text-sm text-gray-500 mb-2">Assignee: {item.assignee_name || 'Unassigned'}</Text>
            </TouchableOpacity>
          )}
        />
      )}

        <TouchableOpacity 
          onPress={() => navigation.navigate('CreateTask')}
          className="absolute bottom-8 right-6 bg-polygon-red w-16 h-16 rounded-full items-center justify-center shadow-md"
        >
          <Text className="text-white text-3xl font-light leading-none">+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
