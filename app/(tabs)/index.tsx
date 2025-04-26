import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';

export default function HomeScreen() {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    console.log(`Searching for: ${searchText}`);
    // Add your search logic here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingreedients</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Name of a snack, fruit, or drink..."
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={setSearchText}
      />
      <Button title="Search" onPress={handleSearch} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  textInput: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
});