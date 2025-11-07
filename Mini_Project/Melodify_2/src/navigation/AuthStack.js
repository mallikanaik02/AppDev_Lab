import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import SpotifyCallbackScreen from '../screens/auth/SpotifyCallback';

// Import your admin components
import AdminLogin from '../screens/admin/AdminLogin';
import AdminPanel from '../screens/admin/AdminPanel';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="AdminLogin" component={AdminLogin} />
      <Stack.Screen name="AdminPanel" component={AdminPanel} />
      <Stack.Screen name="SpotifyCallback" component={SpotifyCallbackScreen} />

    </Stack.Navigator>
  );
};

export default AuthStack;
