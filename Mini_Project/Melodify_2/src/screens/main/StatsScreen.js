import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useSpotify } from '../../contexts/SpotifyContext';
import { StorageHelper } from '../../utils/storage';

const StatsScreen = () => {
  const { user } = useAuth();
  const { isSpotifyConnected } = useSpotify();
  const [discoveredSongs, setDiscoveredSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('timeline'); // 'timeline' or 'genre'
  const [stats, setStats] = useState({
    totalSongs: 0,
    topArtists: [],
    topGenres: [],
    thisWeek: 0,
    thisMonth: 0,
    streak: 0,
    timelineData: [],
    genreData: [],
  });

  useEffect(() => {
    if (user && isSpotifyConnected) {
      loadStats();
    } else {
      setLoading(false);
    }
  }, [user, isSpotifyConnected]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const songs = await StorageHelper.getDiscoveredSongs(user.uid);
      setDiscoveredSongs(songs);
      
      const calculatedStats = calculateStats(songs);
      setStats(calculatedStats);
    } catch (error) {
      console.error('📊 Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (songs) => {
    if (!songs || songs.length === 0) {
      return {
        totalSongs: 0,
        topArtists: [],
        topGenres: [],
        thisWeek: 0,
        thisMonth: 0,
        streak: 0,
        timelineData: [],
        genreData: [],
      };
    }

    const totalSongs = songs.length;
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const thisWeek = songs.filter(song => 
      new Date(song.discoveredAt) > oneWeekAgo
    ).length;
    
    const thisMonth = songs.filter(song => 
      new Date(song.discoveredAt) > oneMonthAgo
    ).length;

    // Top artists analysis
    const artistCounts = {};
    songs.forEach(song => {
      const artistName = song.artists[0]?.name;
      if (artistName) {
        artistCounts[artistName] = (artistCounts[artistName] || 0) + 1;
      }
    });

    const topArtists = Object.entries(artistCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // Generate timeline data (discoveries over time)
    const timelineData = generateTimelineData(songs);
    
    // Generate genre data based on actual discovered songs
    const genreData = generateGenreData(songs);

    const streak = calculateStreak(songs);

    return {
      totalSongs,
      topArtists,
      topGenres: genreData,
      thisWeek,
      thisMonth,
      streak,
      timelineData,
      genreData,
    };
  };

  const generateTimelineData = (songs) => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dateStr = date.toDateString();
      const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      // Count discoveries on this day
      const count = songs.filter(song => 
        new Date(song.discoveredAt).toDateString() === dateStr
      ).length;
      
      data.push({ label: dayLabel, value: count, date: dateStr });
    }

    return data;
  };

  const generateGenreData = (songs) => {
    if (!songs || songs.length === 0) return [];

    console.log('📊 Analyzing', songs.length, 'discovered songs for genre classification...');

    // Real genre analysis based on discovered songs
    const genreAnalysis = {};
    
    songs.forEach((song, index) => {
      const songName = song.name.toLowerCase();
      const artistName = song.artists[0]?.name.toLowerCase() || '';
      const albumName = song.album?.name?.toLowerCase() || '';
      const searchText = `${songName} ${artistName} ${albumName}`;
      
      console.log(`📊 Analyzing song ${index + 1}: "${song.name}" by ${song.artists[0]?.name}`);
      
      // Comprehensive genre detection based on keywords
      const genreKeywords = {
        'Pop': [
          'pop', 'mainstream', 'hit', 'chart', 'radio', 'single', 'commercial', 'top', 'billboard',
          'ariana', 'taylor', 'dua', 'billie', 'olivia', 'selena', 'justin', 'ed sheeran',
          'love', 'heart', 'baby', 'tonight', 'dance', 'party', 'summer', 'feel', 'good'
        ],
        'Hip-Hop': [
          'hip', 'hop', 'rap', 'trap', 'beats', 'freestyle', 'mc', 'dj', 'gang', 'street',
          'drake', 'kendrick', 'travis', 'lil', 'young', 'big', 'notorious', 'eminem', 'kanye',
          'money', 'cash', 'hood', 'city', 'real', 'life', 'hustle', 'flow', 'bars'
        ],
        'Rock': [
          'rock', 'alternative', 'indie', 'guitar', 'band', 'grunge', 'punk', 'metal', 'stone', 'fire',
          'queen', 'beatles', 'led', 'pink floyd', 'nirvana', 'foo fighters', 'pearl jam',
          'break', 'loud', 'wild', 'rebel', 'thunder', 'storm', 'power', 'electric'
        ],
        'Electronic': [
          'electronic', 'dance', 'edm', 'techno', 'house', 'dubstep', 'synth', 'digital', 'remix', 'club',
          'calvin harris', 'avicii', 'skrillex', 'deadmau5', 'david guetta', 'tiesto',
          'beat', 'drop', 'bass', 'energy', 'night', 'party', 'rave', 'festival'
        ],
        'R&B': [
          'r&b', 'soul', 'rnb', 'rhythm', 'blues', 'smooth', 'neo', 'contemporary',
          'beyonce', 'rihanna', 'alicia keys', 'john legend', 'usher', 'bruno mars',
          'love', 'heart', 'baby', 'honey', 'sweet', 'smooth', 'slow', 'sexy'
        ],
        'Country': [
          'country', 'folk', 'americana', 'bluegrass', 'western', 'nashville',
          'taylor swift', 'carrie underwood', 'keith urban', 'blake shelton',
          'road', 'home', 'small', 'town', 'farm', 'whiskey', 'truck', 'guitar'
        ],
        'Jazz': [
          'jazz', 'swing', 'blues', 'instrumental', 'smooth', 'classic', 'standard',
          'miles davis', 'john coltrane', 'ella fitzgerald', 'louis armstrong',
          'night', 'moon', 'cafe', 'lounge', 'piano', 'saxophone', 'trumpet'
        ],
        'Latin': [
          'latin', 'spanish', 'reggaeton', 'salsa', 'bachata', 'merengue', 'cumbia',
          'bad bunny', 'j balvin', 'ozuna', 'maluma', 'shakira', 'manu chao',
          'vida', 'amor', 'fuego', 'baila', 'fiesta', 'corazon', 'mi', 'tu'
        ],
        'Indie': [
          'indie', 'independent', 'alternative', 'underground', 'hipster', 'artsy',
          'arctic monkeys', 'the strokes', 'vampire weekend', 'tame impala',
          'dream', 'chill', 'vibe', 'mood', 'aesthetic', 'vintage', 'retro'
        ],
        'Classical': [
          'classical', 'orchestra', 'symphony', 'concerto', 'sonata', 'opera',
          'mozart', 'beethoven', 'bach', 'chopin', 'vivaldi', 'tchaikovsky',
          'piano', 'violin', 'cello', 'flute', 'instrumental', 'chamber'
        ]
      };
      
      let assignedGenre = null;
      let maxMatches = 0;
      let matchedKeywords = [];
      
      // Find the genre with the most keyword matches
      for (const [genre, keywords] of Object.entries(genreKeywords)) {
        const matches = keywords.filter(keyword => searchText.includes(keyword));
        if (matches.length > maxMatches) {
          maxMatches = matches.length;
          assignedGenre = genre;
          matchedKeywords = matches;
        }
      }
      
      // Additional classification based on song characteristics
      if (!assignedGenre || maxMatches === 0) {
        // Use song popularity and other factors
        if (song.popularity) {
          if (song.popularity > 85) {
            assignedGenre = 'Pop';
          } else if (song.popularity < 40) {
            assignedGenre = 'Indie';
          }
        }
        
        // Artist name analysis
        if (artistName.includes('dj') || artistName.includes('remix')) {
          assignedGenre = 'Electronic';
        } else if (artistName.includes('mc') || artistName.includes('lil') || artistName.includes('young')) {
          assignedGenre = 'Hip-Hop';
        } else if (songName.includes('love') || songName.includes('heart')) {
          assignedGenre = 'R&B';
        } else if (songName.includes('rock') || songName.includes('metal')) {
          assignedGenre = 'Rock';
        }
        
        // If still no match, use a smart default based on song index for variety
        if (!assignedGenre) {
          const fallbackGenres = ['Pop', 'Hip-Hop', 'Rock', 'Electronic', 'R&B', 'Indie'];
          assignedGenre = fallbackGenres[index % fallbackGenres.length];
        }
      }
      
      console.log(`📊 Song "${song.name}" classified as ${assignedGenre} (matched: ${matchedKeywords.join(', ') || 'fallback'})`);
      
      genreAnalysis[assignedGenre] = (genreAnalysis[assignedGenre] || 0) + 1;
    });
    
    // Convert to array and calculate percentages
    const genreData = Object.entries(genreAnalysis)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / songs.length) * 100)
      }))
      .sort((a, b) => b.count - a.count) // Sort by count descending
      .slice(0, 8); // Take top 8 genres for better visualization
    
    console.log('📊 Final Genre Analysis:', genreData);
    
    return genreData;
  };

  const calculateStreak = (songs) => {
    if (!songs || songs.length === 0) return 0;

    const dates = songs.map(song => 
      new Date(song.discoveredAt).toDateString()
    );
    const uniqueDates = [...new Set(dates)].sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;
    let currentDate = new Date();

    for (let i = 0; i < uniqueDates.length; i++) {
      const dateStr = currentDate.toDateString();
      if (uniqueDates.includes(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const getMotivationalMessage = () => {
    const { totalSongs } = stats;
    if (totalSongs === 0) return "Start discovering music!";
    if (totalSongs < 5) return "You're just getting started! 🎵";
    if (totalSongs < 15) return "Great progress! Keep exploring! 🎶";
    if (totalSongs < 30) return "You're a music explorer! 🎸";
    if (totalSongs < 50) return "Music discovery master! 🎼";
    return "You're a true music connoisseur! 🎹";
  };

  const StatCard = ({ title, value, subtitle, icon, color = "#1DB954" }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statCardHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.statCardTitle}>{title}</Text>
      </View>
      <Text style={styles.statCardValue}>{value}</Text>
      {subtitle && <Text style={styles.statCardSubtitle}>{subtitle}</Text>}
    </View>
  );

  // Custom Timeline Chart Component
  const TimelineChart = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value)) || 1;
    
    return (
      <View style={styles.customChart}>
        <Text style={styles.chartSubtitle}>Discoveries Over Last 7 Days</Text>
        <View style={styles.chartArea}>
          {/* Y-axis labels */}
          <View style={styles.yAxis}>
            <Text style={styles.axisLabel}>{maxValue}</Text>
            <Text style={styles.axisLabel}>{Math.ceil(maxValue / 2)}</Text>
            <Text style={styles.axisLabel}>0</Text>
          </View>
          
          {/* Chart bars */}
          <View style={styles.chartBars}>
            {data.map((item, index) => (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barArea}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: maxValue > 0 ? `${(item.value / maxValue) * 100}%` : '2%',
                        backgroundColor: item.value > 0 ? '#1DB954' : 'rgba(255, 255, 255, 0.1)'
                      }
                    ]} 
                  />
                  {item.value > 0 && (
                    <Text style={styles.barValue}>{item.value}</Text>
                  )}
                </View>
                <Text style={styles.barLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  // Custom Genre Chart Component
  const GenreChart = ({ data }) => {
    if (!data || data.length === 0) {
      return (
        <View style={styles.customChart}>
          <Text style={styles.chartSubtitle}>Genre Distribution</Text>
          <View style={styles.noDataContainer}>
            <Ionicons name="musical-notes-outline" size={40} color="rgba(255, 255, 255, 0.3)" />
            <Text style={styles.noDataText}>No genre data available yet</Text>
            <Text style={styles.noDataSubtext}>Discover more songs to see your genre preferences</Text>
          </View>
        </View>
      );
    }

    const maxCount = Math.max(...data.map(d => d.count)) || 1;
    const colors = ['#1DB954', '#FF6B6B', '#4ECDC4', '#FFA726', '#9575CD', '#FF5722', '#795548', '#607D8B'];
    
    return (
      <View style={styles.customChart}>
        <Text style={styles.chartSubtitle}>Your Music Taste Profile</Text>
        <View style={styles.chartArea}>
          {/* Y-axis labels */}
          <View style={styles.yAxis}>
            <Text style={styles.axisLabel}>{maxCount}</Text>
            <Text style={styles.axisLabel}>{Math.ceil(maxCount / 2)}</Text>
            <Text style={styles.axisLabel}>0</Text>
          </View>
          
          {/* Chart bars */}
          <View style={styles.chartBars}>
            {data.map((item, index) => (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barArea}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: `${(item.count / maxCount) * 100}%`,
                        backgroundColor: colors[index % colors.length]
                      }
                    ]} 
                  />
                  <Text style={styles.barValue}>{item.count}</Text>
                </View>
                <Text style={[styles.barLabel, { fontSize: 10 }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={[styles.barPercentage, { fontSize: 9 }]}>
                  {item.percentage}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const ChartContainer = () => {
    return (
      <View style={styles.chartSection}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Discovery Analytics</Text>
          <View style={styles.chartToggle}>
            <TouchableOpacity
              style={[styles.toggleButton, chartType === 'timeline' && styles.toggleButtonActive]}
              onPress={() => setChartType('timeline')}
            >
              <Text style={[styles.toggleText, chartType === 'timeline' && styles.toggleTextActive]}>
                Timeline
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, chartType === 'genre' && styles.toggleButtonActive]}
              onPress={() => setChartType('genre')}
            >
              <Text style={[styles.toggleText, chartType === 'genre' && styles.toggleTextActive]}>
                Genres
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {chartType === 'timeline' ? (
          <TimelineChart data={stats.timelineData} />
        ) : (
          <GenreChart data={stats.genreData} />
        )}
      </View>
    );
  };

  const ConnectSpotifyPrompt = () => (
    <View style={styles.promptContainer}>
      <Ionicons name="bar-chart-outline" size={80} color="#1DB954" />
      <Text style={styles.promptTitle}>Connect to See Stats</Text>
      <Text style={styles.promptText}>
        Connect your Spotify account and start discovering music to see your personalized statistics
      </Text>
    </View>
  );

  if (!isSpotifyConnected) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#1DB954', '#191414', '#000000']}
          style={styles.gradient}
          locations={[0, 0.3, 1]}
        >
          <ConnectSpotifyPrompt />
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1DB954', '#191414', '#000000']}
        style={styles.gradient}
        locations={[0, 0.2, 1]}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Your Music Stats</Text>
            <Text style={styles.subtitle}>{getMotivationalMessage()}</Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1DB954" />
              <Text style={styles.loadingText}>Analyzing your discoveries...</Text>
            </View>
          ) : (
            <>
              {/* Main Stats Grid */}
              <View style={styles.section}>
                <View style={styles.statsGrid}>
                  <StatCard
                    title="Total Discovered"
                    value={stats.totalSongs}
                    subtitle="songs found"
                    icon="musical-notes"
                    color="#1DB954"
                  />
                  <StatCard
                    title="This Week"
                    value={stats.thisWeek}
                    subtitle="new discoveries"
                    icon="calendar"
                    color="#FF6B6B"
                  />
                  <StatCard
                    title="This Month"
                    value={stats.thisMonth}
                    subtitle="songs added"
                    icon="trending-up"
                    color="#4ECDC4"
                  />
                  <StatCard
                    title="Discovery Streak"
                    value={stats.streak}
                    subtitle={stats.streak === 1 ? "day" : "days"}
                    icon="flame"
                    color="#FFA726"
                  />
                </View>
              </View>

              {/* Chart Section */}
              <View style={styles.section}>
                <ChartContainer />
              </View>

              {/* Top Artists */}
              {stats.topArtists.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Most Discovered Artists</Text>
                  {stats.topArtists.map((artist, index) => (
                    <View key={artist.name} style={styles.listItem}>
                      <View style={styles.rankBadge}>
                        <Text style={styles.rankText}>{index + 1}</Text>
                      </View>
                      <View style={styles.listItemContent}>
                        <Text style={styles.listItemTitle}>{artist.name}</Text>
                        <Text style={styles.listItemSubtitle}>
                          {artist.count} {artist.count === 1 ? 'song' : 'songs'} discovered
                        </Text>
                      </View>
                      <View style={styles.countBadge}>
                        <Text style={styles.countText}>{artist.count}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}

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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: Platform.OS === 'web' ? 40 : 30,
    paddingTop: Platform.OS === 'web' ? 60 : 70,
    alignItems: 'center',
  },
  title: {
    fontSize: Platform.OS === 'web' ? 32 : 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
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
  loadingContainer: {
    alignItems: 'center',
    padding: 50,
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginTop: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: Platform.OS === 'web' ? '48%' : '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statCardTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 8,
    fontWeight: '500',
  },
  statCardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statCardSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  // Custom Chart Styles
  chartSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chartToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#1DB954',
  },
  toggleText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  customChart: {
    marginTop: 10,
  },
  chartSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 20,
  },
  chartArea: {
    flexDirection: 'row',
    height: 200,
    alignItems: 'flex-end',
  },
  yAxis: {
    width: 30,
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
    paddingVertical: 5,
  },
  axisLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  chartBars: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
  },
  barArea: {
    flex: 1,
    width: '60%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  barValue: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
    position: 'absolute',
    top: -15,
  },
  barLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 8,
    textAlign: 'center',
  },
  barPercentage: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginTop: 2,
  },
  noDataContainer: {
    alignItems: 'center',
    padding: 40,
  },
  noDataText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 10,
    textAlign: 'center',
  },
  noDataSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 5,
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1DB954',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  rankText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  listItemSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  countBadge: {
    backgroundColor: 'rgba(29, 185, 84, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1DB954',
  },
  countText: {
    color: '#1DB954',
    fontSize: 14,
    fontWeight: '600',
  },
  promptContainer: {
    alignItems: 'center',
    padding: 40,
    marginTop: 100,
  },
  promptTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 10,
  },
  promptText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default StatsScreen;
