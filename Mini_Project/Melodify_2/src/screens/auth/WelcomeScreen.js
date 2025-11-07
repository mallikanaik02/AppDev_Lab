import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { wp, hp, normalize } from '../../utils/dimensions';
import { useAuth } from '../../contexts/AuthContext';

const MAX_REPEAT_ATTEMPTS = 3;

const WelcomeScreen = ({ navigation }) => {
  const { guestLogin } = useAuth();
  const [quote, setQuote] = useState(null);
  const previousQuotes = useRef(new Set());
  const repeatCount = useRef(0);

  const getRandomLocalQuote = () => {
    const randomIndex = Math.floor(Math.random() * localQuotes.length);
    return localQuotes[randomIndex];
  };

  // 🎵 Fetch quote from Quotable API
  const fetchQuoteFromAPI = async () => {
    try {
      const response = await fetch(`https://api.quotable.io/random?tags=music&cb=${Date.now()}`);
      const data = await response.json();

      if (data && data.content) {
        const fetchedQuote = { text: data.content, author: data.author || "Unknown" };

        if (previousQuotes.current.has(fetchedQuote.text)) {
          repeatCount.current += 1;
          if (repeatCount.current >= MAX_REPEAT_ATTEMPTS) {
            repeatCount.current = 0;
            const localQuote = getRandomLocalQuote();
            setQuote(localQuote);
            previousQuotes.current.add(localQuote.text);
            return;
          }
          await fetchQuoteFromAPI();
          return;
        } else {
          repeatCount.current = 0;
          setQuote(fetchedQuote);
          previousQuotes.current.add(fetchedQuote.text);
          if (previousQuotes.current.size > 10) {
            const iter = previousQuotes.current.values();
            previousQuotes.current.delete(iter.next().value);
          }
        }
      } else {
        const localQuote = getRandomLocalQuote();
        setQuote(localQuote);
        previousQuotes.current.add(localQuote.text);
      }
    } catch (error) {
      console.warn('🎵 API quote fetch failed, using local fallback:', error.message);
      const localQuote = getRandomLocalQuote();
      setQuote(localQuote);
      previousQuotes.current.add(localQuote.text);
    }
  };

  useEffect(() => {
    fetchQuoteFromAPI();
  }, []);

  const handleGuestLogin = async () => {
    try {
      await guestLogin();
      navigation.replace('Home');
    } catch (error) {
      alert('Failed to continue as Guest: ' + error.message);
    }
  };
  const localQuotes = [
  { text: "Music is the universal language of mankind.", author: "Henry Wadsworth Longfellow" },
  { text: "Where words fail, music speaks.", author: "Hans Christian Andersen" },
  { text: "One good thing about music, when it hits you, you feel no pain.", author: "Bob Marley" },
  { text: "Music expresses that which cannot be put into words.", author: "Victor Hugo" },
  { text: "Without music, life would be a mistake.", author: "Friedrich Nietzsche" },
  { text: "Music can change the world.", author: "Ludwig van Beethoven" },
  { text: "Life seems to go on without effort when I am filled with music.", author: "George Eliot" },
];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient
        colors={['#1DB954', '#191414', '#000000']}
        style={styles.gradient}
        locations={[0, 0.7, 1]}
      >
        <View style={styles.content}>
          {quote && (
            <View style={styles.quoteContainer}>
              <Text style={styles.quoteText}>"{quote.text}"</Text>
              <Text style={styles.quoteAuthor}>- {quote.author}</Text>
            </View>
          )}

          <View style={styles.logoSection}>
            <Image
              source={require('../../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appName}>Melodify</Text>
            <Text style={styles.tagline}>Your Music, Analyzed & Discovered</Text>
          </View>

          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('SignUp')}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>I Already Have an Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton, { marginTop: 10, borderColor: '#1DB954' }]}
              onPress={handleGuestLogin}
              activeOpacity={0.8}
            >
              <Text style={[styles.secondaryButtonText, { color: '#1DB954' }]}>Continue as Guest</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton, { marginTop: 10, borderColor: '#FFD700' }]}
              onPress={() => navigation.navigate('AdminLogin')}
              activeOpacity={0.8}
            >
              <Text style={[styles.secondaryButtonText, { color: '#FFD700' }]}>Admin</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    ...Platform.select({
      web: {
        height: '100vh',
        width: '100vw',
      },
    }),
  },
  gradient: {
    flex: 1,
    ...Platform.select({
      web: {
        height: '100vh',
        width: '100vw',
      },
    }),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop:15,
    ...Platform.select({
      web: {
        height: '100vh',
        maxWidth: 700,
        alignSelf: 'center',
        paddingHorizontal: 50,
        paddingVertical: 50,
      },
    }),
  },
  quoteContainer: {
    width: '100%',
    paddingVertical: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: 30,
    alignSelf: 'stretch',
  },
  quoteText: {
    fontSize: Platform.OS === 'web' ? 20 : normalize(18),
    fontStyle: 'italic',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  quoteAuthor: {
    fontSize: Platform.OS === 'web' ? 14 : normalize(14),
    textAlign: 'right',
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: wp(20),
    height: wp(20),
    marginBottom: 10,
  },
  appName: {
    fontSize: Platform.OS === 'web' ? 48 : normalize(36),
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 10,
    paddingTop:3,
  },
  tagline: {
    fontSize: Platform.OS === 'web' ? 20 : normalize(16),
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  buttonSection: {
    width: '100%',
    alignItems: 'center',
    ...Platform.select({
      web: {
        maxWidth: 400,
      },
    }),
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    paddingVertical: Platform.OS === 'web' ? 18 : hp(2.2),
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#1DB954',
    fontWeight: 'bold',
    fontSize: Platform.OS === 'web' ? 18 : normalize(18),
  },
  secondaryButton: {
    borderColor: '#FFFFFF',
    borderWidth: 2,
    backgroundColor: 'transparent',
    paddingVertical: Platform.OS === 'web' ? 18 : hp(2.2),
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: Platform.OS === 'web' ? 18 : normalize(18),
  },
});

export default WelcomeScreen;
