import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { GlobalStyles } from '../../styles/globalStyles';
import { normalize } from '../../utils/dimensions';

const LoadingSpinner = ({ message = 'Loading...', size = 'large' }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ActivityIndicator 
        size={size} 
        color={theme.primary} 
        style={styles.spinner}
      />
      <Text style={[styles.message, { color: theme.textSecondary }]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  spinner: {
    marginBottom: 15,
  },
  message: {
    fontSize: normalize(16),
    textAlign: 'center',
  },
});

export default LoadingSpinner;
