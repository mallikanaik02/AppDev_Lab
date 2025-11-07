import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SpotifyAPI from '../services/spotifyApi';
import { handleSpotifyCallback } from '../utils/spotifyCallback';
import { useAuth } from './AuthContext';

const SpotifyContext = createContext({});

async function refreshAccessToken(uid, refreshToken) {
  try {
    
    const response = await fetch('<YOUR_BACKEND_REFRESH_ENDPOINT>', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    const data = await response.json();
    if (response.ok && data.accessToken) {
      await AsyncStorage.setItem(`spotify_access_token_${uid}`, data.accessToken);
      return data.accessToken;
    }
  } catch (e) {
    console.error("Failed to refresh Spotify access token:", e);
  }
  return null;
}

export const SpotifyProvider = ({ children }) => {
  const { user } = useAuth();

  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
  const [spotifyUser, setSpotifyUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      if (!user?.uid) {
        if (isMounted) {
          setIsSpotifyConnected(false);
          setSpotifyUser(null);
        }
        return;
      }
      setIsLoading(true);
      try {
        if (Platform.OS !== 'web') {
          if (isMounted) {
            setIsSpotifyConnected(true);
            setSpotifyUser({
              id: 'mobile_user',
              display_name: 'Mobile User',
              email: 'mobile@mock.com',
              images: [{ url: 'https://i.pravatar.cc/300' }],
            });
          }
          return;
        }

        const callbackResult = await handleSpotifyCallback();
        if (callbackResult.success && isMounted) {
          setSpotifyUser(callbackResult.user);
          setIsSpotifyConnected(true);
          return;
        }

        let savedToken = await AsyncStorage.getItem(`spotify_access_token_${user.uid}`);
        const savedRefresh = await AsyncStorage.getItem(`spotify_refresh_token_${user.uid}`);

        if (savedToken && savedRefresh) {
          // Optionally refresh token if expired here
          // Your token expiry logic needed here, omitted for brevity

          // Let's assume you detected token needs refresh:
          const newToken = await refreshAccessToken(user.uid, savedRefresh);
          if (newToken) {
            savedToken = newToken;
          }

          SpotifyAPI.accessToken = savedToken;
          SpotifyAPI.refreshToken = savedRefresh;

          const profile = await SpotifyAPI.getUserProfile();
          if (profile && isMounted) {
            setSpotifyUser(profile);
            setIsSpotifyConnected(true);
            return;
          }
        }

        // No tokens or refresh failed
        if (isMounted) {
          setIsSpotifyConnected(false);
          setSpotifyUser(null);
        }
      } catch (error) {
        console.error('Spotify initialization error:', error);
        if (isMounted) {
          setIsSpotifyConnected(false);
          setSpotifyUser(null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const connectSpotify = async () => {
    if (!user?.uid) {
      console.warn('No user logged in: cannot connect Spotify');
      return;
    }
    if (Platform.OS !== 'web') {
      setIsSpotifyConnected(true);
      return;
    }
    setIsLoading(true);
    try {
      const authUrl = SpotifyAPI.getAuthorizationUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Connect error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectSpotify = async () => {
    if (!user?.uid) {
      console.warn('No user logged in: cannot disconnect Spotify');
      return;
    }
    try {
      SpotifyAPI.accessToken = null;
      SpotifyAPI.refreshToken = null;
      await AsyncStorage.multiRemove([
        `spotify_access_token_${user.uid}`,
        `spotify_refresh_token_${user.uid}`,
      ]);
      setIsSpotifyConnected(false);
      setSpotifyUser(null);
      console.log('Disconnected from Spotify');
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  };

  return (
    <SpotifyContext.Provider
      value={{
        isSpotifyConnected,
        spotifyUser,
        isLoading,
        connectSpotify,
        disconnectSpotify,
        SpotifyAPI,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) throw new Error('useSpotify must be used within SpotifyProvider');
  return context;
};
