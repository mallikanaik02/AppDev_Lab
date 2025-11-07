import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { wp, hp, normalize } from '../../utils/dimensions';

const CustomButton = ({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  variant = 'primary',
  disabled = false 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'secondary' && styles.secondaryButton,
        style,
        disabled && styles.disabledButton
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[
        styles.buttonText,
        variant === 'secondary' && styles.secondaryButtonText,
        textStyle,
        disabled && styles.disabledText
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1DB954',
    paddingVertical: hp(2),
    paddingHorizontal: wp(8),
    borderRadius: wp(6),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: hp(6),
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1DB954',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: normalize(16),
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButtonText: {
    color: '#1DB954',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    borderColor: '#cccccc',
  },
  disabledText: {
    color: '#666666',
  },
});

export default CustomButton;
