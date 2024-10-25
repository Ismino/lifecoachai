// app/(tabs)/DetailScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router'; // Import the hooks

export default function DetailScreen() {
  const params = useLocalSearchParams(); // Get local search parameters
  const sessionId = params.sessionId; // Access sessionId from parameters
  const router = useRouter(); // Initialize router for navigation

  const handleGoBack = () => {
    router.push('/(tabs)/'); // Navigate to the Home Screen (index.tsx)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Session Details</Text>
      {sessionId ? (
        <Text style={styles.title}>Details for Session ID: {sessionId}</Text>
      ) : (
        <Text style={styles.error}>No session ID provided.</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={handleGoBack}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8', // Light background color
    padding: 20,
    justifyContent: 'center', // Center content vertically
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2c3e50', // Dark text color for the header
    marginBottom: 20,
    textAlign: 'center', // Center the header text
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Dark text color for session details
    marginBottom: 20,
    textAlign: 'center', // Center the title text
  },
  error: {
    fontSize: 18,
    color: 'red', // Red text color for error messages
    textAlign: 'center', // Center the error message
  },
  button: {
    backgroundColor: '#007BFF', // Primary color for buttons
    padding: 15,
    borderRadius: 5,
    marginTop: 20, // Space above the button
  },
  buttonText: {
    color: '#fff', // White text color for button text
    fontSize: 18,
    textAlign: 'center',
  },
});
