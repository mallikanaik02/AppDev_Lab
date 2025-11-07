import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSpotify } from '../../contexts/SpotifyContext';

const DiscoverScreen = ({ navigation }) => {
  const { isSpotifyConnected } = useSpotify();

  const quickDiscovery = [
    {
      id: 'trending',
      title: "What's Trending",
      subtitle: 'Popular songs right now',
      icon: 'trending-up',
      color: '#1DB954',
    },
    {
      id: 'new',
      title: 'New Releases',
      subtitle: 'Fresh music from this week',
      icon: 'star',
      color: '#FF6B6B',
    },
    {
      id: 'random',
      title: 'Random Discovery',
      subtitle: 'Surprise me with something new',
      icon: 'shuffle',
      color: '#4ECDC4',
    },
  ];

  const QuickCard = ({ item, onPress }) => (
    <TouchableOpacity
      style={[styles.quickCard, { backgroundColor: `${item.color}20` }]}
      onPress={onPress}
    >
      <Ionicons name={item.icon} size={28} color={item.color} />
      <Text style={styles.quickTitle}>{item.title}</Text>
      <Text style={styles.quickSubtitle}>{item.subtitle}</Text>
    </TouchableOpacity>
  );

  const handleQuickDiscovery = (id) => {
    switch (id) {
      case 'trending':
        navigation.navigate('Trending');
        break;
      case 'new':
        navigation.navigate('NewReleases');
        break;
      case 'random':
        navigation.navigate('RandomDiscovery');
        break;
      default:
        alert('Unknown discovery type');
    }
  };

  const handleCurrentMethod = () => {
    navigation.navigate('Home');
  };

  const ConnectSpotifyPrompt = () => (
    <View style={styles.promptContainer}>
      <Ionicons name="search-outline" size={80} color="#1DB954" />
      <Text style={styles.promptTitle}>Connect Your Spotify</Text>
      <Text style={styles.promptText}>
        Connect your Spotify account to unlock discovery methods
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
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Discover</Text>
            
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Discovery</Text>
            <View style={styles.quickGrid}>
              {quickDiscovery.map(item => (
                <QuickCard
                  key={item.id}
                  item={item}
                  onPress={() => handleQuickDiscovery(item.id)}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Method</Text>
            <TouchableOpacity
              style={styles.currentMethodCard}
              onPress={handleCurrentMethod}
            >
              <View style={styles.currentMethodHeader}>
                <View style={[styles.iconContainer, { backgroundColor: '#1DB95420' }]}>
                  <Ionicons name="musical-notes" size={24} color="#1DB954" />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>Artist & Genre Discovery</Text>
                  <Text style={styles.cardSubtitle}>Select your favorite artists and genres</Text>
                  <Text style={styles.cardDescription}>Get personalized recommendations</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#1DB954" />
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  gradient: { flex: 1 },
  scrollView: { flex: 1 },
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
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: Platform.OS === 'web' ? 40 : 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickCard: {
    width: Platform.OS === 'web' ? '31%' : '30%',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  quickTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  quickSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 16,
  },
  currentMethodCard: {
    backgroundColor: 'rgba(29, 185, 84, 0.1)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1DB954',
  },
  currentMethodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
  },
  promptContainer: {
    alignItems: 'center',
    padding: 40,
    marginTop: 100,
  },
  promptTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f7f7f7ff',
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

export default DiscoverScreen;
