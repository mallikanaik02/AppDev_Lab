import { Dimensions, Platform } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Base dimensions (mobile-first)
const baseWidth = 375; // iPhone X width
const baseHeight = 812; // iPhone X height

export const isWeb = Platform.OS === 'web';
export const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';

// Scale factor calculation
const widthScale = screenWidth / baseWidth;
const heightScale = screenHeight / baseHeight;
const scale = isWeb ? 1 : Math.min(widthScale, heightScale);

// Width percentage - responsive for web
export const wp = (percentage) => {
  if (isWeb) {
    // Constrain max width for web to prevent it from being too wide
    const maxWidth = Math.min(screenWidth * 0.9, 1200); // Max 1200px or 90% of screen
    return Math.min((screenWidth * percentage) / 100, maxWidth * (percentage / 100));
  }
  return (screenWidth * percentage) / 100;
};

// Height percentage - responsive for web
export const hp = (percentage) => {
  if (isWeb) {
    // No artificial constraints on web height
    return (screenHeight * percentage) / 100;
  }
  return (screenHeight * percentage) / 100;
};

// Font and size normalization
export const normalize = (size) => {
  if (isWeb) {
    // No scaling for web - use actual sizes
    return size;
  }
  return Math.round(size * scale);
};

// Web-specific utilities
export const webContainer = {
  maxWidth: isWeb ? 1200 : '100%',
  marginHorizontal: isWeb ? 'auto' : 0,
  paddingHorizontal: isWeb ? 20 : 0,
};

// Platform-specific spacing
export const spacing = {
  xs: isWeb ? 4 : normalize(4),
  sm: isWeb ? 8 : normalize(8),
  md: isWeb ? 16 : normalize(16),
  lg: isWeb ? 24 : normalize(24),
  xl: isWeb ? 32 : normalize(32),
  xxl: isWeb ? 48 : normalize(48),
};

// Platform-specific border radius
export const borderRadius = {
  sm: isWeb ? 4 : normalize(4),
  md: isWeb ? 8 : normalize(8),
  lg: isWeb ? 12 : normalize(12),
  xl: isWeb ? 20 : normalize(20),
  xxl: isWeb ? 25 : normalize(25),
};
