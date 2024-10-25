// app/index.tsx

import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Life Coach AI</Text>
      <Text style={styles.subtitle}>Your journey to self-improvement starts here!</Text>
      
      <Link href="/(tabs)/LoginScreen" style={styles.link}>
        <Text style={styles.linkText}>Login</Text>
      </Link>
      <Link href="/(tabs)/MainScreen" style={styles.link}>
        <Text style={styles.linkText}>View Sessions</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8', // Light background color
    justifyContent: 'center', // Center content vertically
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50', // Dark text color
    marginBottom: 20,
    textAlign: 'center', // Center the title text
  },
  subtitle: {
    fontSize: 20,
    color: '#555', // Gray text color for subtitle
    marginBottom: 40,
    textAlign: 'center', // Center the subtitle text
  },
  link: {
    backgroundColor: '#007BFF', // Primary color for buttons
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    textAlign: 'center', // Center the link text
  },
  linkText: {
    color: '#fff', // White text color for link text
    fontSize: 18,
    textAlign: 'center',
  },
});



