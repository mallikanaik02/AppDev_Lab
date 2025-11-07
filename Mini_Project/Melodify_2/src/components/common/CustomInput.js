import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { wp, hp, normalize } from '../../utils/dimensions';

const CustomInput = ({ 
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  leftIcon,
  rightIcon,
  style,
  inputStyle,
  ...props 
}) => {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getInputContainerStyle = () => {
    return [
      styles.inputContainer,
      {
        backgroundColor: theme.surface,
        borderColor: error ? '#E22134' : (isFocused ? theme.primary : theme.border),
      },
      style
    ];
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          {label}
        </Text>
      )}
      
      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <Ionicons 
            name={leftIcon} 
            size={normalize(20)} 
            color={theme.textSecondary} 
            style={styles.leftIcon}
          />
        )}
        
        <TextInput
          style={[
            styles.input,
            { color: theme.text },
            inputStyle
          ]}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity 
            onPress={togglePasswordVisibility}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={normalize(20)}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !secureTextEntry && (
          <Ionicons 
            name={rightIcon} 
            size={normalize(20)} 
            color={theme.textSecondary} 
            style={styles.rightIcon}
          />
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: hp(1),
  },
  label: {
    fontSize: normalize(14),
    marginBottom: hp(0.5),
    marginLeft: wp(1),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    minHeight: hp(6),
    ...Platform.select({
      web: {
        outline: 'none',
      },
    }),
  },
  input: {
    flex: 1,
    fontSize: normalize(16),
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(1),
    ...Platform.select({
      web: {
        outline: 'none',
      },
    }),
  },
  leftIcon: {
    marginRight: wp(2),
  },
  rightIcon: {
    marginLeft: wp(2),
  },
  eyeIcon: {
    padding: wp(1),
    marginLeft: wp(2),
  },
  errorText: {
    fontSize: normalize(12),
    color: '#E22134',
    marginTop: hp(0.5),
    marginLeft: wp(1),
  },
});

export default CustomInput;
