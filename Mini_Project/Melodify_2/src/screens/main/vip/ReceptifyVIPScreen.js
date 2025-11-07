import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSpotify } from '../../../contexts/SpotifyContext';

const RECEIPT_FONT = Platform.OS === 'ios' ? 'Courier New' : 'monospace';

// Format ms duration to mm:ss
const formatDuration = (ms) => {
  const totalSecs = Math.floor(ms / 1000);
  const m = Math.floor(totalSecs / 60);
  const s = totalSecs % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const ReceptifyVIPScreen = ({ navigation }) => {
  const { SpotifyAPI, spotifyUser: user } = useSpotify();
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        setLoading(true);
        if (!SpotifyAPI.accessToken) return;
        const result = await SpotifyAPI.getTopTracks('short_term', 10);
        setTopTracks(result?.items || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopTracks();
  }, [SpotifyAPI.accessToken]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1DB954" />
        <Text style={styles.loadingText}>Loading your top tracks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.receipt}>
          {/* Header */}
          <Text style={styles.title}>RECEIPTIFY</Text>
          <Text style={styles.subtitle}>THIS MONTH</Text>
          <Text style={styles.orderText}>
            ORDER #0001 FOR {user?.display_name?.toUpperCase() || 'USER'}
          </Text>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>

          <View style={styles.separator} />

          {/* Song list */}
          {topTracks.length === 0 ? (
            <Text style={styles.emptyText}>No top tracks available.</Text>
          ) : (
            <FlatList
              data={topTracks}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <View style={styles.trackRow}>
                  <Text style={styles.trackNum}>
                    {String(index + 1).padStart(2, '0')}
                  </Text>
                  <Text style={styles.trackTitle} numberOfLines={1}>
                    {item.name.toUpperCase()}
                  </Text>
                  <Text style={styles.trackDuration}>
                    {formatDuration(item.duration_ms)}
                  </Text>
                </View>
              )}
            />
          )}

          <View style={styles.separator} />

          {/* Footer */}
          <Text style={styles.footerLine}>
            ITEM COUNT: {topTracks.length || 0}
          </Text>
          <Text style={styles.footerLine}>
            TOTAL: {topTracks.length > 0 ? `${topTracks.length * 3}:00` : '00:00'}
          </Text>
          <Text style={styles.footerLine}>CARD #: **** **** **** 2025</Text>
          <Text style={styles.footerLine}>AUTH CODE: 123421</Text>
          <Text style={styles.footerLine}>
            CARDHOLDER: {user?.display_name?.toUpperCase() || 'USER'}
          </Text>

          <View style={styles.thankYouSection}>
            <Text style={styles.thankYou}>THANK YOU FOR VISITING!</Text>
            <Text style={styles.url}>receiptify.melodify.com</Text>
          </View>

          {/* Back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#1DB954" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1DB954', // Default Spotify green background
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  receipt: {
    backgroundColor: '#fff',
    height: 600,
    width: 400,
    borderRadius: 10,
    paddingVertical: 25,
    paddingHorizontal: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  title: {
    fontFamily: RECEIPT_FONT,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: RECEIPT_FONT,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  orderText: {
    fontFamily: RECEIPT_FONT,
    fontSize: 13,
    textAlign: 'center',
  },
  dateText: {
    fontFamily: RECEIPT_FONT,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 15,
  },
  separator: {
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    marginVertical: 15,
  },
  trackRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  trackNum: {
    fontFamily: RECEIPT_FONT,
    fontSize: 13,
    width: 25,
  },
  trackTitle: {
    flex: 1,
    fontFamily: RECEIPT_FONT,
    fontSize: 13,
  },
  trackDuration: {
    fontFamily: RECEIPT_FONT,
    fontSize: 13,
    width: 40,
    textAlign: 'right',
  },
  footerLine: {
    fontFamily: RECEIPT_FONT,
    fontSize: 12,
    textAlign: 'left',
  },
  thankYouSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  thankYou: {
    fontFamily: RECEIPT_FONT,
    fontSize: 14,
    fontWeight: 'bold',
  },
  url: {
    fontFamily: RECEIPT_FONT,
    fontSize: 11,
    marginTop: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
  },
  backText: {
    fontFamily: RECEIPT_FONT,
    fontSize: 12,
    marginLeft: 5,
    color: '#1DB954',
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontFamily: RECEIPT_FONT, fontSize: 16, marginTop: 10 },
  emptyText: {
    textAlign: 'center',
    fontFamily: RECEIPT_FONT,
    fontSize: 13,
    color: '#555',
  },
});

export default ReceptifyVIPScreen;
