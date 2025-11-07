import { StyleSheet, Platform } from 'react-native';
import { Colors } from '../constants/Colors';
import { wp, hp, normalize } from '../utils/dimensions';

export const GlobalStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    paddingTop: Platform.OS === 'ios' ? hp(5) : hp(2),
  },
  
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
  },
  
  // Text Styles
  title: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: hp(2),
  },
  
  subtitle: {
    fontSize: normalize(18),
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: hp(1),
  },
  
  bodyText: {
    fontSize: normalize(16),
    color: Colors.dark.textSecondary,
    lineHeight: normalize(22),
  },
  
  // Button Styles
  primaryButton: {
    backgroundColor: Colors.spotifyGreen,
    paddingVertical: hp(2),
    paddingHorizontal: wp(8),
    borderRadius: wp(6),
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp(1),
    minHeight: hp(6),
  },
  
  primaryButtonText: {
    color: Colors.spotifyWhite,
    fontSize: normalize(16),
    fontWeight: '600',
  },
  
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingVertical: hp(2),
    paddingHorizontal: wp(8),
    borderRadius: wp(6),
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp(1),
    minHeight: hp(6),
  },
  
  secondaryButtonText: {
    color: Colors.dark.text,
    fontSize: normalize(16),
    fontWeight: '500',
  },
  
  // Card Styles
  card: {
    backgroundColor: Colors.dark.card,
    borderRadius: wp(3),
    padding: wp(4),
    marginVertical: hp(1),
    marginHorizontal: wp(4),
    shadowColor: Colors.dark.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  // Input Styles
  inputContainer: {
    marginVertical: hp(1),
    marginHorizontal: wp(4),
  },
  
  input: {
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: wp(2),
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    fontSize: normalize(16),
    color: Colors.dark.text,
    minHeight: hp(6),
  },
  
  inputLabel: {
    fontSize: normalize(14),
    color: Colors.dark.textSecondary,
    marginBottom: hp(0.5),
    marginLeft: wp(1),
  },
  
  // Spacing
  spacing: {
    xs: wp(1),
    sm: wp(2),
    md: wp(4),
    lg: wp(6),
    xl: wp(8),
  },
  
  // Margins and Paddings
  marginTop: {
    marginTop: hp(2),
  },
  
  marginBottom: {
    marginBottom: hp(2),
  },
  
  paddingHorizontal: {
    paddingHorizontal: wp(4),
  },
  
  paddingVertical: {
    paddingVertical: hp(2),
  },
});
