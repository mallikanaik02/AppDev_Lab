import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Platform, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSpotify } from '../../contexts/SpotifyContext';

const NewReleasesScreen = ({ navigation }) => {
  const { SpotifyAPI } = useSpotify();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNewReleases = async () => {
    try {
      setLoading(true);
      // Add a dummy timestamp param to prevent caching
      const data = await SpotifyAPI.makeRequest(`/browse/new-releases?limit=20&timestamp=${Date.now()}`);
      let items = data.albums.items || [];
      // Shuffle albums to show them in a new order
      items = items.sort(() => Math.random() - 0.5);
      setAlbums(items);
    } catch (error) {
      console.error('Error fetching new releases:', error);
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewReleases();
  }, []);

  const openSpotify = (url) => {
    if (!url) return;
    if (Platform.OS === 'web') window.open(url, '_blank');
    else Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1DB954', '#191414', '#000']} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>New Releases</Text>
          <TouchableOpacity onPress={fetchNewReleases}>
            <Ionicons name="refresh" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          {loading && <Text style={styles.loading}>Loading...</Text>}

          {albums.map((album) => (
            <TouchableOpacity
              key={album.id}
              style={styles.trackCard}
              onPress={() => openSpotify(album.external_urls.spotify)}
            >
              {album.images[0]?.url && (
                <Image source={{ uri: album.images[0].url }} style={styles.cover} />
              )}
              <View style={styles.trackInfo}>
                <Text style={styles.trackName}>{album.name}</Text>
                <Text style={styles.artistName}>{album.artists.map(a => a.name).join(', ')}</Text>
              </View>
              <Ionicons name="play-circle" size={28} color="#fff" />
            </TouchableOpacity>
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
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 10,
  },
  cover: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  trackInfo: { flex: 1 },
  trackName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  artistName: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 2 },
  loading: { color: '#fff', textAlign: 'center', marginTop: 20 },
});

export default NewReleasesScreen;
