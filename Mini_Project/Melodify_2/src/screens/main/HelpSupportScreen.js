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

const HelpSupportScreen = ({ navigation }) => {
  const features = [
    {
      icon: 'musical-notes',
      title: 'Music Discovery',
      description: 'Search for artists and select genres to get personalized music recommendations based on your taste.',
    },
    {
      icon: 'heart',
      title: 'Recently Discovered',
      description: 'All songs you click on are automatically saved to your Recently Discovered collection for easy access.',
    },
    {
      icon: 'bar-chart',
      title: 'Music Statistics',
      description: 'Track your discovery journey with detailed statistics including favorite genres, top artists, and discovery streaks.',
    },
    {
      icon: 'search',
      title: 'Advanced Discovery',
      description: 'Multiple discovery methods including trending music, new releases, and random discovery for endless exploration.',
    },
    {
      icon: 'cloud',
      title: 'Cloud Sync',
      description: 'Your discoveries are saved to the cloud and sync across all your devices. Never lose your favorite finds.',
    },
    {
      icon: 'link',
      title: 'Spotify Integration',
      description: 'Direct integration with Spotify allows you to play any recommended song instantly in the Spotify app.',
    },
  ];

  const faqItems = [
    {
      question: 'How do I get recommendations?',
      answer: 'Go to the Home tab, select your favorite artists and genres, then tap "Get Recommendations" to discover new music.',
    },
    {
      question: 'Where are my discovered songs saved?',
      answer: 'When you click on any song in the recommendations, it\'s automatically added to your "Recently Discovered" collection on the home screen.',
    },
    {
      question: 'How do I connect my Spotify account?',
      answer: 'Go to the Profile tab and tap "Connect Spotify". You\'ll be redirected to Spotify to authorize the connection.',
    },
    {
      question: 'Can I clear my discovery history?',
      answer: 'Yes, you can clear all discovered songs from the Profile tab by tapping "Clear All Discoveries".',
    },
    {
      question: 'Do I need a Spotify Premium account?',
      answer: 'No, Melodify works with both free and premium Spotify accounts. You just need to connect your account to get started.',
    },
  ];

  const FeatureCard = ({ feature }) => (
    <View style={styles.featureCard}>
      <View style={styles.featureIcon}>
        <Ionicons name={feature.icon} size={24} color="#1DB954" />
      </View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{feature.title}</Text>
        <Text style={styles.featureDescription}>{feature.description}</Text>
      </View>
    </View>
  );

  const FAQItem = ({ item }) => (
    <View style={styles.faqItem}>
      <Text style={styles.faqQuestion}>{item.question}</Text>
      <Text style={styles.faqAnswer}>{item.answer}</Text>
    </View>
  );

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
          >
            <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Help & Support</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* App Overview */}
          <View style={styles.section}>
            <View style={styles.appOverview}>
              <Ionicons name="musical-note" size={60} color="#1DB954" />
              <Text style={styles.appTitle}>Melodify</Text>
              <Text style={styles.appVersion}>Version 1.0.0</Text>
              <Text style={styles.appDescription}>
                Your personal music discovery companion. Melodify helps you explore new music based on your favorite artists and genres, 
                powered by Spotify's vast music library.
              </Text>
            </View>
          </View>

          {/* Key Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Features</Text>
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </View>

          {/* How to Use */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How to Use Melodify</Text>
            <View style={styles.stepsContainer}>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Connect Spotify</Text>
                  <Text style={styles.stepDescription}>Link your Spotify account to access music recommendations</Text>
                </View>
              </View>
              
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Select Preferences</Text>
                  <Text style={styles.stepDescription}>Choose your favorite artists and genres on the Home screen</Text>
                </View>
              </View>
              
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Discover Music</Text>
                  <Text style={styles.stepDescription}>Get personalized recommendations and click songs you like</Text>
                </View>
              </View>
              
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>4</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Track Your Journey</Text>
                  <Text style={styles.stepDescription}>View your statistics and recently discovered songs</Text>
                </View>
              </View>
            </View>
          </View>

          {/* FAQ */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            {faqItems.map((item, index) => (
              <FAQItem key={index} item={item} />
            ))}
          </View>

          {/* Contact */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Need More Help?</Text>
            <View style={styles.contactCard}>
              <Ionicons name="mail" size={24} color="#1DB954" />
              <Text style={styles.contactText}>
                Have questions or feedback? We'd love to hear from you!
              </Text>
              <Text style={styles.contactEmail}>support@melodify.app</Text>
            </View>
          </View>

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
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: Platform.OS === 'web' ? 28 : 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
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
  appOverview: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 15,
    marginBottom: 5,
  },
  appVersion: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 15,
  },
  appDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(29, 185, 84, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  stepsContainer: {
    gap: 15,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1DB954',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
    paddingTop: 2,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  faqItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  contactCard: {
    backgroundColor: 'rgba(29, 185, 84, 0.1)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1DB954',
  },
  contactText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    lineHeight: 22,
  },
  contactEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1DB954',
  },
});

export default HelpSupportScreen;
