import React from 'react';
import { View, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
import { theme } from '../utils/colors';

const SearchBar = ({ searchQuery, onSearchChange, isLoading }) => {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search any Pokemon..."
        value={searchQuery}
        onChangeText={onSearchChange}
        placeholderTextColor="#999"
      />
      {isLoading && (
        <ActivityIndicator 
          size="small" 
          color={theme.primary} 
          style={styles.searchLoader}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 25,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchLoader: {
    position: 'absolute',
    right: 35,
    top: 38,
  },
});

export default SearchBar;
