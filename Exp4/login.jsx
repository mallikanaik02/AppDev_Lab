import { StyleSheet, Text, KeyboardAvoidingView, Platform, View, ScrollView, ActivityIndicator } from "react-native";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { useUser } from '../../../hooks/useUser';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ThemedText from "../../../components/ThemedText";
import Spacer from "../../../components/Spacer";
import ThemedButton from "../../../components/ThemedButton";
import ThemedTextInput from "../../../components/ThemedTextInput";
import { Colors } from '../../../constants/Colors';
import GuestOnly from '../../../components/auth/GuestOnly';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const { login } = useUser();
  const router = useRouter();

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      console.log("User role is:", loggedInUser?.role);

      // Navigate based on user role
      if (loggedInUser?.role === "professor") {
        router.replace("/professor/dashboard");
      } else if (loggedInUser?.role === "student") {
        router.replace("/student/dashboard");
      } else {
        setError("Invalid user role.");
      }
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestOnly>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.background}>
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            
            {/* Header Section */}
            <View style={styles.headerContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name="school-outline" size={48} color={Colors.primary} />
              </View>
              <ThemedText style={styles.title}>
                Student Login
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Welcome back! Sign in to continue
              </ThemedText>
            </View>

            {/* Login Form Card */}
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
                  placeholder="Enter your password"
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
                style={styles.loginButton} 
                onPress={handleSubmit}
                disabled={loading}
              >
                <View style={styles.buttonContent}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#ffffff" style={styles.buttonLoader} />
                  ) : (
                    <Ionicons name="log-in-outline" size={20} color="#ffffff" style={styles.buttonIcon} />
                  )}
                  <Text style={styles.buttonText}>
                    {loading ? "Signing In..." : "Sign In"}
                  </Text>
                </View>
              </ThemedButton>
            </View>

            {/* Footer */}
            <View style={styles.footerContainer}>
              <ThemedText style={styles.footerText}>
                Don't have an account?
              </ThemedText>
              <Link href="/student/register" replace style={styles.registerLink}>
                <ThemedText style={styles.registerText}>
                  Sign Up Here
                </ThemedText>
              </Link>
            </View>

          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </GuestOnly>
  );
};

export default Login;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flexGrow: 1,
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
    shadowColor: Colors.primary,
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
    shadowColor: Colors.primary,
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
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: Colors.primary,
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
  registerLink: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  registerText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
});
