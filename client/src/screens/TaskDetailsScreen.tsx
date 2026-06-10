import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { API_BASE_URL } from '../utils/api';
import { AdminStackParamList, EmployeeStackParamList } from '../types';

type DetailsRouteProp = RouteProp<AdminStackParamList | EmployeeStackParamList, 'TaskDetails'>;

export default function TaskDetailsScreen() {
  const route = useRoute<DetailsRouteProp>();
  const navigation = useNavigation();
  const { task } = route.params;
  const { user, token } = useSelector((state: RootState) => state.auth);

  const [status, setStatus] = useState(task.status);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleUpdateStatus = async (newStatus: 'Pending' | 'In Progress' | 'Completed') => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          title: task.title,
          description: task.description,
          assignee_id: task.assignee_id,
          status: newStatus 
        })
      });

      if (res.ok) {
        setStatus(newStatus);
        Alert.alert('Success', 'Status updated successfully');
      } else {
        const data = await res.json();
        Alert.alert('Error', data.message || 'Failed to update status');
      }
    } catch (e) {
      Alert.alert('Error', 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          setDeleting(true);
          try {
            const res = await fetch(`${API_BASE_URL}/tasks/${task.id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
              Alert.alert('Success', 'Task deleted');
              navigation.goBack();
            } else {
              Alert.alert('Error', 'Failed to delete task');
            }
          } catch (e) {
            Alert.alert('Error', 'Network error');
          } finally {
            setDeleting(false);
          }
        }
      }
    ]);
  };

  return (
    <View className="flex-1 bg-polygon-bg">
      <View className="bg-polygon-purple pt-14 pb-6 px-6 rounded-b-[30px] shadow-md z-10">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              className="mr-4 items-center justify-center bg-white/20 w-10 h-10 rounded-lg"
            >
              <Feather name="arrow-left" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <View>
              <Text className="text-3xl font-extrabold text-white tracking-tight">Task Details</Text>
              <Text className="text-purple-200 font-medium mt-1">View and update status</Text>
            </View>
          </View>
          {user?.role === 'admin' && (
            <TouchableOpacity 
              onPress={() => (navigation as any).navigate('CreateTask', { task })}
              className="items-center justify-center bg-white/20 w-10 h-10 rounded-lg"
            >
              <Feather name="edit-2" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">

      <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <Text className="text-xl font-bold text-gray-900 mb-2">{task.title}</Text>
        <Text className="text-gray-600 mb-4">{task.description || 'No description provided.'}</Text>
        
        <View className="flex-row items-center mb-2">
          <Text className="text-sm text-gray-500 w-24">Assignee:</Text>
          <Text className="text-sm font-medium text-gray-800">{task.assignee_name || 'Unassigned'}</Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-sm text-gray-500 w-24">Created At:</Text>
          <Text className="text-sm font-medium text-gray-800">{new Date(task.created_at).toLocaleDateString()}</Text>
        </View>
      </View>

      <Text className="text-lg font-bold text-gray-800 mb-3">Update Status</Text>
      <View className="flex-row gap-4 mb-8">
        {(['Pending', 'In Progress', 'Completed'] as const).map((s) => {
          let iconName: any = 'clock';
          if (s === 'In Progress') iconName = 'play-circle';
          if (s === 'Completed') iconName = 'check-circle';
          
          return (
            <TouchableOpacity
              key={s}
              onPress={() => handleUpdateStatus(s)}
              disabled={loading}
              className={`w-14 h-14 rounded-full items-center justify-center border-2 ${
                status === s 
                  ? 'bg-polygon-orange border-polygon-orange' 
                  : 'bg-white border-gray-200'
              } ${loading ? 'opacity-50' : ''}`}
            >
              <Feather 
                name={iconName} 
                size={24} 
                color={status === s ? '#FFFFFF' : '#4B5563'} 
              />
            </TouchableOpacity>
          );
        })}
        {loading && <ActivityIndicator color="#D55E36" className="ml-2 self-center" />}
      </View>

      {user?.role === 'admin' && (
        <TouchableOpacity 
          onPress={handleDelete}
          disabled={deleting}
          className="bg-red-50 p-4 rounded-xl border border-red-200 mt-4"
        >
          <Text className="text-red-600 font-bold text-center">{deleting ? 'Deleting...' : 'Delete Task'}</Text>
        </TouchableOpacity>
      )}
      </ScrollView>
    </View>
  );
}
