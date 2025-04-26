import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Profile' }} />
      <Stack.Screen name="account-settings" options={{ title: 'Account Settings' }} />
      <Stack.Screen name="user-profile" options={{ title: 'User Profile' }} />
      <Stack.Screen name="manage-payments" options={{ title: 'Manage Payments' }} />
    </Stack>
  );
}