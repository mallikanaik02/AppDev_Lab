import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC7ysMYt_3lwoZ6B4CHUxroHCrk3GgiB7Q",
  authDomain: "todo-experiment10.firebaseapp.com",
  projectId: "todo-experiment10",
  storageBucket: "todo-experiment10.firebasestorage.app",
  messagingSenderId: "248914584001",
  appId: "1:248914584001:web:82eb9ce14cf8d3ef94cf40"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
export const db = getFirestore(app);
