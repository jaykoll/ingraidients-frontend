// app/(auth)/login.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView, // Import ScrollView
  Dimensions, // Optional: For dynamic styling
} from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext'; // Adjust path if needed

const { width } = Dimensions.get('window'); // Get screen width

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (!success) {
        Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
      }
      // Navigation is handled by AuthProvider/InitialLayout
    } catch (error) {
      console.error('Login screen error:', error);
      Alert.alert('Login Error', 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingContainer} // Use a separate style for KAV
    >
      {/* ScrollView allows content to scroll when keyboard is open */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer} // Apply centering/padding here
        keyboardShouldPersistTaps="handled" // Dismiss keyboard when tapping outside inputs
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Log in to your account</Text>

        <TextInput
          style={styles.input}
          placeholder="Email Address or Username"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next" // Improves keyboard navigation
          // onSubmitEditing={() => passwordInputRef.current?.focus()} // Optional: Focus next input on submit
        />

        <TextInput
          // ref={passwordInputRef} // Optional: Ref for focusing
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          returnKeyType="done" // Set last input return key
          onSubmitEditing={handleLogin} // Optional: Trigger login on done
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/(auth)/signup" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Optional: Add Forgot Password link */}
        {/* <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Refined Styles
const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1, // Make KAV take full screen height
    backgroundColor: '#f5f5f5', // Background on the KAV
  },
  scrollContainer: {
    flexGrow: 1, // Allow content to grow and enable scrolling
    justifyContent: 'center', // Center content vertically *within* the scroll view
    alignItems: 'center', // Center content horizontally
    paddingVertical: 40, // Add more vertical padding
    paddingHorizontal: 20, // Horizontal padding
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40, // Increase space below subtitle
    textAlign: 'center',
  },
  input: {
    width: '100%', // Use full width available in padding
    maxWidth: 400, // Optional: Max width on larger screens
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  button: {
    width: '100%',
    maxWidth: 400, // Optional: Max width on larger screens
    height: 50,
    backgroundColor: '#007AFF', // Example primary color
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 15, // Increase space above button
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#a0caff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 30, // Increase space above footer
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  linkText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  forgotPassword: {
    marginTop: 20, // Adjust spacing if using
  },
});