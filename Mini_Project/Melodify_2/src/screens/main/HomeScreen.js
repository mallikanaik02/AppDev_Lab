import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
  TextInput,
  Image,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSpotify } from '../../contexts/SpotifyContext';
import { useAuth } from '../../contexts/AuthContext';
import { StorageHelper } from '../../utils/storage';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { isSpotifyConnected, SpotifyAPI } = useSpotify();

  const [selectedArtists, setSelectedArtists] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [artistSearch, setArtistSearch] = useState('');
  const [artistResults, setArtistResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [discoveredSongs, setDiscoveredSongs] = useState([]);

  const availableGenres = [
    'pop', 'rock', 'hip-hop', 'r&b', 'country', 'electronic', 'jazz', 'blues',
    'indie', 'alternative', 'punk', 'metal', 'folk', 'reggae', 'latin', 'classical',
    'edm', 'house', 'techno', 'dubstep', 'dance', 'disco', 'trance',
    'trap', 'rap', 'drill',
    'alt-rock', 'grunge', 'hard-rock', 'indie-rock',
    'soul', 'funk', 'neo-soul',
    'afrobeat', 'reggaeton', 'k-pop', 'j-pop', 'bollywood',
    'ambient', 'chill', 'lo-fi', 'acoustic', 'singer-songwriter',
    'oldies', 'motown', 'doo-wop', 'gospel',
    'ska', 'new-wave', 'synthwave', 'indie-pop', 'folk-rock'
  ];

  useEffect(() => {
    if (user) {
      loadDiscoveredSongs();
    }
  }, [user]);

  // Whenever discoveredSongs changes, ensure automatic update in UI (already default in React)
  const loadDiscoveredSongs = async () => {
    if (user) {
      const songs = await StorageHelper.getDiscoveredSongs(user.uid);
      setDiscoveredSongs(songs);
    }
  };

  const removeDiscoveredSong = async (trackId) => {
    if (user) {
      const updatedSongs = await StorageHelper.removeDiscoveredSong(trackId, user.uid);
      setDiscoveredSongs(updatedSongs);
    }
  };

  const searchArtists = async (query) => {
    if (!query || query.length < 2) {
      setArtistResults([]);
      setShowResults(false);
      return;
    }
    try {
      setSearchLoading(true);
      const results = await SpotifyAPI.search(query, 'artist', 8);
      if (results.artists && results.artists.items) {
        setArtistResults(results.artists.items);
        setShowResults(true);
      } else {
        setArtistResults([]);
        setShowResults(false);
      }
    } catch (error) {
      setArtistResults([]);
      setShowResults(false);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchChange = (text) => {
    setArtistSearch(text);
    if (text.length >= 2) {
      clearTimeout(window.searchTimeout);
      window.searchTimeout = setTimeout(() => {
        searchArtists(text);
      }, 500);
    } else {
      setArtistResults([]);
      setShowResults(false);
      clearTimeout(window.searchTimeout);
    }
  };

  const selectArtist = (artist) => {
    const isAlreadySelected = selectedArtists.find(a => a.id === artist.id);
    if (isAlreadySelected) {
      alert('Artist already selected!');
      return;
    }
    if (selectedArtists.length >= 5) {
      alert('Maximum 5 artists allowed');
      return;
    }
    setSelectedArtists([...selectedArtists, artist]);
    setArtistSearch('');
    setArtistResults([]);
    setShowResults(false);
  };

  const removeArtist = (artistId) => {
    setSelectedArtists(selectedArtists.filter(a => a.id !== artistId));
  };

  const toggleGenre = (genre) => {
    const isSelected = selectedGenres.includes(genre);
    if (isSelected) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else if (selectedGenres.length < 5) {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const getRecommendations = () => {
    if (!isSpotifyConnected) {
      alert('Not connected to Spotify');
      return;
    }
    if (selectedArtists.length === 0 && selectedGenres.length === 0) {
      alert('Please select at least one artist or genre');
      return;
    }
    try {
      navigation.navigate('Recommendations', {
  selectedArtists: selectedArtists,
  selectedGenres: selectedGenres,
  onGoBack: () => { loadDiscoveredSongs(); } // refresh discovered songs on back
});

    } catch (error) {
      alert('Navigation error: ' + error.message);
    }
  };

  // When a song is clicked, open in Spotify AND re-load the discovered list
  const handleDiscoveredSongClick = async (track) => {
    openInSpotify(track.external_urls.spotify);
    // Immediately refresh discoveredSongs (if backend changes or for latest info)
    await loadDiscoveredSongs();
  };

  const openInSpotify = (spotifyUrl) => {
    if (Platform.OS === 'web') {
      window.open(spotifyUrl, '_blank');
    } else {
      Linking.openURL(spotifyUrl);
    }
  };

  const formatGenreName = (genre) =>
    genre.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const ConnectSpotifyPrompt = () => (
    <View style={styles.promptContainer}>
      <Ionicons name="musical-notes-outline" size={80} color="#1DB954" />
      <Text style={styles.promptTitle}>Connect Your Spotify </Text>
      <Text style={styles.promptText}>
        Go to Profile → Connect Spotify to get personalized recommendations
      </Text>
    </View>
  );

  if (!isSpotifyConnected) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#1DB954', '#191414', '#000000']}
          style={styles.gradient}
          locations={[0, 0.3, 1]}
        >
          <ConnectSpotifyPrompt />
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1DB954', '#191414', '#000000']}
        style={styles.gradient}
        locations={[0, 0.2, 1]}
      >
        <TouchableOpacity
          onPress={navigation.toggleDrawer}
          style={styles.hamburgerButton}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={32} color="#fff" />
        </TouchableOpacity>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Discover Music</Text>
            <Text style={styles.subtitle}>Tell us what you like</Text>
          </View>
          {discoveredSongs.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recently Discovered</Text>
                <TouchableOpacity 
                  onPress={async () => {
                    if (user) {
                      await StorageHelper.clearDiscoveredSongs(user.uid);
                      setDiscoveredSongs([]);
                    }
                  }}
                >
                  <Text style={styles.clearButton}>Clear All</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {discoveredSongs.slice(0, 10).map((track, index) => (
                  <TouchableOpacity
                    key={track.id}
                    style={styles.discoveredCard}
                    onPress={() => handleDiscoveredSongClick(track)}
                  >
                    <Image
                      source={{ uri: track.album.images[1]?.url || track.album.images[0]?.url }}
                      style={styles.discoveredAlbumArt}
                    />
                    <TouchableOpacity
                      style={styles.removeDiscovered}
                      onPress={() => removeDiscoveredSong(track.id)}
                    >
                      <Ionicons name="close-circle" size={20} color="#FF6B6B" />
                    </TouchableOpacity>
                    <View style={styles.discoveredInfo}>
                      <Text style={styles.discoveredTrackName} numberOfLines={2}>
                        {track.name}
                      </Text>
                      <Text style={styles.discoveredArtistName} numberOfLines={1}>
                        {track.artists[0].name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
          {/* Artists Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Artists</Text>
            
            {/* Artist Search Input */}
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search for artists..."
                  placeholderTextColor="#666"
                  value={artistSearch}
                  onChangeText={handleSearchChange}
                />
                {artistSearch.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearSearchButton}
                    onPress={() => {
                      setArtistSearch('');
                      setArtistResults([]);
                      setShowResults(false);
                    }}
                  >
                    <Ionicons name="close-circle" size={20} color="#666" />
                  </TouchableOpacity>
                )}
                {searchLoading && (
                  <View style={styles.loadingIcon}>
                    <Ionicons name="reload" size={20} color="#1DB954" />
                  </View>
                )}
              </View>
              
              {/* Artist Search Results */}
              {showResults && artistResults.length > 0 && (
                <View style={styles.searchResults}>
                  <Text style={styles.resultsHeader}>Artists</Text>
                  {artistResults.map(artist => (
                    <TouchableOpacity
                      key={artist.id}
                      style={styles.searchResultItem}
                      onPress={() => selectArtist(artist)}
                    >
                      <View style={styles.artistImageContainer}>
                        {artist.images && artist.images.length > 0 ? (
                          <Image
                            source={{ uri: artist.images[artist.images.length - 1]?.url }}
                            style={styles.artistImage}
                          />
                        ) : (
                          <View style={styles.artistImagePlaceholder}>
                            <Ionicons name="person" size={20} color="#666" />
                          </View>
                        )}
                      </View>
                      <View style={styles.artistInfo}>
                        <Text style={styles.searchResultText}>{artist.name}</Text>
                        <Text style={styles.searchResultSubtext}>
                          {artist.followers?.total ? 
                            `${Math.floor(artist.followers.total / 1000)}K followers` : 
                            'Artist'
                          }
                        </Text>
                      </View>
                      <Ionicons name="add-circle" size={24} color="#1DB954" />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* No Results Message */}
              {showResults && artistResults.length === 0 && artistSearch.length >= 2 && !searchLoading && (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>No artists found for "{artistSearch}"</Text>
                </View>
              )}
            </View>
            
            {/* Selected Artists Bubbles */}
            {selectedArtists.length > 0 && (
              <View style={styles.selectedContainer}>
                <Text style={styles.selectedLabel}>Selected Artists ({selectedArtists.length}/5):</Text>
                <View style={styles.bubblesContainer}>
                  {selectedArtists.map(artist => (
                    <View key={artist.id} style={styles.artistBubble}>
                      <Text style={styles.bubbleText}>{artist.name}</Text>
                      <TouchableOpacity
                        style={styles.bubbleRemove}
                        onPress={() => removeArtist(artist.id)}
                      >
                        <Ionicons name="close" size={14} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Genres Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Genres</Text>
            <Text style={styles.genreSubtitle}>Choose up to 5 genres you enjoy</Text>
            <View style={styles.genreGrid}>
              {availableGenres.map(genre => (
                <TouchableOpacity
                  key={genre}
                  style={[
                    styles.genreButton,
                    selectedGenres.includes(genre) && styles.genreButtonSelected
                  ]}
                  onPress={() => toggleGenre(genre)}
                >
                  <Text style={[
                    styles.genreText,
                    selectedGenres.includes(genre) && styles.genreTextSelected
                  ]}>
                    {formatGenreName(genre)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Selected Summary */}
          {(selectedArtists.length > 0 || selectedGenres.length > 0) && (
            <View style={styles.section}>
              <Text style={styles.selectedLabel}>Your Selections:</Text>
              {selectedArtists.length > 0 && (
                <Text style={styles.summaryText}>
                  🎤 {selectedArtists.map(a => a.name).join(', ')}
                </Text>
              )}
              {selectedGenres.length > 0 && (
                <Text style={styles.summaryText}>
                  🎵 {selectedGenres.map(g => formatGenreName(g)).join(', ')}
                </Text>
              )}
            </View>
          )}

          {/* Get Recommendations Button */}
          <TouchableOpacity
            style={[
              styles.recommendButton,
              (selectedArtists.length === 0 && selectedGenres.length === 0) && styles.recommendButtonDisabled
            ]}
            onPress={getRecommendations}
            disabled={selectedArtists.length === 0 && selectedGenres.length === 0}
          >
            <Text style={styles.recommendButtonText}>
              Get Recommendations ({selectedArtists.length + selectedGenres.length} selected)
            </Text>
            <Ionicons name="musical-notes" size={20} color="#FFFFFF" style={styles.buttonIcon} />
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>
      </LinearGradient>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  gradient: {
    flex: 1,
    paddingTop: Platform.OS === 'web' ? 5: 50
  },
  scrollView: {
    flex: 1,
  },
  hamburgerButton: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 40 : 50,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  header: {
    padding: Platform.OS === 'web' ? 40 : 30,
    paddingTop: Platform.OS === 'web' ? 60 : 70,
    alignItems: 'center',
  },
  title: {
    fontSize: Platform.OS === 'web' ? 32 : 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    paddingHorizontal: Platform.OS === 'web' ? 70 : 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  genreSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 15,
    marginTop: -5,
  },
  clearButton: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
  },
  discoveredCard: {
    width: 130,
    marginRight: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  discoveredAlbumArt: {
    width: 110,
    height: 110,
    borderRadius: 8,
    marginBottom: 8,
  },
  removeDiscovered: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
    padding: 2,
  },
  discoveredInfo: {
    flex: 1,
  },
  discoveredTrackName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  discoveredArtistName: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  searchContainer: {
    marginBottom: 15,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchIcon: {
    paddingLeft: 15,
  },
  searchInput: {
    flex: 1,
    padding: 15,
    paddingLeft: 10,
    color: '#FFFFFF',
    fontSize: 16,
  },
  clearSearchButton: {
    paddingRight: 15,
  },
  loadingIcon: {
    paddingRight: 15,
  },
  searchResults: {
    backgroundColor: 'rgba(25, 20, 20, 0.98)',
    borderRadius: 12,
    marginTop: 5,
    maxHeight: 550,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 220,
  },
  resultsHeader: {
    padding: 15,
    paddingBottom: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#1DB954',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  artistImageContainer: {
    marginRight: 12,
  },
  artistImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  artistImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  artistInfo: {
    flex: 1,
  },
  searchResultText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  searchResultSubtext: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 2,
  },
  noResultsContainer: {
    backgroundColor: 'rgba(25, 20, 20, 0.98)',
    borderRadius: 12,
    marginTop: 5,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  noResultsText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  selectedContainer: {
    marginTop: 15,
  },
  selectedLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  bubblesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  artistBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1DB954',
    paddingLeft: 15,
    paddingRight: 8,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  bubbleText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  bubbleRemove: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    padding: 3,
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genreButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  genreButtonSelected: {
    backgroundColor: '#1DB954',
    borderColor: '#1DB954',
  },
  genreText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  genreTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  summaryText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  recommendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1DB954',
    marginHorizontal: Platform.OS === 'web' ? 40 : 20,
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 30,
  },
  recommendButtonDisabled: {
    opacity: 0.5,
  },
  recommendButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 10,
  },
  promptContainer: {
    alignItems: 'center',
    padding: 40,
    marginTop: 100,
  },
  promptTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 10,
  },
  promptText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default HomeScreen;
