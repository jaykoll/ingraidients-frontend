import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ManagePaymentsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Payments</Text>
      <Text>Here you can manage your payment methods.</Text>
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
  },
});