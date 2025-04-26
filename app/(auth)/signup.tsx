// app/(auth)/signup.tsx
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
  ScrollView, // Ensure ScrollView is imported
  Dimensions,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext'; // Adjust path if needed

const { width } = Dimensions.get('window');

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    // Basic validation (keep your existing or enhanced validation)
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
     if (!email.includes('@')) {
       Alert.alert('Error', 'Please enter a valid email address.');
       return;
    }
     if (password.length < 6) {
       Alert.alert('Error', 'Password must be at least 6 characters long.');
       return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const userData = {
        email: email.trim(),
        password: password,
      };
      const success = await signup(userData);

      if (success) {
        router.push({ pathname: '/(auth)/otp-verification', params: { identifier: email.trim() } });
      } else {
        Alert.alert('Signup Failed', 'Could not create account. The email might already be in use or there was a server issue.');
      }
    } catch (error: any) {
      console.error("Signup screen error:", error);
      Alert.alert('Signup Error', error?.message || 'An unexpected error occurred during signup.');
    } finally {
      setIsLoading(false);
    }
  };

  // *** The fix is wrapping the content below in ScrollView ***
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingContainer} // Style for the KAV
    >
      {/* ScrollView wraps all the visible content */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer} // Style for ScrollView's content
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* All these elements are now CHILDREN of ScrollView */}
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join us today!</Text>

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
        />

        <TextInput
          style={styles.input}
          placeholder="Password (min. 6 characters)"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          returnKeyType="next"
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#888"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={handleSignup}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSignup}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Log In</Text>
            </TouchableOpacity>
          </Link>
        </View>
         {/* Ensure no stray text is accidentally placed here */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Use styles similar to LoginScreen for consistency
const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
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
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    maxWidth: 400,
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
    maxWidth: 400,
    height: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 15,
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
    marginTop: 30,
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
});