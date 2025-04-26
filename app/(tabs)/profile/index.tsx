import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  const handleNavigation = (path: '/profile/account-settings' | '/profile/user-profile' | '/profile/manage-payments') => {
    router.push(path);
  };

  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => handleNavigation('/profile/account-settings')}
        >
          <Text style={styles.optionText}>Account Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={() => handleNavigation('/profile/user-profile')}
        >
          <Text style={styles.optionText}>User Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={() => handleNavigation('/profile/manage-payments')}
        >
          <Text style={styles.optionText}>Manage Payments</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionsContainer: {
    marginTop: 16,
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 18,
    color: '#007BFF',
  },
});
// import { View, Text, StyleSheet } from 'react-native';

// export default function ProfileScreen() {
//   return (
//     <View style={styles.container}>
//       <Text>Profile</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });