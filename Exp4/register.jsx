import React from 'react';
import { Keyboard, Platform, StyleSheet, Text, TouchableWithoutFeedback, View, ActivityIndicator } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import { useUser } from '../../../hooks/useUser'
import Ionicons from 'react-native-vector-icons/Ionicons'

import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import Spacer from '../../../components/Spacer'
import ThemedButton from '../../../components/ThemedButton'
import ThemedTextInput from "../../../components/ThemedTextInput"
import { Colors } from '../../../constants/Colors'

const Register = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const { user, register } = useUser()
  const router = useRouter()

  const handleSubmit = async () => {
    setError(null)
    setLoading(true)

    try {
      await register(email, password, "professor")
      console.log('current user is: ', user)
      router.replace("/professor-dashboard/homepage")
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const Wrapper = Platform.OS === 'web' ? React.Fragment : TouchableWithoutFeedback
  const wrapperProps = Platform.OS === 'web' ? {} : { onPress: Keyboard.dismiss }

  return (
    <Wrapper {...wrapperProps}>
      <ThemedView style={styles.background}>
        <View style={styles.container}>
          
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="person-add-outline" size={48} color={Colors.secondary} />
            </View>
            <ThemedText style={styles.title}>
              Create Professor Account
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Join us to manage internship opportunities
            </ThemedText>
          </View>

          {/* Registration Form Card */}
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Email Address</ThemedText>
              <ThemedTextInput
                style={styles.textInput}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Password</ThemedText>
              <ThemedTextInput
                style={styles.textInput}
                placeholder="Create a secure password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={20} color={Colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <ThemedButton 
              style={styles.registerButton} 
              onPress={handleSubmit}
              disabled={loading}
            >
              <View style={styles.buttonContent}>
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" style={styles.buttonLoader} />
                ) : (
                  <Ionicons name="person-add" size={20} color="#ffffff" style={styles.buttonIcon} />
                )}
                <Text style={styles.buttonText}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Text>
              </View>
            </ThemedButton>
          </View>

          {/* Footer */}
          <View style={styles.footerContainer}>
            <ThemedText style={styles.footerText}>
              Already have an account?
            </ThemedText>
            <Link href="/professor/login" replace style={styles.loginLink}>
              <ThemedText style={styles.loginText}>
                Sign In Here
              </ThemedText>
            </Link>
          </View>

        </View>
      </ThemedView>
    </Wrapper>
  )
}

export default Register

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.title,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.text,
    textAlign: 'center',
  },
  formCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 20,
    padding: 25,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.title,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
    marginBottom: 20,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  registerButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonLoader: {
    marginRight: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerContainer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 8,
  },
  loginLink: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  loginText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.secondary,
    textDecorationLine: 'underline',
  },
})
