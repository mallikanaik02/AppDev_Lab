import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { theme } from '../utils/colors';

const EmptyScreen = ({ searchQuery, onClearSearch, onRetry }) => {
  return (
    <View style={globalStyles.centerContainer}>
      <Text style={styles.emptyEmoji}>🔍</Text>
      <Text style={styles.emptyText}>No Pokemon Found</Text>
      <Text style={globalStyles.subText}>
        {searchQuery ? `No results for "${searchQuery}"` : 'No Pokemon available'}
      </Text>
      <TouchableOpacity 
        style={globalStyles.retryButton} 
        onPress={searchQuery ? onClearSearch : onRetry}
      >
        <Text style={globalStyles.retryButtonText}>
          {searchQuery ? '🔄 Clear Search' : '🔄 Try Again'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 20,
    color: theme.textLight,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
};

export default EmptyScreen;
