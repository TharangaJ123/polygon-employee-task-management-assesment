import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { store, persistor } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import './global.css';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    // Artificial delay to show the splash screen for 3 seconds
    const timer = setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RootNavigator />
          <StatusBar style="auto" />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
