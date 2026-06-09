import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import './global.css';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <View className="flex-1 items-center justify-center bg-white">
          <Text className="text-xl font-bold text-blue-500">Welcome to NativeWind!</Text>
          <StatusBar style="auto" />
        </View>
      </PersistGate>
    </Provider>
  );
}
