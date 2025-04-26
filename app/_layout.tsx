// app/_layout.tsx
import { Slot, SplashScreen, useRouter, useSegments } from 'expo-router';
import { View, Text } from 'react-native';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../src/context/AuthContext'; // Adjust path

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      console.log('InitialLayout: Auth loading finished. isAuthenticated:', isAuthenticated);
      const inAuthGroup = segments[0] === '(auth)';

      if (isAuthenticated && !isLoading) {
         // If the user is signed in, redirect them to the main app
         console.log('InitialLayout: User authenticated, ensuring navigation to (tabs)');
         router.replace('/(tabs)'); // Or your main app group
      } else if (!isAuthenticated && !isLoading && !inAuthGroup) {
        // If the user is not signed in and not in the auth group, redirect to login
        console.log('InitialLayout: User not authenticated, ensuring navigation to (auth)/login');
        router.replace('/(auth)/login');
      } else {
          console.log('InitialLayout: Navigation state is already correct or staying within auth group.');
      }
      // Hide the splash screen after navigation logic
      SplashScreen.hideAsync();
    } else {
        console.log('InitialLayout: Still loading auth state...');
    }
  }, [isAuthenticated, isLoading, segments, router]);


  // Show loading screen or null while determining auth state and navigating
  if (isLoading) {
     // You can return a dedicated loading component here if you prefer
     return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Loading App...</Text>
        </View>
     );
  }

  // Render the Slot for Expo Router to handle nested routes
  console.log("InitialLayout: Rendering Slot...");
  return <Slot />;
}


export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}