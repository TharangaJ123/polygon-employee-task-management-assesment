import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addTask, updateTask } from '../store/slices/tasksSlice';
import { setEmployees } from '../store/slices/employeesSlice';
import { API_BASE_URL } from '../utils/api';
import { User, AdminStackParamList } from '../types';

type CreateTaskRouteProp = RouteProp<AdminStackParamList, 'CreateTask'>;

export default function CreateTaskScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute<CreateTaskRouteProp>();
  const task = route.params?.task;
  const isEditing = !!task;

  const token = useSelector((state: RootState) => state.auth.token);
  const employees = useSelector((state: RootState) => state.employees.employees);
  
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [assigneeId, setAssigneeId] = useState<string>(task?.assignee_id ? String(task.assignee_id) : '');
  const [loading, setLoading] = useState(false);
  const [fetchingEmployees, setFetchingEmployees] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setFetchingEmployees(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        dispatch(setEmployees(data));
      }
    } catch (e) {
      console.error('Failed to fetch employees, using offline cache if available', e);
    } finally {
      setFetchingEmployees(false);
    }
  };

  const handleCreateTask = async () => {
    if (!title) {
      Alert.alert('Validation Error', 'Task title is required');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isEditing ? `${API_BASE_URL}/tasks/${task.id}` : `${API_BASE_URL}/tasks`;
      const method = isEditing ? 'PUT' : 'POST';
      const bodyPayload: any = {
        title,
        description,
        assignee_id: assigneeId ? parseInt(assigneeId, 10) : null
      };

      if (isEditing) {
        bodyPayload.status = task.status; // Keep existing status when editing
      }

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bodyPayload)
      });

      if (res.ok) {
        const data = await res.json();
        if (isEditing) {
          dispatch(updateTask(data));
        } else {
          dispatch(addTask(data));
        }
        Alert.alert('Success', `Task ${isEditing ? 'updated' : 'created'} successfully`);
        navigation.goBack();
      } else {
        const data = await res.json();
        Alert.alert('Error', data.message || `Failed to ${isEditing ? 'update' : 'create'} task`);
      }
    } catch (e) {
      Alert.alert('Error', 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-polygon-bg dark:bg-gray-900">
      <View className="bg-polygon-purple pt-14 pb-6 px-6 rounded-b-[30px] shadow-md z-10">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="mr-4 items-center justify-center bg-white/20 w-10 h-10 rounded-lg"
          >
            <Feather name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-3xl font-extrabold text-white tracking-tight">{isEditing ? 'Edit Task' : 'Create Task'}</Text>
            <Text className="text-purple-200 font-medium mt-1">{isEditing ? 'Update task details' : 'Assign a new task to an employee'}</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6 content-container">

      <View className="space-y-4">
        <View>
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</Text>
          <TextInput
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-base text-gray-800 dark:text-white"
            placeholder="E.g., Review Q3 Report"
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</Text>
          <TextInput
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-base text-gray-800 dark:text-white"
            placeholder="Details about the task..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign To Employee</Text>
          {fetchingEmployees ? (
             <ActivityIndicator color="#D83363" />
          ) : (
            <View className="flex-row flex-wrap gap-2">
              <TouchableOpacity 
                onPress={() => setAssigneeId('')}
                className={`px-4 py-2 rounded-full border ${assigneeId === '' ? 'bg-polygon-yellow border-polygon-yellow' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}
              >
                <Text className={assigneeId === '' ? 'text-polygon-purple font-bold' : 'text-gray-600 dark:text-gray-300'}>Unassigned</Text>
              </TouchableOpacity>
              {employees.map(emp => (
                <TouchableOpacity 
                  key={emp.id}
                  onPress={() => setAssigneeId(String(emp.id))}
                  className={`px-4 py-2 rounded-full border ${assigneeId === String(emp.id) ? 'bg-polygon-purple border-polygon-purple' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}
                >
                  <Text className={assigneeId === String(emp.id) ? 'text-white font-bold' : 'text-gray-600 dark:text-gray-300'}>{emp.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity 
        className={`w-full bg-polygon-red rounded-xl py-4 mt-8 mb-12 shadow-sm active:opacity-80 ${loading ? 'opacity-50' : ''}`}
        onPress={handleCreateTask}
        disabled={loading}
      >
        <Text className="text-white text-center font-bold text-lg">{loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Task' : 'Create Task')}</Text>
      </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
