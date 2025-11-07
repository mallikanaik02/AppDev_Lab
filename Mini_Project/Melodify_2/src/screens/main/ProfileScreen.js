import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useSpotify } from '../../contexts/SpotifyContext';
import { StorageHelper } from '../../utils/storage';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';

const ProfileScreen = ({ navigation }) => {
  const { user, profile, signOutUser, setProfile } = useAuth();
  const {
    isSpotifyConnected,
    spotifyUser,
    connectSpotify,
    disconnectSpotify,
    SpotifyAPI,
    isLoading: spotifyIsLoading,
  } = useSpotify();

  const [spotifyProfile, setSpotifyProfile] = useState(null);
  const [discoveredSongs, setDiscoveredSongs] = useState([]);
  const [stats, setStats] = useState({ today: 0, thisWeek: 0, thisMonth: 0 });
  const [loading, setLoading] = useState(false);
  const [connectingSpotify, setConnectingSpotify] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, [user, isSpotifyConnected]);

  useEffect(() => {
    if (connectingSpotify && isSpotifyConnected) {
      setConnectingSpotify(false);
      navigation.navigate('Home'); // Change 'Home' to your actual Home route name if needed
    }
  }, [connectingSpotify, isSpotifyConnected, navigation]);

  const loadProfileData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const songs = await StorageHelper.getDiscoveredSongs(user.uid);
      setDiscoveredSongs(songs);

      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      setStats({
        today: songs.filter((s) => new Date(s.discoveredAt) > oneDayAgo).length,
        thisWeek: songs.filter((s) => new Date(s.discoveredAt) > oneWeekAgo).length,
        thisMonth: songs.filter((s) => new Date(s.discoveredAt) > oneMonthAgo).length,
      });

      setSpotifyProfile(isSpotifyConnected ? spotifyUser : null);
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to sign out?')) signOutUser();
    } else {
      Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: () => signOutUser() },
      ]);
    }
  };

  const handleSpotifyConnection = async () => {
    if (profile?.role === 'guest') {
      Alert.alert('Guest Mode', 'Please sign up or log in to connect Spotify.');
      return;
    }
    if (isSpotifyConnected) {
      if (Platform.OS === 'web') {
        const confirmed = window.confirm(
          'Are you sure you want to disconnect from Spotify?'
        );
        if (confirmed) {
          disconnectSpotify();
          setSpotifyProfile(null);
        }
      } else {
        Alert.alert('Disconnect Spotify', 'Are you sure you want to disconnect from Spotify?', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disconnect',
            onPress: () => {
              disconnectSpotify();
              setSpotifyProfile(null);
            },
          },
        ]);
      }
    } else {
      try {
        setConnectingSpotify(true);
        await connectSpotify();
        // Redirect happens in useEffect when connection is confirmed
      } catch (e) {
        setConnectingSpotify(false);
        Alert.alert('Spotify Connection Failed', e?.message || 'Please try again.');
      }
    }
  };

  const clearDiscoveries = () => {
    Alert.alert(
      'Clear All Discoveries',
      'This will permanently delete all your discovered songs. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageHelper.clearDiscoveredSongs(user.uid);
              setDiscoveredSongs([]);
              setStats({ today: 0, thisWeek: 0, thisMonth: 0 });
              Alert.alert('Success', 'All discoveries have been cleared.');
            } catch {
              Alert.alert('Error', 'Failed to clear discoveries.');
            }
          },
        },
      ]
    );
  };

  // VIP toggle handler
  const toggleVipStatus = async () => {
    if (!user) return;
    const newPremiumStatus = !profile?.premium;
    try {
      await setDoc(
        doc(db, 'users', user.uid),
        { premium: newPremiumStatus, updatedAt: serverTimestamp() },
        { merge: true }
      );
      setProfile({ ...profile, premium: newPremiumStatus });
    } catch (err) {
      Alert.alert('Error', 'Failed to update VIP status: ' + err.message);
    }
  };

  // ------- Loading indicator for connect/discover/auth -------
  if (loading || connectingSpotify || spotifyIsLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#191414', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1DB954" />
        <Text style={{ color: "#fff", fontSize: 18, marginTop: 16 }}>Loading your profile…</Text>
      </View>
    );
  }

  // ----------- UI COMPONENTS (Unchanged) ------------

  const ProfileSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const ProfileItem = ({
    icon,
    title,
    subtitle,
    onPress,
    rightElement,
    color = '#1DB954',
  }) => (
    <TouchableOpacity
      style={styles.profileItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[styles.profileItemIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.profileItemContent}>
        <Text style={styles.profileItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.profileItemSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement ||
        (onPress && (
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
        ))}
    </TouchableOpacity>
  );

  const StatCard = ({ title, value, color = '#1DB954' }) => (
    <View style={[styles.statCard, { borderColor: color }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1DB954', '#191414', '#000']}
        style={styles.gradient}
        locations={[0, 0.2, 1]}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.userName}>
              {profile?.role === 'guest'
                ? 'Guest User'
                : user?.displayName || user?.email || 'User'}
            </Text>
            <Text style={styles.userEmail}>
              {profile?.role === 'guest' ? 'Guest' : user?.email || ''}
            </Text>
          </View>

          {/* Discovery Stats */}
          <ProfileSection title="Your Discovery Stats">
            <View style={styles.statsContainer}>
              <StatCard title="Today" value={stats.today} color="#FFCC00" />
              <StatCard title="This Week" value={stats.thisWeek} color="#FF6B6B" />
              <StatCard title="This Month" value={stats.thisMonth} color="#4ECDC4" />
            </View>
          </ProfileSection>

          {/* Music Service */}
          <ProfileSection title="Music Service">
            {profile?.role !== 'guest' ? (
              <ProfileItem
                icon={isSpotifyConnected ? 'checkmark-circle' : 'link'}
                title="Spotify"
                subtitle={
                  isSpotifyConnected
                    ? spotifyProfile
                      ? `Connected as ${spotifyProfile.display_name}`
                      : 'Connected'
                    : 'Connect to get personalized recommendations'
                }
                onPress={handleSpotifyConnection}
                color={isSpotifyConnected ? '#1DB954' : '#666'}
                rightElement={
                  <View
                    style={[
                      styles.connectionBadge,
                      {
                        backgroundColor: isSpotifyConnected
                          ? '#1DB954'
                          : 'rgba(255,255,255,0.1)',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.connectionBadgeText,
                        {
                          color: isSpotifyConnected
                            ? '#fff'
                            : 'rgba(255,255,255,0.7)',
                        },
                      ]}
                    >
                      {isSpotifyConnected ? 'Connected' : 'Connect'}
                    </Text>
                  </View>
                }
              />
            ) : (
              <Text style={{ color: '#aaa', padding: 10, fontStyle: 'italic' }}>
                Connect Spotify available for signed in users only.
              </Text>
            )}
          </ProfileSection>

          {/* Settings */}
          <ProfileSection title="Settings">
            <ProfileItem
              icon="notifications"
              title="Notifications"
              subtitle="Manage your notification preferences"
              color="#FFA726"
            />
            <ProfileItem
              icon="moon"
              title="Dark Theme"
              subtitle="🌞 / 🌙"
              color="#9575CD"
            />
            <ProfileItem
              icon="download"
              title="Export Data"
              subtitle="Download your discovered songs"
              color="#4ECDC4"
            />
          </ProfileSection>

          {/* VIP Membership Section */}
          {profile?.role === 'user' && (
            <ProfileSection title="VIP Membership">
              <ProfileItem
                icon="star"
                title="VIP Access"
                subtitle={
                  profile?.premium
                    ? 'You have VIP access'
                    : 'Upgrade to VIP for exclusive features'
                }
                onPress={toggleVipStatus}
                rightElement={
                  <TouchableOpacity
                    onPress={toggleVipStatus}
                    style={{ padding: 10 }}
                  >
                    <Ionicons
                      name={profile?.premium ? 'star' : 'star-outline'}
                      size={24}
                      color={profile?.premium ? '#FFD700' : '#aaa'}
                    />
                  </TouchableOpacity>
                }
                color={profile?.premium ? '#FFD700' : '#666'}
              />
              {!profile?.premium && (
                <TouchableOpacity onPress={() => navigation.navigate('VIPUpsell')}>
                  <Text
                    style={{
                      color: '#1DB954',
                      fontWeight: '600',
                      marginTop: 10,
                      textAlign: 'center',
                    }}
                  >
                    Learn more about VIP benefits
                  </Text>
                </TouchableOpacity>
              )}
            </ProfileSection>
          )}

          {/* Data */}
          <ProfileSection title="Data">
            <ProfileItem
              icon="trash"
              title="Clear All Discoveries"
              subtitle="Delete all discovered songs"
              onPress={clearDiscoveries}
              color="#FF6B6B"
            />
            <ProfileItem
              icon="help-circle"
              title="Help & Support"
              subtitle="Get help with using Melodify"
              onPress={() => navigation.navigate('HelpSupport')}
              color="#4ECDC4"
            />
          </ProfileSection>

          {/* Account */}
          <ProfileSection title="Account">
            <ProfileItem
              icon="log-out"
              title="Sign Out"
              subtitle="Sign out of your account"
              onPress={handleSignOut}
              color="#FF6B6B"
            />
          </ProfileSection>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appInfoText}>Melodify v1.0.0</Text>
            <Text style={styles.appInfoText}>Made with ❤️ for music lovers</Text>
            <Text style={styles.appInfoText}>by Mallika Naik</Text>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  gradient: { flex: 1 },
  scrollView: { flex: 1 },
  header: {
    alignItems: 'center',
    padding: Platform.OS === 'web' ? 40 : 30,
    paddingTop: Platform.OS === 'web' ? 70 : 70,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#1DB954',
  },
  userName: { fontSize: 30, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  userEmail: { fontSize: 20, color: 'rgba(255,255,255,0.7)' },
  loadingContainer: { alignItems: 'center', paddingVertical: 10 },
  section: { paddingHorizontal: Platform.OS === 'web' ? 60 : 20, marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#fff', marginBottom: 15 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
  },
  statValue: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  statTitle: { fontSize: 15, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  profileItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  profileItemContent: { flex: 1 },
  profileItemTitle: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 3 },
  profileItemSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  connectionBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  connectionBadgeText: { fontSize: 12, fontWeight: '600' },
  appInfo: { alignItems: 'center', padding: 20, marginTop: 20 },
  appInfoText: { fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 5 },
});

export default ProfileScreen;
