import React from 'react';
import { View, Text, ActivityIndicator, StatusBar } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { theme } from '../utils/colors';

const LoadingScreen = ({ message = "Loading Pokemon..." }) => {
  return (
    <View style={globalStyles.centerContainer}>
      <StatusBar barStyle="light-content" backgroundColor={theme.primary} />
      <ActivityIndicator size="large" color={theme.primary} />
      <Text style={globalStyles.loadingText}>{message}</Text>
      <Text style={globalStyles.subText}>Fetching data from PokeAPI</Text>
    </View>
  );
};

export default LoadingScreen;
