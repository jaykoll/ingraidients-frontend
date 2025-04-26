import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext'; // Adjust path
import api from '../../src/services/api'; // Import api for resend

export default function OTPVerificationScreen() {
  // No need for router here if navigation is handled by root layout
  const { verifyOtp } = useAuth();
  const params = useLocalSearchParams();
  const identifier = params.identifier as string || 'your account'; // Get identifier

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false); // For Verify button
  const [isResending, setIsResending] = useState(false); // For Resend button

  const handleVerify = async () => {
    if (!identifier || otp.length !== 6) { // Check identifier presence
      Alert.alert('Error', 'Please enter a valid 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    try {
      const success = await verifyOtp(identifier, otp); // Call context verifyOtp
      if (!success) {
        Alert.alert('Verification Failed', 'Invalid OTP or identifier. Please try again.');
      }
       // If verification is successful, the AuthProvider/InitialLayout will handle navigation
    } catch (error) {
       console.error("OTP screen error:", error);
       Alert.alert('Verification Error', 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

   const handleResendOtp = async () => {
      if (!identifier) {
          Alert.alert('Error', 'Cannot resend OTP without an identifier.');
          return;
      }
      setIsResending(true);
      try {
          console.log('Resending OTP to:', identifier);
          // Make API call directly here or create a function in context if preferred
          await api.post('/auth/resend-otp', { identifier }); // Adjust endpoint/payload
          Alert.alert('OTP Resent', `A new OTP has been sent to ${identifier}.`);
      } catch (error) {
          console.error("Resend OTP error:", error);
          Alert.alert('Error', 'Could not resend OTP. Please try again later.');
      } finally {
          setIsResending(false);
      }
  }

  // ... rest of your component (JSX including OTP input, Verify button, Resend link)
  // Make sure onPress for Verify button calls handleVerify
  // Make sure onPress for Resend link calls handleResendOtp

   return (
    <KeyboardAvoidingView /* ... */ >
       <Text style={styles.title}>Verify Your Account</Text>
       <Text style={styles.subtitle}>
            Enter the 6-digit code sent to {identifier}
       </Text>
        {/* ... OTP Input ... */}
         <TextInput
            style={styles.input}
            placeholder="------"
            value={otp}
            onChangeText={setOtp}
            maxLength={6}
            keyboardType="numeric"
            /* ... other props */
         />
        {/* ... Verify Button ... */}
        <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleVerify}
            disabled={isLoading}
        >
            {isLoading ? <ActivityIndicator size="small" color="#ffffff" /> : <Text style={styles.buttonText}>Verify Code</Text>}
        </TouchableOpacity>
        {/* ... Resend Link ... */}
         <View style={styles.footer}>
            <Text style={styles.footerText}>Didn't receive the code? </Text>
            <TouchableOpacity onPress={handleResendOtp} disabled={isResending}>
                {isResending ? (
                    <ActivityIndicator size="small" color="#007AFF" />
                ) : (
                    <Text style={styles.linkText}>Resend OTP</Text>
                )}
            </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
   );
}

// ... (Keep your existing styles or reuse from login)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: '80%',
    height: 60,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 25,
    color: '#333',
    textAlign: 'center',
    letterSpacing: 10,
    fontSize: 24,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
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
  },
});