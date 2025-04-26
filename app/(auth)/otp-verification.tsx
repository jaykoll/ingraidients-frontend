import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function OTPVerificationScreen() {
  const [otp, setOtp] = useState('');
  const router = useRouter();

  const handleVerify = () => {
    // Simulate successful OTP verification
    console.log('OTP verified');
    router.replace('/(tabs)'); // Navigate to the main app
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP Verification</Text>
      <Button title="Verify OTP" onPress={handleVerify} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});