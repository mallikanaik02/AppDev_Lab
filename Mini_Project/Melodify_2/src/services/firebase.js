import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// YOUR ACTUAL Firebase configuration (PERFECT! ✅)
const firebaseConfig = {
  apiKey: "xxx",
  authDomain: "melodify-2c87e.firebaseapp.com",
  projectId: "melodify-2c87e",
  storageBucket: "melodify-2c87e.firebasestorage.app",
  messagingSenderId: "475332607311",
  appId: "1:475332607311:web:04cbaa5cdd1011d81d993a",
  measurementId: "G-11R6T6QT4E"
};

// Initialize Firebase App
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase Auth
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

// Initialize Firestore
const db = getFirestore(app);

export { auth, db, app };
export default app;
