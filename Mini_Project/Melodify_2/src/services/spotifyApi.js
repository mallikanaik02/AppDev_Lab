const CLIENT_ID = 'xxx';
const CLIENT_SECRET = 'xxx';

const WEB_REDIRECT_URI = 'http://127.0.0.1:8081/callback';
const MOBILE_REDIRECT_URI = 'melodify2://callback';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const SPOTIFY_ACCOUNTS_BASE = 'https://accounts.spotify.com';

class SpotifyAPI {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
  }

  setAccessToken(token) {
    this.accessToken = token;
  }
  
  generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // ✅ UPDATED: allows passing a custom redirect URI
  getAuthorizationUrl(redirectOverride) {
    const scope = [
      'user-read-private',
      'user-read-email',
      'user-top-read',
      'user-read-recently-played',
      'playlist-read-private',
      'playlist-read-collaborative',
      'user-library-read',
      'user-read-playback-state',
      'user-modify-playback-state',
    ].join(' ');

    const state = this.generateRandomString(16);

    const redirectUri = redirectOverride || WEB_REDIRECT_URI;

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: redirectUri,
      state: state,
      show_dialog: 'true',
    });

    return `${SPOTIFY_ACCOUNTS_BASE}/authorize?${params.toString()}`;
  }

  // ✅ UPDATED: dynamic redirect_uri support
  async getAccessToken(authorizationCode, redirectUsed = WEB_REDIRECT_URI) {
    try {
      const response = await fetch(`${SPOTIFY_ACCOUNTS_BASE}/api/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: authorizationCode,
          redirect_uri: redirectUsed,
        }),
      });

      const data = await response.json();

      if (data.access_token) {
        this.accessToken = data.access_token;
        this.refreshToken = data.refresh_token;
        this.tokenExpiry = Date.now() + data.expires_in * 1000;
        return data;
      }

      throw new Error('Failed to get access token');
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  async makeRequest(endpoint, options = {}) {
    try {
      console.log('🎵 Making request to:', `${SPOTIFY_API_BASE}${endpoint}`);
      console.log('🎵 Access token exists:', !!this.accessToken);

      const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      console.log('🎵 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('🎵 Error response:', errorText);
        throw new Error(`Spotify API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Spotify API request failed:', error);
      throw error;
    }
  }

  async search(query, type = 'artist', limit = 20) {
    if (!this.accessToken) throw new Error('No access token available');
    const params = new URLSearchParams({ q: query, type, limit: limit.toString() });
    return await this.makeRequest(`/search?${params.toString()}`);
  }

  async getUserProfile() {
    return await this.makeRequest('/me');
  }

  async getTopTracks(timeRange = 'medium_term', limit = 20) {
    return await this.makeRequest(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`);
  }

  async getRecommendations(seedData, limit = 20) {
    if (!this.accessToken) throw new Error('No access token available');

    const seedCount =
      (seedData.seed_artists ? seedData.seed_artists.split(',').length : 0) +
      (seedData.seed_genres ? seedData.seed_genres.split(',').length : 0) +
      (seedData.seed_tracks ? seedData.seed_tracks.split(',').length : 0);

    if (seedCount === 0) throw new Error('At least one seed required');
    if (seedCount > 5) throw new Error('Max 5 seeds allowed');

    const params = new URLSearchParams({ limit: limit.toString(), ...seedData });
    return await this.makeRequest(`/recommendations?${params.toString()}`);
  }
}

export default new SpotifyAPI();
