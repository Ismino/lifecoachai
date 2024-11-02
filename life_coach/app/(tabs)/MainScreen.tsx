// app/(tabs)/MainScreen.tsx

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const sessions = [
  { id: '1', title: 'Coach Session 1' },
  { id: '2', title: 'Coach Session 2' },
];

export default function MainScreen() {
  const router = useRouter();

  const navigateToDetail = (sessionId: string) => {
    router.push(`/DetailScreen?sessionId=${sessionId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Sessions</Text>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigateToDetail(item.id)}
            style={styles.sessionButton}
          >
            <Text style={styles.sessionTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE5B4', // Light background color for the main screen
    padding: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#CC735A', // Darker text color for the header
    marginBottom: 20,
    textAlign: 'center', // Center the header text
  },
  sessionButton: {
    backgroundColor: '#FFA07A', 
    padding: 15,
    borderRadius: 25,
    marginVertical: 10, // Space between buttons
    shadowColor: '#000', // Add shadow for a raised effect
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3, // Android shadow
  },
  sessionTitle: {
    color: '#fff', // White text color for button text
    fontSize: 18,
    textAlign: 'center',
  },
});
