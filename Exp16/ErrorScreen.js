import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { theme } from '../utils/colors';

const ErrorScreen = ({ error, onRetry }) => {
  return (
    <View style={globalStyles.centerContainer}>
      <StatusBar barStyle="light-content" backgroundColor={theme.primary} />
      <View style={styles.errorContainer}>
        <Text style={styles.errorEmoji}>⚠️</Text>
        <Text style={styles.errorText}>Connection Failed</Text>
        <Text style={globalStyles.subText}>Check your internet connection and try again</Text>
        <TouchableOpacity style={globalStyles.retryButton} onPress={onRetry}>
          <Text style={globalStyles.retryButtonText}>🔄 Retry</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  errorContainer: {
    alignItems: 'center',
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 15,
  },
  errorText: {
    fontSize: 20,
    color: theme.error,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
};

export default ErrorScreen;
