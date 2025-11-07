import SpotifyAPI from '../services/spotifyApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getQueryParams = (url) => {
  const params = {};
  const queryString = url.split('?')[1] || '';
  queryString.split('&').forEach((part) => {
    const [key, value] = part.split('=');
    if (key) params[key] = decodeURIComponent(value);
  });
  return params;
};

export const handleSpotifyCallback = async (mobileUrl = null) => {
  try {
    // Mobile
    if (mobileUrl) {
      const params = getQueryParams(mobileUrl);
      const code = params.code;
      const state = params.state;

      console.log('🎵 Mobile Spotify callback:', code ? 'Code found' : 'None');

      if (code) {
        const tokenData = await SpotifyAPI.getAccessToken(code, 'melodify2://callback');

        await AsyncStorage.setItem('spotify_access_token', tokenData.access_token);
        if (tokenData.refresh_token) {
          await AsyncStorage.setItem('spotify_refresh_token', tokenData.refresh_token);
        }

        const profile = await SpotifyAPI.getUserProfile();
        console.log('🎵 Mobile Spotify connected as:', profile.display_name);
        return { success: true, user: profile };
      }
      return { success: false };
    }

    // Web
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');

      if (code && state) {
        const tokenData = await SpotifyAPI.getAccessToken(code);
        await AsyncStorage.setItem('spotify_access_token', tokenData.access_token);
        if (tokenData.refresh_token) {
          await AsyncStorage.setItem('spotify_refresh_token', tokenData.refresh_token);
        }

        const profile = await SpotifyAPI.getUserProfile();
        window.history.replaceState({}, document.title, window.location.pathname);

        return { success: true, user: profile };
      }
    }

    return { success: false };
  } catch (error) {
    console.error('🎵 Error handling Spotify callback:', error);
    return { success: false, error: error.message };
  }
};
