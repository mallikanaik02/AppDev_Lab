import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../services/firebase';
import SpotifyAPI from '../services/spotifyApi';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [spotifyAccessToken, setSpotifyAccessToken] = useState(null);
  const [spotifyRefreshToken, setSpotifyRefreshToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Spotify Token Persistence

  const saveSpotifyTokens = async (uid, accessToken, refreshToken) => {
    try {
      if (accessToken)
        await AsyncStorage.setItem(`spotifyAccessToken_${uid}`, accessToken);
      if (refreshToken)
        await AsyncStorage.setItem(`spotifyRefreshToken_${uid}`, refreshToken);
    } catch (err) {
      console.warn('Failed to save Spotify tokens:', err);
    }
  };

  const loadSpotifyTokens = async (uid) => {
    try {
      const savedAccessToken = await AsyncStorage.getItem(`spotifyAccessToken_${uid}`);
      const savedRefreshToken = await AsyncStorage.getItem(`spotifyRefreshToken_${uid}`);

      if (savedAccessToken) {
        setSpotifyAccessToken(savedAccessToken);
        SpotifyAPI.accessToken = savedAccessToken;  // set token in SpotifyAPI service
      }
      if (savedRefreshToken) {
        setSpotifyRefreshToken(savedRefreshToken);
        SpotifyAPI.refreshToken = savedRefreshToken;  // set refresh token as well
      }
    } catch (err) {
      console.warn('Failed to load Spotify tokens:', err);
    }
  };

  const clearSpotifyTokens = async (uid) => {
    try {
      await AsyncStorage.removeItem(`spotifyAccessToken_${uid}`);
      await AsyncStorage.removeItem(`spotifyRefreshToken_${uid}`);
    } catch (err) {
      console.warn('Failed to clear Spotify tokens:', err);
    }
  };

  // Spotify Connection Helper

  const connectSpotify = async (accessToken, refreshToken, spotifyProfile) => {
    if (!user) {
      console.warn('No user authenticated: cannot save tokens');
      return;
    }
    setSpotifyAccessToken(accessToken);
    setSpotifyRefreshToken(refreshToken);
    SpotifyAPI.accessToken = accessToken;
    SpotifyAPI.refreshToken = refreshToken;
    await saveSpotifyTokens(user.uid, accessToken, refreshToken);

    if (spotifyProfile) {
      setProfile((prev) => ({
        ...prev,
        spotifyProfile,
        spotifyConnected: true,
      }));
    }
  };

  // Auth Actions

  const signUp = async (email, password, displayName) => {
    setIsLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        displayName,
        role: 'user',
        premium: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setUser(userCredential.user);
      await fetchUserProfile(userCredential.user.uid);
    } catch (err) {
      setError(err.message || 'Failed to sign up');
      setIsLoading(false);
      throw err;
    }
    setIsLoading(false);
  };

  const signIn = async (email, password) => {
    setIsLoading(true);
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      await loadSpotifyTokens(userCredential.user.uid);  // Load tokens immediately after login
      await fetchUserProfile(userCredential.user.uid);
    } catch (err) {
      setError(err.message || 'Failed to sign in');
      setIsLoading(false);
      throw err;
    }
    setIsLoading(false);
  };

  const guestLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const guestId = `guest_${Date.now()}`;
      setUser({ uid: guestId, isGuest: true });
      await setDoc(doc(db, 'users', guestId), {
        email: null,
        displayName: 'Guest User',
        role: 'guest',
        premium: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await fetchUserProfile(guestId);
    } catch (err) {
      setError(err.message || 'Failed to login as guest');
      setIsLoading(false);
      throw err;
    }
    setIsLoading(false);
  };

  const signOutUser = async () => {
    setIsLoading(true);
    try {
      const uid = user?.uid;
      if (user?.isGuest) {
        setUser(null);
        setProfile(null);
        setSpotifyAccessToken(null);
        setSpotifyRefreshToken(null);
        await clearSpotifyTokens(uid);
      } else {
        await firebaseSignOut(auth);
        setUser(null);
        setProfile(null);
        setSpotifyAccessToken(null);
        setSpotifyRefreshToken(null);
        await clearSpotifyTokens(uid);
      }
    } catch (err) {
      setError(err.message || 'Failed to sign out');
    }
    setIsLoading(false);
  };

  // Firestore Profile Loader

  const fetchUserProfile = async (uid) => {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      setProfile(userDoc.data());
    } else {
      setProfile(null);
    }
  };

  // Auth State Listener & Starter for Spotify Tokens

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await loadSpotifyTokens(firebaseUser.uid);  // ensure tokens load before profile fetch
        await fetchUserProfile(firebaseUser.uid);
      } else {
        const oldUid = user?.uid;
        setUser(null);
        setProfile(null);
        setSpotifyAccessToken(null);
        setSpotifyRefreshToken(null);
        if (oldUid) {
          await clearSpotifyTokens(oldUid);
        }
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    user,
    profile,
    spotifyAccessToken,
    spotifyRefreshToken,
    isLoading,
    error,
    signUp,
    signIn,
    guestLogin,
    signOutUser,
    fetchUserProfile,
    setProfile,
    setSpotifyAccessToken,
    setSpotifyRefreshToken,
    connectSpotify,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
