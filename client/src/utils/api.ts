import { Platform } from 'react-native';

// For Android Emulators, 10.0.2.2 points to the host machine.
// For physical devices on the same Wi-Fi, use your local IP (192.168.8.191).
// For Web or iOS Simulator, localhost works perfectly.
const LOCAL_IP = '192.168.8.191';

export const API_BASE_URL = `http://${LOCAL_IP}:5000/api`;
