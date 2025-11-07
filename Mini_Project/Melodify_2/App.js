import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { SpotifyProvider } from './src/contexts/SpotifyContext';
import SimpleAppNavigator from './src/navigation/SimpleAppNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SpotifyProvider>
          <SimpleAppNavigator />
          <StatusBar style="light" />
        </SpotifyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
