import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';

// Auth Stack
import AuthStack from './AuthStack';

// Main App Stack
import MainDrawerNavigator from './MainDrawerNavigator';

// Loading Component
import LoadingSpinner from '../components/common/LoadingSpinner';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, isLoading } = useAuth(); // ✅ use user instead of isAuthenticated

  if (isLoading) {
    return <LoadingSpinner message="Loading Melodify..." />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (  // ✅ check if user exists
        <Stack.Screen name="Main" component={MainDrawerNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};


export default AppNavigator;
