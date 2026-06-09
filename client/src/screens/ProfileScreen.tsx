import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { login } from '../store/slices/authSlice';
import { API_BASE_URL } from '../utils/api';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);
  
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
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-polygon-bg p-6 pt-12">
      <View className="flex-row items-center mb-8">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Text className="text-polygon-red font-bold text-lg">← Back</Text>
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-polygon-purple flex-1">My Profile</Text>
      </View>

      <View className="space-y-4">
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1 ml-1">Full Name</Text>
          <TextInput
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />
        </View>
        
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1 ml-1">Email</Text>
          <TextInput
            className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-500"
            value={user?.email}
            editable={false}
          />
          <Text className="text-xs text-gray-400 mt-1 ml-1">Email cannot be changed.</Text>
        </View>
      </View>

      <TouchableOpacity 
        className={`w-full bg-polygon-yellow rounded-xl py-4 mt-8 shadow-sm active:opacity-80 ${loading ? 'opacity-50' : ''}`}
        onPress={handleUpdateProfile}
        disabled={loading}
      >
        <Text className="text-polygon-purple text-center font-extrabold text-lg">{loading ? 'Updating...' : 'Save Profile'}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
