import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Onboarding'>;

interface Props {
  navigation: OnboardingScreenNavigationProp;
}

import { useDispatch } from 'react-redux';
import { completeOnboarding } from '../store/slices/authSlice';

export default function OnboardingScreen({ navigation }: Props) {
  const dispatch = useDispatch();

  const handleGetStarted = () => {
    dispatch(completeOnboarding());
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 items-center justify-between p-6">
      <View className="flex-1 w-full items-center justify-center pt-10">
        <Image
          source={require('../../assets/onboarding.png')}
          className="w-full h-80 mb-8"
          resizeMode="contain"
        />
        <Text className="text-3xl font-extrabold text-polygon-purple dark:text-purple-400 text-center mb-4">
          Manage Your Tasks
        </Text>
        <Text className="text-base text-gray-500 dark:text-gray-400 text-center px-4 leading-6">
          Polygon Employee Task Management helps you stay organized and collaborate effectively with your team.
        </Text>
      </View>
      
      <View className="w-full pb-8">
        <TouchableOpacity 
          className="w-full bg-polygon-red py-4 rounded-xl items-center shadow-sm active:opacity-80"
          onPress={handleGetStarted}
        >
          <Text className="text-white font-bold text-lg">Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
