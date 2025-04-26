import { Slot, useRouter } from 'expo-router';
import { View, Text } from 'react-native';
import { useState, useEffect } from 'react';

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Replace with actual auth logic
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Checking authentication...');
      const token = await fakeAuthCheck(); // Replace with your auth logic
      console.log('Token:', token);
      console.log('Is Authenticated:', !!token);

      setIsAuthenticated(!!token);

      if (!token) {
        console.log('Redirecting to login...');
        router.replace('/(auth)/login'); // Redirect to login if not authenticated
      }

      setLoading(false); // Mark loading as complete
    };

    checkAuth();
  }, [router]);

  if (loading) {
    // Show a loading screen while checking authentication
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Always render the Slot component
  return <Slot />;
}

// Simulated authentication check (replace with real logic)
const fakeAuthCheck = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(false), 1000); // Simulate no token (not authenticated)
  });
};