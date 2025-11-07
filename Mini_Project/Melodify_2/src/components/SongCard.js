import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SongCard = ({ track }) => {
  const openInSpotify = () => {
    if (track.external_urls?.spotify) {
      Linking.openURL(track.external_urls.spotify);
    }
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: track.album.images[0]?.url }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{track.name}</Text>
        <Text style={styles.artist} numberOfLines={1}>
          {track.artists.map(a => a.name).join(', ')}
        </Text>
        <TouchableOpacity style={styles.button} onPress={openInSpotify}>
          <Ionicons name="play-circle" size={18} color="#1DB954" />
          <Text style={styles.buttonText}>Preview on Spotify</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 12,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  image: { width: 80, height: 80 },
  info: { flex: 1, padding: 10, justifyContent: 'center' },
  title: { color: '#fff', fontWeight: '600', fontSize: 14 },
  artist: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginVertical: 4 },
  button: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  buttonText: { color: '#1DB954', fontSize: 12, fontWeight: '600' },
});

export default SongCard;
