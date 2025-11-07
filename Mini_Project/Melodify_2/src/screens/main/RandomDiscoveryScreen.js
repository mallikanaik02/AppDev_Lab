import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSpotify } from '../../contexts/SpotifyContext';
import { Ionicons } from '@expo/vector-icons';

const RandomDiscoveryScreen = ({ navigation }) => {
  const { SpotifyAPI } = useSpotify();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);

  const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

  const fetchRandomTracks = async () => {
    try {
      setLoading(true);

      // Fetch 20 new releases albums (we're using albums as random seeds)
      const albumsData = await SpotifyAPI.makeRequest('/browse/new-releases?limit=20');

      // Fetch tracks from each album concurrently
      const allTracks = await Promise.all(
        albumsData.albums.items.map(async (album) => {
          const albumTracks = await SpotifyAPI.makeRequest(`/albums/${album.id}/tracks`);
          return albumTracks.items.map(track => ({
            ...track,
            albumImage: album.images[0]?.url,
            albumName: album.name,
            spotifyUrl: track.external_urls.spotify,
          }));
        })
      );

      setTracks(shuffleArray(allTracks.flat()));
    } catch (error) {
      console.error('Error fetching random tracks:', error);
      setTracks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomTracks();
  }, []);

  const openInSpotify = (url) => {
    if (url) Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1DB954', '#191414', '#000']} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Random Discovery</Text>
          <TouchableOpacity onPress={fetchRandomTracks}>
            <Ionicons name="refresh" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          {loading && <Text style={styles.loading}>Loading...</Text>}
          {tracks.map(track => (
            <View key={track.id} style={styles.trackCard}>
              {track.albumImage && (
                <Image source={{ uri: track.albumImage }} style={styles.albumImage} />
              )}
              <View style={styles.trackInfo}>
                <Text style={styles.trackName}>{track.name}</Text>
                <Text style={styles.artistName}>{track.artists.map(a => a.name).join(', ')}</Text>
                <Text style={styles.albumName}>{track.albumName}</Text>
                <TouchableOpacity 
                  style={styles.playButton} 
                  onPress={() => openInSpotify(track.spotifyUrl)}
                >
                  <Ionicons name="play-circle" size={24} color="#fff" />
                                    <Text style={styles.playText}>Play on Spotify</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1, paddingTop: Platform.OS === 'web' ? 60 : 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  scrollView: { paddingHorizontal: 20 },
  trackCard: { 
    flexDirection: 'row', 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderRadius: 12, 
    marginBottom: 15, 
    padding: 10, 
    alignItems: 'center' 
  },
  albumImage: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  trackInfo: { flex: 1 },
  trackName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  artistName: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  albumName: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontStyle: 'italic', marginTop: 2 },
  playButton: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  playText: { color: '#1DB954', fontSize: 14, marginLeft: 5 },
  loading: { color: '#fff', textAlign: 'center', marginTop: 20 },
});

export default RandomDiscoveryScreen;
