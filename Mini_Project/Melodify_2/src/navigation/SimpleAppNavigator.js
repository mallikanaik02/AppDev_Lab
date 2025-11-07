import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Platform } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import AuthStack from './AuthStack';
import MainTabNavigator from './MainTabNavigator';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SimpleAppNavigator = () => {
  const { user, isLoading } = useAuth();

  console.log('🧭 NAVIGATION STATE CHECK');
  console.log('Platform:', Platform.OS);
  console.log('Loading:', isLoading);
  console.log('User:', user ? `Authenticated (${user.email})` : 'Not authenticated');

  if (isLoading) {
    return <LoadingSpinner message="Loading your music experience..." />;
  }

  return (
    <NavigationContainer>
      {user ? <MainTabNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default SimpleAppNavigator;
