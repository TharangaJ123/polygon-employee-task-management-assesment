import { Platform } from 'react-native';

// For Android Emulators, localhost maps to 10.0.2.2. For iOS/Web, localhost works fine.
// Ensure your backend server is running on port 5000.
export const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';
