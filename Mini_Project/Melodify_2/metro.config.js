const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add 'cjs' to resolver extensions for Firebase compatibility
config.resolver.sourceExts.push('cjs');

// Clear resolver cache to fix nullthrows error
config.resetCache = true;

// Fix dependency resolution
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;
