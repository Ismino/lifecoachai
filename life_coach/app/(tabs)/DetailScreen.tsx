// app/(tabs)/DetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Session {
  sessionId: string;
  name: string;
}

export default function DetailScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const sessionKeys = keys.filter((key) => key.startsWith('session_'));

      const loadedSessions = await Promise.all(sessionKeys.map(async (key) => {
        const sessionId = key.replace('session_', '');
        const name = await AsyncStorage.getItem(`name_${sessionId}`);
        return { sessionId, name: name || 'Unnamed Chat' };
      }));

      setSessions(loadedSessions);
    } catch (error) {
      console.error("Error loading sessions:", error);
    }
  };

  const handleGoToChat = (sessionId: string) => {
    router.push({ pathname: '/(tabs)/ChatScreen', params: { sessionId } });
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Alla Tidigare Chattar</Text>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.sessionId}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.sessionItem} onPress={() => handleGoToChat(item.sessionId)}>
            <Text style={styles.sessionText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Inga tidigare chattar tillgängliga</Text>}
      />
      <TouchableOpacity style={styles.newChatButton} onPress={() => handleGoToChat(new Date().getTime().toString())}>
        <Text style={styles.buttonText}>Starta ny chatt</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
        <Text style={styles.buttonText}>Till Hemsida</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f4f8' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  sessionItem: { backgroundColor: '#007BFF', padding: 15, borderRadius: 5, marginVertical: 10 },
  sessionText: { color: '#fff', fontSize: 18, textAlign: 'center' },
  emptyText: { color: '#555', fontSize: 18, textAlign: 'center', marginTop: 20 },
  newChatButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 5, marginTop: 20, alignItems: 'center' },
  homeButton: { backgroundColor: '#ffc107', padding: 15, borderRadius: 5, marginTop: 20, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18 },
});
