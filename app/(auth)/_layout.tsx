// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    // Make sure there are NO other components like <View>, <Text> etc.
    // directly inside this <Stack> component. Only Stack.Screen is allowed.
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="otp-verification" />
      {/* Add any other auth screens here using Stack.Screen */}
    </Stack>
  );
}