import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  RefreshControl,
  StatusBar 
} from 'react-native';

// Import components
import LoadingScreen from './components/LoadingScreen';
import ErrorScreen from './components/ErrorScreen';
import EmptyScreen from './components/EmptyScreen';
import SearchBar from './components/SearchBar';
import PokemonCard from './components/PokemonCard';
import PokemonModal from './components/PokemonModal';

// Import services and utilities
import { pokemonService } from './services/pokemonService';
import { globalStyles } from './styles/globalStyles';
import { theme } from './utils/colors';

export default function App() {
  // State management
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Fetch Pokemon list
  const fetchPokemon = async () => {
    try {
      setError(null);
      const pokemonData = await pokemonService.fetchPokemonList(50);
      setPokemon(pokemonData);
      setFilteredPokemon(pokemonData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle search functionality
  const handleSearch = async (text) => {
    setSearchQuery(text);
    
    if (text.trim() === '') {
      setFilteredPokemon(pokemon);
      return;
    }

    // First, filter from existing Pokemon
    const localFiltered = pokemon.filter(poke =>
      poke.name.toLowerCase().includes(text.toLowerCase()) ||
      poke.types.some(type => type.toLowerCase().includes(text.toLowerCase()))
    );

    // If we found matches in existing Pokemon, show them
    if (localFiltered.length > 0) {
      setFilteredPokemon(localFiltered);
      return;
    }

    // If no local matches, try to search for the specific Pokemon from API
    try {
      setSearchLoading(true);
      const searchedPokemon = await pokemonService.searchPokemon(text);
      
      if (searchedPokemon) {
        setFilteredPokemon([searchedPokemon]);
      } else {
        setFilteredPokemon([]);
      }
    } catch (err) {
      console.log('Pokemon search failed:', err);
      setFilteredPokemon([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle Pokemon card press
  const handlePokemonPress = async (poke) => {
    setSelectedPokemon(poke);
    setModalVisible(true);
    setLoadingDetails(true);
    
    try {
      const details = await pokemonService.fetchPokemonDetails(poke.url);
      setPokemonDetails(details);
    } catch (err) {
      console.error('Error fetching Pokemon details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setModalVisible(false);
    setPokemonDetails(null);
  };

  // Load data when app starts
  useEffect(() => {
    fetchPokemon();
  }, []);

  // Handle pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    setSearchQuery('');
    fetchPokemon();
  };

  // Handle retry button
  const onRetry = () => {
    setLoading(true);
    setSearchQuery('');
    fetchPokemon();
  };

  // Handle clear search
  const onClearSearch = () => {
    setSearchQuery('');
    setFilteredPokemon(pokemon);
  };

  // Show loading screen
  if (loading && !refreshing) {
    return <LoadingScreen />;
  }

  // Show error screen
  if (error && !refreshing) {
    return <ErrorScreen error={error} onRetry={onRetry} />;
  }

  // Show empty screen when no Pokemon found
  if (filteredPokemon.length === 0 && !loading && !searchLoading) {
    return (
      <View style={globalStyles.container}>
        <StatusBar barStyle="light-content" backgroundColor={theme.primary} />
        <View style={globalStyles.headerContainer}>
          <Text style={globalStyles.header}>Pokedex</Text>
          <Text style={globalStyles.subtitle}>Gotta catch 'em all!</Text>
        </View>
        <SearchBar 
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
          isLoading={searchLoading}
        />
        <EmptyScreen 
          searchQuery={searchQuery}
          onClearSearch={onClearSearch}
          onRetry={onRetry}
        />
      </View>
    );
  }

  // Render Pokemon item
  const renderPokemon = ({ item }) => (
    <PokemonCard pokemon={item} onPress={handlePokemonPress} />
  );

  // Main app render - success state
  return (
    <View style={globalStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.primary} />
      
      <View style={globalStyles.headerContainer}>
        <Text style={globalStyles.header}>Pokedex</Text>
        <Text style={globalStyles.subtitle}>Gotta catch 'em all!</Text>
      </View>
      
      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        isLoading={searchLoading}
      />
      
      <Text style={globalStyles.resultCount}>
        {searchQuery ? `Search results` : `Showing ${filteredPokemon.length} Pokemon`}
      </Text>
      
      <FlatList
        data={filteredPokemon}
        renderItem={renderPokemon}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={globalStyles.list}
        columnWrapperStyle={globalStyles.row}
        showsVerticalScrollIndicator={false}
      />

      <PokemonModal
        visible={modalVisible}
        pokemonDetails={pokemonDetails}
        loading={loadingDetails}
        onClose={handleModalClose}
      />
    </View>
  );
}
