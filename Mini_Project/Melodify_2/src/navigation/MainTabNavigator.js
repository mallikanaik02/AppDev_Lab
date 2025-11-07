import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

// Screens
import DiscoverScreen from '../screens/main/DiscoverScreen';
import TrendingScreen from '../screens/main/TrendingScreen';
import NewReleasesScreen from '../screens/main/NewReleasesScreen';
import RandomDiscoveryScreen from '../screens/main/RandomDiscoveryScreen';
import StatsScreen from '../screens/main/StatsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import RecommendationsScreen from '../screens/main/RecommendationsScreen';
import HelpSupportScreen from '../screens/main/HelpSupportScreen';
import VIPUpsellScreen from '../screens/main/vip/VIPUpsellScreen';
import ReceptifyVIPScreen from '../screens/main/vip/ReceptifyVIPScreen';
import HomeDrawerNavigator from './HomeDrawerNavigator';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeDrawer" component={HomeDrawerNavigator} />
    <Stack.Screen name="Recommendations" component={RecommendationsScreen} />
  </Stack.Navigator>
);

const DiscoverStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DiscoverMain" component={DiscoverScreen} />
    <Stack.Screen name="Trending" component={TrendingScreen} />
    <Stack.Screen name="NewReleases" component={NewReleasesScreen} />
    <Stack.Screen name="RandomDiscovery" component={RandomDiscoveryScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
    <Stack.Screen name="VIPUpsell" component={VIPUpsellScreen} />
    <Stack.Screen name="ReceptifyVIP" component={ReceptifyVIPScreen} />
  </Stack.Navigator>
);

const MainTabNavigator = () => {
  const { profile } = useAuth();
  const role = profile?.role;
  const premium = profile?.premium;

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Discover: focused ? 'search' : 'search-outline',
            Stats: focused ? 'bar-chart' : 'bar-chart-outline',
            Profile: focused ? 'person' : 'person-outline',
            AdminPanel: focused ? 'settings' : 'settings-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: '#1DB954',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopWidth: 0,
          height: Platform.OS === 'web' ? 70 : 85,
          paddingBottom: Platform.OS === 'web' ? 15 : 25,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: Platform.OS === 'web' ? 12 : 11,
          fontWeight: '600',
          marginTop: 2,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Discover" component={DiscoverStack} />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="Profile" component={ProfileStack} />
      {role === 'admin' && (
        <Tab.Screen name="AdminPanel" component={() => null} options={{ title: 'Admin' }} />
      )}
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
