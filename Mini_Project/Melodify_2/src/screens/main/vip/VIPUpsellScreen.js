import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../contexts/AuthContext';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../services/firebase';

const VIPUpsellScreen = ({ navigation }) => {
  const { user, profile, setProfile } = useAuth();

  const features = [
    'Access to Receptify Page',
    'Additional Easy Receptify Variations',
    'More Saved Favorites',
    'Priority Support & Help',
    'Early Access to New Features',
    'Go Ad Free',
  ];

  const handleGetVipToggle = async () => {
    if (!user) {
      alert('Please login first.');
      return;
    }

    const newPremiumStatus = !profile?.premium;

    try {
      await setDoc(
        doc(db, 'users', user.uid),
        { premium: newPremiumStatus, updatedAt: serverTimestamp() },
        { merge: true }
      );

      setProfile({ ...profile, premium: newPremiumStatus });
      alert(`VIP status turned ${newPremiumStatus ? 'ON' : 'OFF'}`);
    } catch (err) {
      alert('Failed to update VIP status: ' + err.message);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1DB954', '#191414', '#000000']}
        style={styles.gradient}
        locations={[0, 0.2, 1]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Become a VIP Member</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* VIP Badge */}
          <View style={styles.badgeContainer}>

            <Text style={styles.badgeText}>Exclusive Access</Text>
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Unlock premium perks and enhance your music experience with Receptify VIP.
          </Text>

          {/* Features Section */}
          <View style={styles.featuresCard}>
            <Text style={styles.featuresHeading}>VIP Benefits</Text>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={22} color="#1DB954" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={[
              styles.ctaButton,
              profile?.premium ? styles.ctaButtonActive : null,
            ]}
            onPress={handleGetVipToggle}
            activeOpacity={0.9}
          >
            <Text style={styles.ctaText}>
              {profile?.premium ? 'Unsubscribe VIP' : 'Get VIP Now'}
            </Text>
          </TouchableOpacity>

          {/* Small Footer Text */}
          <Text style={styles.footerNote}>
            You can cancel anytime. Your support helps us build more for music lovers like you.
          </Text>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  gradient: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'web' ? 60 : 70,
    paddingHorizontal: Platform.OS === 'web' ? 0 : 20,
    paddingBottom: 15,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: Platform.OS === 'web' ? 26 : 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  contentContainer: {
    paddingHorizontal: 30,
    paddingBottom: 60,
    alignItems: 'center',
  },
  badgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  badgeText: {
    color: '#FFD700',
    fontWeight: '600',
    fontSize: 18,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 17,
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  featuresCard: {
    width: '95%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    padding: 20,
    marginBottom: 40,
  },
  featuresHeading: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    color: '#FFF',
    marginLeft: 10,
    fontSize: 18,
  },
  ctaButton: {
    backgroundColor: '#1DB954',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 70,
    shadowColor: '#1DB954',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  ctaButtonActive: {
    backgroundColor: '#0A8D3A',
  },
  ctaText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  footerNote: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 25,
    lineHeight: 18,
    maxWidth: 300,
  },
});

export default VIPUpsellScreen;
