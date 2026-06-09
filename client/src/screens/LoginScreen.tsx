import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { User } from '../types';
import { API_BASE_URL } from '../utils/api';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.toLowerCase(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      dispatch(login({ user: data.user, token: data.token }));
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white items-center justify-center p-6"
    >
      <View className="w-full max-w-sm space-y-6">
        <View className="items-center mb-8">
          <Text className="text-3xl font-extrabold text-polygon-purple mb-2">Welcome Back</Text>
          <Text className="text-gray-500 text-center">
            Log in to access your task management dashboard
          </Text>
          <Text className="text-xs text-gray-400 mt-2 text-center">
            Tip: Use admin@test.com (pwd: admin123) or employee@test.com (pwd: employee123).
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1 ml-1">Email</Text>
            <TextInput
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1 ml-1">Password</Text>
            <TextInput
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <TouchableOpacity 
          className={`w-full bg-polygon-red rounded-xl py-4 mt-8 shadow-sm active:opacity-80 ${isLoading ? 'opacity-50' : ''}`}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text className="text-white text-center font-bold text-lg">
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
