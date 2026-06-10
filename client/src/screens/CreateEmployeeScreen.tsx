import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { API_BASE_URL } from '../utils/api';

export default function CreateEmployeeScreen() {
  const navigation = useNavigation();
  const token = useSelector((state: RootState) => state.auth.token);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateEmployee = async () => {
    if (!name || !email || !password) {
      Alert.alert('Validation Error', 'Name, email, and password are required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, email: email.toLowerCase(), password })
      });

      if (res.ok) {
        Alert.alert('Success', 'Employee created successfully');
        navigation.goBack();
      } else {
        const data = await res.json();
        Alert.alert('Error', data.message || 'Failed to create employee');
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
            <Text className="text-3xl font-extrabold text-white tracking-tight">Add Employee</Text>
            <Text className="text-purple-200 font-medium mt-1">Create a new employee account</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        <View className="space-y-4">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1 ml-1">Full Name</Text>
            <TextInput
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800"
              placeholder="e.g., Jane Doe"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1 ml-1">Email Address</Text>
            <TextInput
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800"
              placeholder="employee@test.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1 ml-1">Password</Text>
            <TextInput
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800"
              placeholder="Create a strong password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity 
          className={`w-full bg-polygon-red rounded-xl py-4 mt-8 mb-12 shadow-sm active:opacity-80 ${loading ? 'opacity-50' : ''}`}
          onPress={handleCreateEmployee}
          disabled={loading}
        >
          <Text className="text-white text-center font-bold text-lg">{loading ? 'Creating...' : 'Create Employee'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
