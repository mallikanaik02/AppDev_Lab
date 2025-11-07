import React, { useEffect } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { handleSpotifyCallback } from '../../utils/spotifyCallback'; // assuming this exports the async function
import LoadingSpinner from '../../components/common/LoadingSpinner';

const SpotifyCallbackScreen = () => {
  const { setSpotifyAccessToken, setProfile } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const processCallback = async () => {
      try {
        const url = await Linking.getInitialURL();

        if (!url) {
          console.warn('No callback URL found.');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Welcome' }],
          });
          return;
        }

        const result = await handleSpotifyCallback(url);

        if (result?.success) {
          // ✅ Update AuthContext
          setSpotifyAccessToken(result.user?.accessToken || result.token);

          setProfile(prev => ({
            ...prev,
            spotifyConnected: true,
            spotifyProfile: result.user?.profile || prev.spotifyProfile,
          }));

          // ✅ Ensure main app navigation
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        } else {
          console.error('Spotify callback failed:', result?.error);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Welcome' }],
          });
        }
      } catch (error) {
        console.error('Error processing Spotify callback:', error);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Welcome' }],
        });
      }
    };

    processCallback();
  }, [navigation, setSpotifyAccessToken, setProfile]);

  return <LoadingSpinner message="Connecting your Spotify..." />;
};

export default SpotifyCallbackScreen;
