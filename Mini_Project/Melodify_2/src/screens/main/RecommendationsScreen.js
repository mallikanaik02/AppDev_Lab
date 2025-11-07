import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
  Image,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSpotify } from '../../contexts/SpotifyContext';
import { useAuth } from '../../contexts/AuthContext';
import { StorageHelper } from '../../utils/storage';

const RecommendationsScreen = ({ navigation, route }) => {
  const { SpotifyAPI } = useSpotify();
  const { user } = useAuth();
  const { selectedArtists, selectedGenres } = route.params || { selectedArtists: [], selectedGenres: [] };
  
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecommendations();
  }, []);

  const getRecommendations = async () => {
    try {
      setLoading(true);
      console.log('🎵 Getting recommendations...');
      console.log('🎵 Selected artists:', selectedArtists.length);
      console.log('🎵 Selected genres:', selectedGenres.length);
      
      const searchQueries = [];
      const allTracks = [];
      
      // Create search queries based on BOTH selected artists AND genres
      
      // 1. Search for songs BY the selected artists
      if (selectedArtists.length > 0) {
        selectedArtists.forEach(artist => {
          searchQueries.push(`artist:"${artist.name}"`);
          searchQueries.push(`${artist.name} top tracks`);
        });
      }
      
      // 2. Search for songs SIMILAR to selected artists
      if (selectedArtists.length > 0) {
        selectedArtists.forEach(artist => {
          searchQueries.push(`similar to ${artist.name}`);
          searchQueries.push(`like ${artist.name}`);
        });
      }
      
      // 3. Search for songs in selected genres
      if (selectedGenres.length > 0) {
        selectedGenres.forEach(genre => {
          searchQueries.push(`genre:"${genre}"`);
          searchQueries.push(`${genre} music`);
          searchQueries.push(`${genre} hits`);
        });
      }
      
      // 4. Combine artists + genres for more specific searches
      if (selectedArtists.length > 0 && selectedGenres.length > 0) {
        selectedArtists.slice(0, 2).forEach(artist => {
          selectedGenres.slice(0, 2).forEach(genre => {
            searchQueries.push(`${artist.name} ${genre}`);
          });
        });
      }
      
      // If nothing selected, use default searches
      if (selectedArtists.length === 0 && selectedGenres.length === 0) {
        searchQueries.push('popular music', 'top hits', 'new music', 'trending songs');
      }
      
      console.log('🎵 Total search queries:', searchQueries.length);
      
      // Perform searches with more queries for 20+ songs
      const queriesToUse = searchQueries
        .sort(() => 0.5 - Math.random()) // Randomize order
        .slice(0, 8); // Use 8 queries for more variety
      
      for (const query of queriesToUse) {
        try {
          console.log('🎵 Searching for:', query);
          
          const searchResults = await SpotifyAPI.search(query, 'track', 10); // 10 per query
          
          if (searchResults.tracks && searchResults.tracks.items) {
            console.log('🎵 Found', searchResults.tracks.items.length, 'tracks for:', query);
            allTracks.push(...searchResults.tracks.items);
          }
          
          // Add small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 150));
          
        } catch (searchError) {
          console.error('🎵 Search error for query:', query, searchError);
        }
      }
      
      if (allTracks.length > 0) {
        // Remove duplicates based on track ID
        const uniqueTracks = allTracks.filter((track, index, self) => 
          index === self.findIndex(t => t.id === track.id)
        );
        
        // Prioritize tracks by selected artists (put them first)
        const artistTracks = [];
        const otherTracks = [];
        
        uniqueTracks.forEach(track => {
          const isFromSelectedArtist = selectedArtists.some(selectedArtist =>
            track.artists.some(trackArtist => 
              trackArtist.name.toLowerCase().includes(selectedArtist.name.toLowerCase()) ||
              selectedArtist.name.toLowerCase().includes(trackArtist.name.toLowerCase())
            )
          );
          
          if (isFromSelectedArtist) {
            artistTracks.push(track);
          } else {
            otherTracks.push(track);
          }
        });
        
        // Combine: artist tracks first, then similar tracks
        const prioritizedTracks = [
          ...artistTracks.sort(() => 0.5 - Math.random()),
          ...otherTracks.sort(() => 0.5 - Math.random())
        ];
        
        // Take at least 25 songs
        const finalSelection = prioritizedTracks.slice(0, Math.max(25, prioritizedTracks.length));
        setRecommendations(finalSelection);
        
        console.log('🎵 Final recommendations:');
        console.log('🎵 - From selected artists:', artistTracks.length);
        console.log('🎵 - Similar/genre tracks:', otherTracks.length);
        console.log('🎵 - Total selected:', finalSelection.length);
        
      } else {
        console.log('🎵 No tracks found');
        setRecommendations([]);
      }
      
    } catch (error) {
      console.error('🎵 Error getting recommendations:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  // Open in Spotify and save as discovered
  const openInSpotify = async (spotifyUrl, track = null) => {
    // Save as discovered if track is provided and user is logged in
    if (track && user) {
      await StorageHelper.saveDiscoveredSong(track, user.uid);
      console.log('💾 Saved as discovered:', track.name);
    }
    
    if (Platform.OS === 'web') {
      window.open(spotifyUrl, '_blank');
    } else {
      Linking.openURL(spotifyUrl);
    }
  };
  const handleBackPress = () => {
  // The callback triggering a reload of "recently discovered" songs, passed via navigation params
  if (route.params?.onGoBack) {
    route.params.onGoBack();
  }
  navigation.goBack();
};

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1DB954', '#191414', '#000000']}
        style={styles.gradient}
        locations={[0, 0.2, 1]}
      >
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity
  style={styles.backButton}
  onPress={handleBackPress}  // Use the new function
>
  <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
</TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.title}>Your Recommendations</Text>
            <Text style={styles.subtitle}>
              {recommendations.length > 0 ? `${recommendations.length} songs found` : 'Loading...'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.refreshButton, loading && styles.refreshButtonDisabled]}
            onPress={getRecommendations}
            disabled={loading}
          >
            <Ionicons 
              name="refresh" 
              size={24} 
              color="#FFFFFF" 
              style={[loading && styles.refreshIcon]}
            />
          </TouchableOpacity>
        </View>

        {/* Selected Preferences Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Based on your selections:</Text>
          <View style={styles.summaryContent}>
            {selectedArtists.length > 0 && (
              <Text style={styles.summaryText}>
                🎤 {selectedArtists.map(a => a.name).join(', ')}
              </Text>
            )}
            {selectedGenres.length > 0 && (
              <Text style={styles.summaryText}>
                🎵 {selectedGenres.join(', ')}
              </Text>
            )}
            {selectedArtists.length === 0 && selectedGenres.length === 0 && (
              <Text style={styles.summaryText}>
                🎶 No selections made
              </Text>
            )}
          </View>
        </View>

        {/* Recommendations List */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1DB954" />
              <Text style={styles.loadingText}>
                Finding music {selectedArtists.length > 0 ? `by ${selectedArtists.map(a => a.name).join(', ')} ` : ''}
                {selectedGenres.length > 0 ? `in ${selectedGenres.join(', ')} ` : ''}
                for you...
              </Text>
            </View>
          ) : (
            <View style={styles.tracksContainer}>
              {recommendations.length > 0 ? (
                recommendations.map((track, index) => (
                  <TouchableOpacity
                    key={`${track.id}-${index}-${Date.now()}`}
                    style={styles.trackCard}
                    onPress={() => openInSpotify(track.external_urls.spotify, track)}
                  >
                    <View style={styles.rankContainer}>
                      <Text style={styles.rankNumber}>{index + 1}</Text>
                    </View>
                    
                    <Image
                      source={{ uri: track.album.images[2]?.url || track.album.images[0]?.url }}
                      style={styles.albumArt}
                    />
                    
                    <View style={styles.trackInfo}>
                      <Text style={styles.trackName} numberOfLines={1}>
                        {track.name}
                      </Text>
                      <Text style={styles.artistName} numberOfLines={1}>
                        {track.artists[0].name}
                      </Text>
                      <Text style={styles.albumName} numberOfLines={1}>
                        {track.album.name}
                      </Text>
                      {track.popularity && (
                        <View style={styles.popularityContainer}>
                          <View style={styles.popularityBar}>
                            <View 
                              style={[
                                styles.popularityFill, 
                                { width: `${track.popularity}%` }
                              ]} 
                            />
                          </View>
                          <Text style={styles.popularityText}>{track.popularity}% popular</Text>
                        </View>
                      )}
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.playButton}
                      onPress={() => openInSpotify(track.external_urls.spotify, track)}
                    >
                      <Ionicons name="play" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noResultsContainer}>
                  <Ionicons name="search" size={60} color="rgba(255, 255, 255, 0.3)" />
                  <Text style={styles.noResultsText}>No recommendations found</Text>
                  <Text style={styles.noResultsSubtext}>
                    Try selecting different artists or genres
                  </Text>
                  <TouchableOpacity style={styles.retryButton} onPress={getRecommendations}>
                    <Text style={styles.retryButtonText}>Try Again</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'web' ? 60 : 70,
    paddingBottom: 20,
    paddingHorizontal: Platform.OS === 'web' ? 40 : 20,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  refreshButton: {
    padding: 8,
  },
  refreshButtonDisabled: {
    opacity: 0.5,
  },
  refreshIcon: {
    opacity: 0.5,
  },
  title: {
    fontSize: Platform.OS === 'web' ? 28 : 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: Platform.OS === 'web' ? 16 : 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  summaryContainer: {
    paddingHorizontal: Platform.OS === 'web' ? 40 : 20,
    paddingBottom: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  summaryContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
  },
  summaryText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 50,
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginTop: 15,
    textAlign: 'center',
  },
  tracksContainer: {
    paddingHorizontal: Platform.OS === 'web' ? 40 : 20,
  },
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  rankContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1DB954',
  },
  albumArt: {
    width: 55,
    height: 55,
    borderRadius: 8,
    marginRight: 12,
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  artistName: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  albumName: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  popularityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  popularityBar: {
    width: 60,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginRight: 8,
  },
  popularityFill: {
    height: '100%',
    backgroundColor: '#1DB954',
    borderRadius: 2,
  },
  popularityText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1DB954',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  noResultsContainer: {
    alignItems: 'center',
    padding: 50,
  },
  noResultsText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 18,
    marginTop: 15,
    marginBottom: 8,
  },
  noResultsSubtext: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RecommendationsScreen;
