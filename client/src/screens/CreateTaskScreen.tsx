import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { API_BASE_URL } from '../utils/api';
import { User } from '../types';

export default function CreateTaskScreen() {
  const navigation = useNavigation();
  const token = useSelector((state: RootState) => state.auth.token);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingEmployees, setFetchingEmployees] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setEmployees(data);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to fetch employees');
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
      const res = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          assignee_id: assigneeId ? parseInt(assigneeId, 10) : null
        })
      });

      if (res.ok) {
        Alert.alert('Success', 'Task created successfully');
        navigation.goBack();
      } else {
        const data = await res.json();
        Alert.alert('Error', data.message || 'Failed to create task');
      }
    } catch (e) {
      Alert.alert('Error', 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-polygon-bg">
      <View className="bg-polygon-purple pt-14 pb-6 px-6 rounded-b-[30px] shadow-md z-10">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="mr-4 items-center justify-center bg-white/20 w-10 h-10 rounded-lg"
          >
            <Feather name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-3xl font-extrabold text-white tracking-tight">Create Task</Text>
            <Text className="text-purple-200 font-medium mt-1">Assign a new task to an employee</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6 content-container">

      <View className="space-y-4">
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">Title</Text>
          <TextInput
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800"
            placeholder="E.g., Review Q3 Report"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">Description</Text>
          <TextInput
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800"
            placeholder="Details about the task..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">Assign To Employee</Text>
          {fetchingEmployees ? (
             <ActivityIndicator color="#D83363" />
          ) : (
            <View className="flex-row flex-wrap gap-2">
              <TouchableOpacity 
                onPress={() => setAssigneeId('')}
                className={`px-4 py-2 rounded-full border ${assigneeId === '' ? 'bg-polygon-yellow border-polygon-yellow' : 'bg-white border-gray-200'}`}
              >
                <Text className={assigneeId === '' ? 'text-white font-bold' : 'text-gray-600'}>Unassigned</Text>
              </TouchableOpacity>
              {employees.map(emp => (
                <TouchableOpacity 
                  key={emp.id}
                  onPress={() => setAssigneeId(String(emp.id))}
                  className={`px-4 py-2 rounded-full border ${assigneeId === String(emp.id) ? 'bg-polygon-purple border-polygon-purple' : 'bg-white border-gray-200'}`}
                >
                  <Text className={assigneeId === String(emp.id) ? 'text-white font-bold' : 'text-gray-600'}>{emp.name}</Text>
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
        <Text className="text-white text-center font-bold text-lg">{loading ? 'Creating...' : 'Create Task'}</Text>
      </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
