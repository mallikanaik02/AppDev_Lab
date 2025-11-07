import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const admins = {
  'vpg@gmail.com': '1234',
  'mmn@gmail.com': '1234',
};

const AdminLogin = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setIsLoading(true);
    if (admins[email] === password) {
      setError('');
      await AsyncStorage.setItem('adminLoggedIn', 'true');
      await AsyncStorage.setItem('adminEmail', email);
      setIsLoading(false);
      navigation.replace('AdminPanel', { adminEmail: email });
    } else {
      setIsLoading(false);
      setError('Invalid admin credentials');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1DB954', '#191414']} style={styles.gradient}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Admin Access</Text>
          <Text style={styles.subtitle}>Sign in as admin to manage users</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Admin Email</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter admin email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter admin password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          {!!error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  gradient: { flex: 1 },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 50 : 60,
    left: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  titleContainer: {
    paddingTop: Platform.OS === 'web' ? 120 : 140,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#FFFFFF',
    marginTop: 40,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 50,
    height: Platform.OS === 'web' ? 380 : 420,
    ...Platform.select({
      web: {
        maxWidth: 420,
        alignSelf: 'center',
        width: '100%',
      },
    }),
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333' },
  error: { color: '#E22134', fontSize: 14, textAlign: 'center', marginTop: 10 },
  loginButton: {
    backgroundColor: '#1DB954',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  loginButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});

export default AdminLogin;
