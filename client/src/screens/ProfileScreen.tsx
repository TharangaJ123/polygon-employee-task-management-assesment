import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { login, logout } from '../store/slices/authSlice';
import { setThemeMode } from '../store/slices/themeSlice';
import { API_BASE_URL } from '../utils/api';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { mode } = useSelector((state: RootState) => state.theme);
  
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });

      const data = await res.json();
      if (res.ok) {
        // Update user name in Redux
        dispatch(login({ user: data.user, token: token! }));
        Alert.alert('Success', 'Profile updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', data.message || 'Failed to update profile');
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
            <Text className="text-3xl font-extrabold text-white tracking-tight">My Profile</Text>
            <Text className="text-purple-200 font-medium mt-1">Manage your account</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">

      <View className="space-y-4">
        <View>
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Full Name</Text>
          <TextInput
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-base text-gray-800 dark:text-white"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />
        </View>
        
        <View>
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Email</Text>
          <TextInput
            className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-base text-gray-500 dark:text-gray-400"
            value={user?.email}
            editable={false}
          />
          <Text className="text-xs text-gray-400 mt-1 ml-1">Email cannot be changed.</Text>
        </View>

        <View className="flex-row items-center justify-between mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <View>
            <Text className="text-base font-bold text-gray-800 dark:text-white">Dark Mode</Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">Toggle dark theme</Text>
          </View>
          <TouchableOpacity 
            onPress={() => dispatch(setThemeMode(mode === 'dark' ? 'light' : 'dark'))}
            className={`w-14 h-8 rounded-full justify-center px-1 ${mode === 'dark' ? 'bg-polygon-purple' : 'bg-gray-300'}`}
          >
            <View className={`w-6 h-6 bg-white rounded-full transition-transform ${mode === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        className={`w-full bg-polygon-yellow rounded-xl py-4 mt-8 shadow-sm active:opacity-80 ${loading ? 'opacity-50' : ''}`}
        onPress={handleUpdateProfile}
        disabled={loading}
      >
        <Text className="text-polygon-purple text-center font-extrabold text-lg">{loading ? 'Updating...' : 'Save Profile'}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        className="w-full bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl py-4 mt-4 mb-12 shadow-sm active:opacity-80 flex-row justify-center items-center gap-2"
        onPress={() => dispatch(logout())}
      >
        <Feather name="log-out" size={20} color="#EF4444" className="dark:text-red-400" />
        <Text className="text-red-600 dark:text-red-400 text-center font-extrabold text-lg">Logout</Text>
      </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
