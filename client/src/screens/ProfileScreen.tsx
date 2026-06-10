import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
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
            <Text className="text-3xl font-extrabold text-white tracking-tight">My Profile</Text>
            <Text className="text-purple-200 font-medium mt-1">Manage your account</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">

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
        className={`w-full bg-polygon-yellow rounded-xl py-4 mt-8 mb-12 shadow-sm active:opacity-80 ${loading ? 'opacity-50' : ''}`}
        onPress={handleUpdateProfile}
        disabled={loading}
      >
        <Text className="text-polygon-purple text-center font-extrabold text-lg">{loading ? 'Updating...' : 'Save Profile'}</Text>
      </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
